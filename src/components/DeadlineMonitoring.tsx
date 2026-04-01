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
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase';
import { toast } from 'sonner';
import { AlertTriangle, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface Deadline {
  id: string;
  booking_id: string;
  client_name: string;
  service_type: string;
  deadline: string;
  status: 'on_track' | 'at_risk' | 'overdue' | 'completed';
  progress: number;
  notes?: string;
}

export const DeadlineMonitoring = () => {
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [warningThreshold, setWarningThreshold] = useState(3); // days

  useEffect(() => {
    fetchDeadlines();
    // Refresh every 5 minutes
    const interval = setInterval(fetchDeadlines, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchDeadlines = async () => {
    setLoading(true);
    try {
      const { data: bookings } = await supabase
        .from('bookings')
        .select('id, client_name, service_type, deadline, status, progress')
        .order('deadline', { ascending: true });

      if (bookings) {
        const enrichedDeadlines: Deadline[] = bookings.map((booking) => {
          const now = new Date();
          const deadline = new Date(booking.deadline);
          const daysRemaining = Math.floor((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

          let status: Deadline['status'];
          if (booking.status === 'completed') {
            status = 'completed';
          } else if (daysRemaining < 0) {
            status = 'overdue';
          } else if (daysRemaining <= warningThreshold) {
            status = 'at_risk';
          } else {
            status = 'on_track';
          }

          return {
            id: booking.id,
            booking_id: booking.id,
            client_name: booking.client_name,
            service_type: booking.service_type,
            deadline: booking.deadline,
            status,
            progress: booking.progress || 0,
          };
        });

        setDeadlines(enrichedDeadlines);
      }
    } catch (error) {
      toast.error('Failed to fetch deadlines');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: Deadline['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="text-green-600" size={16} />;
      case 'on_track':
        return <Clock className="text-blue-600" size={16} />;
      case 'at_risk':
        return <AlertCircle className="text-yellow-600" size={16} />;
      case 'overdue':
        return <AlertTriangle className="text-red-600" size={16} />;
    }
  };

  const getStatusBadge = (status: Deadline['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'on_track':
        return 'bg-blue-100 text-blue-800';
      case 'at_risk':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
    }
  };

  const getProgressColor = (status: Deadline['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'on_track':
        return 'bg-blue-500';
      case 'at_risk':
        return 'bg-yellow-500';
      case 'overdue':
        return 'bg-red-500';
    }
  };

  const filteredDeadlines = deadlines.filter(d => {
    if (filterStatus === 'all') return true;
    return d.status === filterStatus;
  });

  const stats = {
    onTrack: deadlines.filter(d => d.status === 'on_track').length,
    atRisk: deadlines.filter(d => d.status === 'at_risk').length,
    overdue: deadlines.filter(d => d.status === 'overdue').length,
    completed: deadlines.filter(d => d.status === 'completed').length,
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-blue-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <Clock className="text-blue-600 mx-auto mb-2" size={24} />
              <p className="text-sm text-gray-600">On Track</p>
              <p className="text-2xl font-bold text-blue-600">{stats.onTrack}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-yellow-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="text-yellow-600 mx-auto mb-2" size={24} />
              <p className="text-sm text-gray-600">At Risk</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.atRisk}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-red-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertTriangle className="text-red-600 mx-auto mb-2" size={24} />
              <p className="text-sm text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-green-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckCircle className="text-green-600 mx-auto mb-2" size={24} />
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Configuration & Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Deadline Configuration</CardTitle>
          <CardDescription>Configure alerts and thresholds</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 items-center">
            <label className="text-sm font-medium">Warning Threshold (days):</label>
            <Input
              type="number"
              min="1"
              max="30"
              value={warningThreshold}
              onChange={(e) => setWarningThreshold(parseInt(e.target.value))}
              className="w-24"
            />
            <span className="text-xs text-gray-600">
              Bookings due within {warningThreshold} days will be marked as "At Risk"
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Deadlines Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Deadlines</CardTitle>
          <CardDescription>Track booking deadlines and completion progress</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            {['all', 'on_track', 'at_risk', 'overdue', 'completed'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  filterStatus === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
              </button>
            ))}
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Progress</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      Loading deadlines...
                    </TableCell>
                  </TableRow>
                ) : filteredDeadlines.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      No deadlines found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDeadlines.map((deadline) => (
                    <TableRow key={deadline.id}>
                      <TableCell className="font-medium">{deadline.client_name}</TableCell>
                      <TableCell className="capitalize">{deadline.service_type}</TableCell>
                      <TableCell className="text-sm">
                        {new Date(deadline.deadline).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(deadline.status)}
                          <Badge className={getStatusBadge(deadline.status)}>
                            {deadline.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Progress
                            value={deadline.progress}
                            className="h-2"
                          />
                          <span className="text-xs text-gray-600">{deadline.progress}%</span>
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
