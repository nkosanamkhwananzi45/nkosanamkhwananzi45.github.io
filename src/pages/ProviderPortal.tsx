import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, DollarSign, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import Layout from '@/components/Layout';

interface BookingAssignment {
  id: string;
  full_name: string;
  service_category: string;
  package_selected: string;
  status: string;
  payment_status: string;
  amount: number | null;
  due_date: string | null;
  notes: string | null;
  created_at: string;
}

const ProviderPortal = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState<BookingAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssignment, setSelectedAssignment] = useState<string | null>(null);
  const [progressNotes, setProgressNotes] = useState('');

  useEffect(() => {
    const fetchProviderData = async () => {
      try {
        setLoading(true);
        // For now, providers see bookings assigned to them via user_id
        const { data, error } = await supabase
          .from('bookings')
          .select('*')
          .eq('user_id', user?.id || '')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setAssignments(data || []);
      } catch (error) {
        console.error('Provider data error:', error);
        toast.error('Failed to load provider data');
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchProviderData();
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const paidAssignments = assignments.filter(a => a.payment_status === 'paid');
  const totalEarnings = paidAssignments.reduce((sum, a) => sum + (a.amount || 0), 0);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin" /></div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-background pt-28 px-4 pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold text-foreground">Provider Portal</h1>
            <p className="text-muted-foreground">Manage your assignments and earnings</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Active
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{assignments.filter(a => a.status !== 'completed').length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <DollarSign className="w-4 h-4" /> Earnings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R{totalEarnings.toFixed(2)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" /> Completed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{assignments.filter(a => a.status === 'completed').length}</div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="assignments" className="space-y-4">
            <TabsList>
              <TabsTrigger value="assignments">My Assignments</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
            </TabsList>

            <TabsContent value="assignments" className="space-y-4">
              {assignments.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center text-muted-foreground">No assignments yet</CardContent>
                </Card>
              ) : (
                assignments.map(a => (
                  <Card key={a.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg capitalize">{a.service_category.replace(/-/g, ' ')}</CardTitle>
                          <CardDescription>{a.package_selected} — {a.full_name}</CardDescription>
                        </div>
                        <Badge className={getStatusColor(a.status)}>{a.status}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Due Date</p>
                          <p className="font-semibold">{a.due_date ? new Date(a.due_date).toLocaleDateString('en-ZA') : '—'}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Amount</p>
                          <p className="font-semibold">R{(a.amount || 0).toFixed(2)}</p>
                        </div>
                      </div>
                      {a.notes && <p className="mt-2 text-sm text-muted-foreground">{a.notes}</p>}
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="payments" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Payment History</CardTitle>
                </CardHeader>
                <CardContent>
                  {paidAssignments.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">No payments yet</div>
                  ) : (
                    <div className="space-y-3">
                      {paidAssignments.map(p => (
                        <div key={p.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-semibold">R{(p.amount || 0).toFixed(2)}</p>
                            <p className="text-sm text-muted-foreground">{new Date(p.created_at).toLocaleDateString('en-ZA')}</p>
                          </div>
                          <Badge variant="default">Paid</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default ProviderPortal;
