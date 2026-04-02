import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { DollarSign, BookOpen, AlertCircle, TrendingUp, Calendar, Clock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { IntakeManagement } from '@/components/IntakeManagement';
import { BookingAllocation } from '@/components/BookingAllocation';
import { DeadlineMonitoring } from '@/components/DeadlineMonitoring';
import { RevenueReporting } from '@/components/RevenueReporting';
import { PaymentTracking } from '@/components/PaymentTracking';
import Layout from '@/components/Layout';

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
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch intakes count
        const { data: intakes } = await supabase
          .from('intakes')
          .select('id');

        // Fetch all bookings (with payment data)
        const { data: bookings } = await supabase
          .from('bookings')
          .select('id, status, payment_status, amount, due_date, created_at');

        if (!bookings) {
          setLoading(false);
          return;
        }

        // Calculate stats from bookings table
        const paidBookings = bookings.filter(b => b.payment_status === 'paid');
        const totalRevenue = paidBookings.reduce((sum, b) => sum + (b.amount || 0), 0);
        const pendingPayments = bookings.filter(b => b.payment_status === 'unpaid').length;
        const completedPayments = paidBookings.length;

        const now = new Date();
        const overdueBookings = bookings.filter(b => {
          if (!b.due_date) return false;
          return new Date(b.due_date) < now && b.status !== 'completed';
        }).length;

        // Group bookings by status
        const statusMap: Record<string, number> = {};
        bookings.forEach(b => {
          statusMap[b.status] = (statusMap[b.status] || 0) + 1;
        });
        const bookingsByStatus = Object.entries(statusMap).map(([status, count]) => ({ status, count }));

        // Revenue by month from paid bookings
        const monthMap: Record<string, RevenueData> = {};
        paidBookings.forEach(b => {
          const d = new Date(b.created_at);
          const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
          const label = d.toLocaleDateString('en-ZA', { year: '2-digit', month: 'short' });
          if (!monthMap[key]) {
            monthMap[key] = { month: label, revenue: 0, payments: 0 };
          }
          monthMap[key].revenue += b.amount || 0;
          monthMap[key].payments++;
        });

        const sortedRevenue = Object.entries(monthMap)
          .sort(([a], [b]) => a.localeCompare(b))
          .slice(-6)
          .map(([, v]) => v);

        setStats({
          totalIntakes: intakes?.length || 0,
          totalBookings: bookings.length,
          totalRevenue,
          pendingPayments,
          completedPayments,
          overdueBookings,
        });
        setBookingData(bookingsByStatus);
        setRevenueData(sortedRevenue);
      } catch (error) {
        console.error('Dashboard error:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const StatCard = ({ title, value, icon: Icon, prefix = '' }: { title: string; value: number; icon: React.ElementType; prefix?: string }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {prefix}{typeof value === 'number' && value >= 1000 ? `${(value / 1000).toFixed(1)}K` : value}
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">Loading...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-background pt-28 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage intakes, bookings, payments, deadlines, and revenue</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <StatCard title="Intakes" value={stats.totalIntakes} icon={BookOpen} />
            <StatCard title="Bookings" value={stats.totalBookings} icon={Calendar} />
            <StatCard title="Revenue" value={stats.totalRevenue} icon={TrendingUp} prefix="R" />
            <StatCard title="Pending" value={stats.pendingPayments} icon={AlertCircle} />
            <StatCard title="Paid" value={stats.completedPayments} icon={DollarSign} />
            <StatCard title="Overdue" value={stats.overdueBookings} icon={Clock} />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Revenue</CardTitle>
                <CardDescription>Revenue from paid bookings</CardDescription>
              </CardHeader>
              <CardContent>
                {revenueData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => `R${value}`} />
                      <Legend />
                      <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" name="Revenue (ZAR)" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">No revenue data yet</div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Bookings by Status</CardTitle>
                <CardDescription>Distribution of booking statuses</CardDescription>
              </CardHeader>
              <CardContent>
                {bookingData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie data={bookingData} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={100} label>
                        {bookingData.map((_entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">No booking data yet</div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Management Sections */}
          <Tabs defaultValue="payments" className="mt-8">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="payments">Payments</TabsTrigger>
              <TabsTrigger value="intakes">Intakes</TabsTrigger>
              <TabsTrigger value="bookings">Allocate</TabsTrigger>
              <TabsTrigger value="deadlines">Deadlines</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>

            <TabsContent value="payments" className="mt-4">
              <PaymentTracking />
            </TabsContent>

            <TabsContent value="intakes" className="mt-4">
              <IntakeManagement />
            </TabsContent>

            <TabsContent value="bookings" className="mt-4">
              <BookingAllocation />
            </TabsContent>

            <TabsContent value="deadlines" className="mt-4">
              <DeadlineMonitoring />
            </TabsContent>

            <TabsContent value="reports" className="mt-4">
              <RevenueReporting />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
