import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { DollarSign, Users, BookOpen, AlertCircle, TrendingUp, Calendar, Download, Clock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase';
import { toast } from 'sonner';
import { IntakeManagement } from '@/components/IntakeManagement';
import { BookingAllocation } from '@/components/BookingAllocation';
import { DeadlineMonitoring } from '@/components/DeadlineMonitoring';
import { RevenueReporting } from '@/components/RevenueReporting';

interface DashboardStats {
  totalIntakes: number;
  totalBookings: number;
  totalRevenue: number;
  pendingPayments: number;
  completedPayments: number;
  overdueBookings: number;
}

interface RevenueData {
  month: string;
  revenue: number;
  payments: number;
}

interface BookingData {
  status: string;
  count: number;
}

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalIntakes: 0,
    totalBookings: 0,
    totalRevenue: 0,
    pendingPayments: 0,
    completedPayments: 0,
    overdueBookings: 0,
  });
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [bookingData, setBookingData] = useState<BookingData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/dashboard');
      return;
    }

    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch intakes
        const { data: intakes } = await supabase
          .from('intakes')
          .select('id')
          .throwOnError();

        // Fetch bookings
        const { data: bookings } = await supabase
          .from('bookings')
          .select('id, status, deadline')
          .throwOnError();

        // Fetch payments
        const { data: payments } = await supabase
          .from('payments')
          .select('amount, status, created_at')
          .throwOnError();

        // Calculate stats
        const totalRevenue = payments?.reduce((sum, p) => p.status === 'completed' ? sum + (p.amount || 0) : sum, 0) || 0;
        const pendingPayments = payments?.filter(p => p.status === 'pending').length || 0;
        const completedPayments = payments?.filter(p => p.status === 'completed').length || 0;

        // Check for overdue bookings
        const now = new Date();
        const overdueBookings = bookings?.filter(b => {
          if (!b.deadline) return false;
          return new Date(b.deadline) < now && b.status !== 'completed';
        }).length || 0;

        // Group bookings by status
        const bookingsByStatus = bookings?.reduce((acc, b) => {
          const existing = acc.find(item => item.status === b.status);
          if (existing) {
            existing.count++;
          } else {
            acc.push({ status: b.status, count: 1 });
          }
          return acc;
        }, [] as BookingData[]) || [];

        // Revenue by month
        const revenueByMonth = payments?.reduce((acc, p) => {
          if (p.status !== 'completed') return acc;
          const month = new Date(p.created_at).toLocaleDateString('en-US', { year: '2-digit', month: 'short' });
          const existing = acc.find(item => item.month === month);
          if (existing) {
            existing.revenue += p.amount || 0;
            existing.payments++;
          } else {
            acc.push({ month, revenue: p.amount || 0, payments: 1 });
          }
          return acc;
        }, [] as RevenueData[]) || [];

        setStats({
          totalIntakes: intakes?.length || 0,
          totalBookings: bookings?.length || 0,
          totalRevenue,
          pendingPayments,
          completedPayments,
          overdueBookings,
        });
        setBookingData(bookingsByStatus);
        setRevenueData(revenueByMonth.slice(-6));
      } catch (error) {
        console.error('Dashboard error:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, navigate]);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  const StatCard = ({ title, value, icon: Icon }: any) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{typeof value === 'number' && value > 999 ? `R${(value / 1000).toFixed(1)}K` : `R${value}`}</div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background pt-24 px-4 pb-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage intakes, bookings, payments, deadlines, and revenue</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <StatCard title="Total Intakes" value={stats.totalIntakes} icon={BookOpen} />
          <StatCard title="Active Bookings" value={stats.totalBookings} icon={Calendar} />
          <StatCard title="Total Revenue" value={stats.totalRevenue} icon={TrendingUp} />
          <StatCard title="Pending Payments" value={stats.pendingPayments} icon={AlertCircle} />
          <StatCard title="Overdue Bookings" value={stats.overdueBookings} icon={Clock} />
        </div>

        {/* Charts */}
        <Tabs defaultValue="revenue" className="mb-8">
          <TabsList>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="bookings">Bookings Status</TabsTrigger>
          </TabsList>

          <TabsContent value="revenue" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Revenue</CardTitle>
                <CardDescription>Total revenue by month</CardDescription>
              </CardHeader>
              <CardContent>
                {revenueData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => `R${value}`} />
                      <Legend />
                      <Line type="monotone" dataKey="revenue" stroke="#3b82f6" name="Revenue (ZAR)" />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center py-8">No revenue data available</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Bookings by Status</CardTitle>
                <CardDescription>Distribution of booking statuses</CardDescription>
              </CardHeader>
              <CardContent>
                {bookingData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie data={bookingData} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={100} label>
                        {bookingData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center py-8">No booking data available</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Management Sections */}
        <Tabs defaultValue="intakes" className="mt-8">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="intakes">Manage Intakes</TabsTrigger>
            <TabsTrigger value="bookings">Allocate Bookings</TabsTrigger>
            <TabsTrigger value="deadlines">Deadlines</TabsTrigger>
            <TabsTrigger value="reports">Revenue Reports</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
          </TabsList>

          {/* Intakes Tab */}
          <TabsContent value="intakes" className="mt-4">
            <IntakeManagement />
          </TabsContent>

          {/* Booking Allocation Tab */}
          <TabsContent value="bookings" className="mt-4">
            <BookingAllocation />
          </TabsContent>

          {/* Deadline Monitoring Tab */}
          <TabsContent value="deadlines" className="mt-4">
            <DeadlineMonitoring />
          </TabsContent>

          {/* Revenue Reporting Tab */}
          <TabsContent value="reports" className="mt-4">
            <RevenueReporting />
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Payment Tracking</CardTitle>
                <CardDescription>Monitor all transactions and payment status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  Payment tracking interface - view transaction details and payment history
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
