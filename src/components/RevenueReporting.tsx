import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Download, FileText, BarChart3 } from 'lucide-react';

interface RevenueRow {
  label: string;
  transaction_count: number;
  total_amount: number;
  average_amount: number;
}

export const RevenueReporting = () => {
  const [startDate, setStartDate] = useState(
    new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [groupBy, setGroupBy] = useState('all');
  const [revenueData, setRevenueData] = useState<RevenueRow[]>([]);
  const [loading, setLoading] = useState(false);

  const generateReport = async () => {
    setLoading(true);
    try {
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select('service_category, package_selected, amount, payment_status, created_at')
        .eq('payment_status', 'paid')
        .gte('created_at', startDate)
        .lte('created_at', `${endDate}T23:59:59`);

      if (error) throw error;
      if (!bookings || bookings.length === 0) {
        setRevenueData([]);
        toast.info('No paid bookings in this period');
        return;
      }

      const grouped: Record<string, RevenueRow> = {};
      bookings.forEach(b => {
        let key = 'Total';
        if (groupBy === 'service') key = b.service_category;
        else if (groupBy === 'package') key = `${b.service_category} — ${b.package_selected}`;

        if (!grouped[key]) {
          grouped[key] = { label: key, transaction_count: 0, total_amount: 0, average_amount: 0 };
        }
        grouped[key].transaction_count++;
        grouped[key].total_amount += b.amount || 0;
        grouped[key].average_amount = grouped[key].total_amount / grouped[key].transaction_count;
      });

      setRevenueData(Object.values(grouped));
    } catch {
      toast.error('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (revenueData.length === 0) { toast.error('No data to export'); return; }
    const csv = [
      ['Revenue Report', `${startDate} to ${endDate}`],
      [],
      ['Category', 'Transactions', 'Total Revenue (ZAR)', 'Average (ZAR)'],
      ...revenueData.map(r => [r.label, r.transaction_count, `R${r.total_amount.toFixed(2)}`, `R${r.average_amount.toFixed(2)}`]),
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `revenue-${startDate}-to-${endDate}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Report exported');
  };

  const totalRevenue = revenueData.reduce((sum, r) => sum + r.total_amount, 0);
  const totalTransactions = revenueData.reduce((sum, r) => sum + r.transaction_count, 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Generate Revenue Report</CardTitle>
          <CardDescription>Export revenue data for accounting and analysis</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Group By</Label>
              <Select value={groupBy} onValueChange={setGroupBy}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Revenue</SelectItem>
                  <SelectItem value="service">Service Category</SelectItem>
                  <SelectItem value="package">Package</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={generateReport} disabled={loading}>
              {loading ? 'Generating...' : 'Generate Report'}
            </Button>
            <Button variant="outline" onClick={exportToCSV} disabled={revenueData.length === 0}>
              <Download size={16} className="mr-2" />Export CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {revenueData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-3xl font-bold text-green-600">R{totalRevenue.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">{startDate} to {endDate}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Total Transactions</p>
              <p className="text-3xl font-bold text-primary">{totalTransactions}</p>
              <p className="text-xs text-muted-foreground">
                Avg: R{totalTransactions > 0 ? (totalRevenue / totalTransactions).toFixed(2) : '0.00'}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Revenue Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          {revenueData.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <BarChart3 className="mx-auto mb-2 opacity-50" size={32} />
              Click "Generate Report" to view revenue data
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Transactions</TableHead>
                  <TableHead className="text-right">Total Revenue</TableHead>
                  <TableHead className="text-right">Average</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {revenueData.map((row, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium capitalize">{row.label.replace(/-/g, ' ')}</TableCell>
                    <TableCell className="text-right">{row.transaction_count}</TableCell>
                    <TableCell className="text-right font-semibold">R{row.total_amount.toFixed(2)}</TableCell>
                    <TableCell className="text-right">R{row.average_amount.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
