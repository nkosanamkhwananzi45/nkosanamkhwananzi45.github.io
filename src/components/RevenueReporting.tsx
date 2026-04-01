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
import { supabase } from '@/integrations/supabase';
import { toast } from 'sonner';
import { Download, FileText, BarChart3 } from 'lucide-react';

interface RevenueRow {
  provider_id?: string;
  provider_name?: string;
  service_type?: string;
  transaction_count: number;
  total_amount: number;
  average_amount: number;
}

export const RevenueReporting = () => {
  const [startDate, setStartDate] = useState(
    new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterBy, setFilterBy] = useState('all'); // all, provider, service
  const [selectedProvider, setSelectedProvider] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [revenueData, setRevenueData] = useState<RevenueRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [providers, setProviders] = useState<{ id: string; name: string }[]>([]);

  const generateReport = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('payments')
        .select('*')
        .eq('status', 'completed')
        .gte('created_at', startDate)
        .lte('created_at', endDate);

      if (filterBy === 'provider' && selectedProvider) {
        query = query.eq('provider_id', selectedProvider);
      } else if (filterBy === 'service' && selectedService) {
        query = query.eq('service_type', selectedService);
      }

      const { data: payments } = await query;

      if (!payments) {
        setRevenueData([]);
        return;
      }

      // Group and aggregate data
      const grouped = payments.reduce((acc: Record<string, RevenueRow>, payment: any) => {
        let key = 'total';
        if (filterBy === 'provider') {
          key = payment.provider_id;
        } else if (filterBy === 'service') {
          key = payment.service_type;
        }

        if (!acc[key]) {
          acc[key] = {
            provider_id: payment.provider_id,
            provider_name: payment.provider_name,
            service_type: payment.service_type,
            transaction_count: 0,
            total_amount: 0,
            average_amount: 0,
          };
        }

        acc[key].transaction_count++;
        acc[key].total_amount += payment.amount || 0;
        acc[key].average_amount = acc[key].total_amount / acc[key].transaction_count;

        return acc;
      }, {});

      setRevenueData(Object.values(grouped));
    } catch (error) {
      toast.error('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (revenueData.length === 0) {
      toast.error('No data to export');
      return;
    }

    const csv = [
      ['Revenue Report', `${startDate} to ${endDate}`],
      [],
      ['Provider/Service', 'Transaction Count', 'Total Revenue (ZAR)', 'Average Transaction (ZAR)'],
      ...revenueData.map((row) => [
        row.provider_name || row.service_type || 'Total',
        row.transaction_count,
        `R${row.total_amount.toFixed(2)}`,
        `R${row.average_amount.toFixed(2)}`,
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `revenue-report-${startDate}-to-${endDate}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Report exported as CSV');
  };

  const exportToPDF = () => {
    if (revenueData.length === 0) {
      toast.error('No data to export');
      return;
    }

    // Simple PDF generation using browser print
    const printWindow = window.open('', '', 'width=900,height=600');
    if (printWindow) {
      const html = `
        <html>
          <head>
            <title>Revenue Report</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              h1 { color: #333; }
              p { color: #666; }
              table { width: 100%; border-collapse: collapse; }
              th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
              th { background-color: #3b82f6; color: white; }
              tr:nth-child(even) { background-color: #f9fafb; }
              .total-row { font-weight: bold; background-color: #e0f2fe; }
            </style>
          </head>
          <body>
            <h1>Revenue Report</h1>
            <p><strong>Period:</strong> ${startDate} to ${endDate}</p>
            <table>
              <thead>
                <tr>
                  <th>Provider/Service</th>
                  <th>Transactions</th>
                  <th>Total Revenue</th>
                  <th>Average Transaction</th>
                </tr>
              </thead>
              <tbody>
                ${revenueData
                  .map(
                    (row) => `
                  <tr>
                    <td>${row.provider_name || row.service_type || 'Total'}</td>
                    <td>${row.transaction_count}</td>
                    <td>R${row.total_amount.toFixed(2)}</td>
                    <td>R${row.average_amount.toFixed(2)}</td>
                  </tr>
                `
                  )
                  .join('')}
              </tbody>
            </table>
          </body>
        </html>
      `;
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const totalRevenue = revenueData.reduce((sum, row) => sum + row.total_amount, 0);
  const totalTransactions = revenueData.reduce((sum, row) => sum + row.transaction_count, 0);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Generate Revenue Report</CardTitle>
          <CardDescription>Export revenue data for accounting and analysis</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="filterBy">Group By</Label>
              <Select value={filterBy} onValueChange={setFilterBy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Revenue</SelectItem>
                  <SelectItem value="provider">Provider</SelectItem>
                  <SelectItem value="service">Service Type</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={generateReport} disabled={loading}>
              {loading ? 'Generating...' : 'Generate Report'}
            </Button>
            <Button variant="outline" onClick={exportToCSV} disabled={revenueData.length === 0}>
              <Download size={16} className="mr-2" />
              Export CSV
            </Button>
            <Button variant="outline" onClick={exportToPDF} disabled={revenueData.length === 0}>
              <FileText size={16} className="mr-2" />
              Export PDF
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      {revenueData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-3xl font-bold text-blue-600">R{totalRevenue.toFixed(2)}</p>
                <p className="text-xs text-gray-500">Period: {startDate} to {endDate}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Total Transactions</p>
                <p className="text-3xl font-bold text-green-600">{totalTransactions}</p>
                <p className="text-xs text-gray-500">
                  Avg per transaction: R{(totalRevenue / totalTransactions).toFixed(2)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Revenue Table */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Breakdown</CardTitle>
          <CardDescription>Detailed revenue data by {filterBy === 'provider' ? 'provider' : filterBy === 'service' ? 'service type' : 'total'}</CardDescription>
        </CardHeader>
        <CardContent>
          {revenueData.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <BarChart3 className="mx-auto mb-2 text-gray-400" size={32} />
              Click "Generate Report" to view revenue data
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      {filterBy === 'provider'
                        ? 'Provider'
                        : filterBy === 'service'
                          ? 'Service Type'
                          : 'Category'}
                    </TableHead>
                    <TableHead className="text-right">Transactions</TableHead>
                    <TableHead className="text-right">Total Revenue</TableHead>
                    <TableHead className="text-right">Average Per Transaction</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {revenueData.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {row.provider_name || row.service_type || 'Total'}
                      </TableCell>
                      <TableCell className="text-right">{row.transaction_count}</TableCell>
                      <TableCell className="text-right font-semibold">
                        R{row.total_amount.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">R{row.average_amount.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
