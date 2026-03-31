import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, MessageCircle, DollarSign, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase';
import { toast } from 'sonner';

interface Assignment {
  id: string;
  client_id: string;
  service_type: string;
  scheduled_date: string;
  status: string;
  notes: string;
}

interface Payment {
  id: string;
  amount: number;
  status: string;
  created_at: string;
}

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
}

const ProviderPortal = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssignment, setSelectedAssignment] = useState<string | null>(null);
  const [progressNotes, setProgressNotes] = useState('');

  useEffect(() => {
    if (user?.role !== 'provider') {
      navigate('/dashboard');
      return;
    }

    const fetchProviderData = async () => {
      try {
        setLoading(true);

        // Fetch assignments
        const { data: bookingsData } = await supabase
          .from('bookings')
          .select('*')
          .eq('provider_id', user.id)
          .throwOnError();

        // Fetch payments
        const { data: paymentsData } = await supabase
          .from('payments')
          .select('*')
          .in('booking_id', bookingsData?.map(b => b.id) || [])
          .throwOnError();

        // Fetch messages
        const { data: messagesData } = await supabase
          .from('messages')
          .select('*')
          .in('booking_id', bookingsData?.map(b => b.id) || [])
          .order('created_at', { ascending: false })
          .throwOnError();

        setAssignments(bookingsData || []);
        setPayments(paymentsData || []);
        setMessages(messagesData || []);
      } catch (error) {
        console.error('Provider data error:', error);
        toast.error('Failed to load provider data');
      } finally {
        setLoading(false);
      }
    };

    fetchProviderData();
  }, [user, navigate]);

  const updateProgress = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from('progress_updates')
        .insert([{
          booking_id: bookingId,
          provider_id: user?.id,
          notes: progressNotes,
          status: 'in_progress',
        }])
        .throwOnError();

      if (error) throw error;

      // Update booking status
      await supabase
        .from('bookings')
        .update({ status: 'in_progress' })
        .eq('id', bookingId)
        .throwOnError();

      toast.success('Progress updated');
      setProgressNotes('');
      setSelectedAssignment(null);

      // Refresh data
      const { data } = await supabase
        .from('bookings')
        .select('*')
        .eq('provider_id', user?.id)
        .throwOnError();
      setAssignments(data || []);
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Failed to update progress');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalEarnings = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin" /></div>;
  }

  return (
    <div className="min-h-screen bg-background pt-24 px-4 pb-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Provider Portal</h1>
          <p className="text-muted-foreground">Manage your assignments and earnings</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Clock className="w-4 h-4" /> Active Assignments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{assignments.filter(a => a.status !== 'completed').length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <DollarSign className="w-4 h-4" /> Total Earnings
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

        {/* Main Tabs */}
        <Tabs defaultValue="assignments" className="space-y-4">
          <TabsList>
            <TabsTrigger value="assignments">My Assignments</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
          </TabsList>

          <TabsContent value="assignments" className="space-y-4">
            {assignments.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  No assignments yet
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {assignments.map(assignment => (
                  <Card key={assignment.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{assignment.service_type}</CardTitle>
                          <CardDescription>{assignment.notes || 'No additional notes'}</CardDescription>
                        </div>
                        <Badge className={getStatusColor(assignment.status)}>
                          {assignment.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Scheduled Date</p>
                          <p className="font-semibold">{new Date(assignment.scheduled_date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      {assignment.status !== 'completed' && (
                        <div className="space-y-2">
                          <textarea
                            placeholder="Add progress notes..."
                            value={selectedAssignment === assignment.id ? progressNotes : ''}
                            onChange={(e) => {
                              setSelectedAssignment(assignment.id);
                              setProgressNotes(e.target.value);
                            }}
                            className="w-full p-2 border rounded-lg text-sm"
                          />
                          <Button
                            onClick={() => updateProgress(assignment.id)}
                            disabled={!progressNotes}
                            className="w-full"
                          >
                            Update Progress
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="payments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>Track your earnings and payment status</CardDescription>
              </CardHeader>
              <CardContent>
                {payments.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No payments yet
                  </div>
                ) : (
                  <div className="space-y-3">
                    {payments.map(payment => (
                      <div key={payment.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-semibold">R{payment.amount.toFixed(2)}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(payment.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant={payment.status === 'completed' ? 'default' : 'secondary'}>
                          {payment.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Client Communication</CardTitle>
                <CardDescription>Recent messages from clients</CardDescription>
              </CardHeader>
              <CardContent>
                {messages.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No messages yet
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {messages.map(message => (
                      <div key={message.id} className="p-3 border rounded-lg">
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(message.created_at).toLocaleString()}
                        </p>
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
  );
};

export default ProviderPortal;