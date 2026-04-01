import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { AlertTriangle, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface DeadlineItem {
  id: string;
  full_name: string;
  service_category: string;
  due_date: string;
  status: string;
  deadlineStatus: 'on_track' | 'at_risk' | 'overdue' | 'completed' | 'no_date';
}

export const DeadlineMonitoring = () => {
  const [deadlines, setDeadlines] = useState<DeadlineItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [warningThreshold, setWarningThreshold] = useState(3);

  useEffect(() => {
    fetchDeadlines();
  }, [warningThreshold]);

  const fetchDeadlines = async () => {
    setLoading(true);
    try {
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select('id, full_name, service_category, due_date, status')
        .order('due_date', { ascending: true, nullsFirst: false });

      if (error) throw error;

      const now = new Date();
      const items: DeadlineItem[] = (bookings || []).map(b => {
        let deadlineStatus: DeadlineItem['deadlineStatus'];
        if (b.status === 'completed') {
          deadlineStatus = 'completed';
        } else if (!b.due_date) {
          deadlineStatus = 'no_date';
        } else {
          const daysRemaining = Math.floor((new Date(b.due_date).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          if (daysRemaining < 0) deadlineStatus = 'overdue';
          else if (daysRemaining <= warningThreshold) deadlineStatus = 'at_risk';
          else deadlineStatus = 'on_track';
        }
        return {
          id: b.id,
          full_name: b.full_name,
          service_category: b.service_category,
          due_date: b.due_date || '',
          status: b.status,
          deadlineStatus,
        };
      });

      setDeadlines(items);
    } catch {
      toast.error('Failed to fetch deadlines');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: DeadlineItem['deadlineStatus']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="text-green-600" size={16} />;
      case 'on_track': return <Clock className="text-blue-600" size={16} />;
      case 'at_risk': return <AlertCircle className="text-yellow-600" size={16} />;
      case 'overdue': return <AlertTriangle className="text-red-600" size={16} />;
      default: return <Clock className="text-muted-foreground" size={16} />;
    }
  };

  const getStatusBadgeClass = (status: DeadlineItem['deadlineStatus']) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'on_track': return 'bg-blue-100 text-blue-800';
      case 'at_risk': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filtered = deadlines.filter(d => filterStatus === 'all' || d.deadlineStatus === filterStatus);

  const stats = {
    onTrack: deadlines.filter(d => d.deadlineStatus === 'on_track').length,
    atRisk: deadlines.filter(d => d.deadlineStatus === 'at_risk').length,
    overdue: deadlines.filter(d => d.deadlineStatus === 'overdue').length,
    completed: deadlines.filter(d => d.deadlineStatus === 'completed').length,
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-blue-50 dark:bg-blue-950/20">
          <CardContent className="pt-6 text-center">
            <Clock className="text-blue-600 mx-auto mb-2" size={24} />
            <p className="text-sm text-muted-foreground">On Track</p>
            <p className="text-2xl font-bold text-blue-600">{stats.onTrack}</p>
          </CardContent>
        </Card>
        <Card className="bg-yellow-50 dark:bg-yellow-950/20">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="text-yellow-600 mx-auto mb-2" size={24} />
            <p className="text-sm text-muted-foreground">At Risk</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.atRisk}</p>
          </CardContent>
        </Card>
        <Card className="bg-red-50 dark:bg-red-950/20">
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="text-red-600 mx-auto mb-2" size={24} />
            <p className="text-sm text-muted-foreground">Overdue</p>
            <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
          </CardContent>
        </Card>
        <Card className="bg-green-50 dark:bg-green-950/20">
          <CardContent className="pt-6 text-center">
            <CheckCircle className="text-green-600 mx-auto mb-2" size={24} />
            <p className="text-sm text-muted-foreground">Completed</p>
            <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Deadline Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-center">
            <label className="text-sm font-medium">Warning Threshold (days):</label>
            <Input
              type="number"
              min="1"
              max="30"
              value={warningThreshold}
              onChange={(e) => setWarningThreshold(parseInt(e.target.value) || 3)}
              className="w-24"
            />
            <span className="text-xs text-muted-foreground">
              Bookings due within {warningThreshold} days = "At Risk"
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Deadlines</CardTitle>
          <CardDescription>Track booking deadlines</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            {['all', 'on_track', 'at_risk', 'overdue', 'completed'].map(s => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  filterStatus === s ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {s === 'all' ? 'All' : s.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </button>
            ))}
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">Loading...</TableCell>
                  </TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No deadlines found</TableCell>
                  </TableRow>
                ) : (
                  filtered.map(d => (
                    <TableRow key={d.id}>
                      <TableCell className="font-medium">{d.full_name}</TableCell>
                      <TableCell className="capitalize">{d.service_category.replace(/-/g, ' ')}</TableCell>
                      <TableCell>{d.due_date ? new Date(d.due_date).toLocaleDateString('en-ZA') : '—'}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(d.deadlineStatus)}
                          <Badge className={getStatusBadgeClass(d.deadlineStatus)}>
                            {d.deadlineStatus.replace('_', ' ')}
                          </Badge>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
