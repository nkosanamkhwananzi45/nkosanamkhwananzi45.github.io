import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { usePaymentTracking, PaymentRecord } from '@/hooks/usePaymentTracking';
import { DollarSign, Download, CheckCircle, Clock, AlertCircle, CreditCard } from 'lucide-react';

export const PaymentTracking = () => {
  const {
    payments,
    stats,
    loading,
    fetchPayments,
    updatePaymentStatus,
    exportPaymentCSV,
  } = usePaymentTracking();

  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPayment, setSelectedPayment] = useState<PaymentRecord | null>(null);
  const [newStatus, setNewStatus] = useState('');
  const [newReference, setNewReference] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchPayments(statusFilter);
  }, [statusFilter, fetchPayments]);

  const handleUpdateStatus = async () => {
    if (!selectedPayment || !newStatus) return;
    const success = await updatePaymentStatus(selectedPayment.id, newStatus, newReference || undefined);
    if (success) {
      setDialogOpen(false);
      setSelectedPayment(null);
      setNewStatus('');
      setNewReference('');
      fetchPayments(statusFilter);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle size={12} className="mr-1" />Paid</Badge>;
      case 'unpaid':
        return <Badge className="bg-red-100 text-red-800"><AlertCircle size={12} className="mr-1" />Unpaid</Badge>;
      case 'quote_requested':
        return <Badge className="bg-blue-100 text-blue-800"><Clock size={12} className="mr-1" />Quote</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <DollarSign className="text-green-600" size={24} />
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">R{stats.totalRevenue.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="text-red-600" size={24} />
              <div>
                <p className="text-sm text-muted-foreground">Outstanding</p>
                <p className="text-2xl font-bold">R{stats.pendingAmount.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</p>
                <p className="text-xs text-muted-foreground">{stats.pendingCount} unpaid</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="text-green-600" size={24} />
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{stats.completedCount}</p>
                <p className="text-xs text-muted-foreground">payments received</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <CreditCard className="text-blue-600" size={24} />
              <div>
                <p className="text-sm text-muted-foreground">Avg Payment</p>
                <p className="text-2xl font-bold">R{stats.averagePayment.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter & Export */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Payment Records</CardTitle>
              <CardDescription>Track all booking payments and their status</CardDescription>
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Payments</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="unpaid">Unpaid</SelectItem>
                  <SelectItem value="quote_requested">Quote Requested</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={() => exportPaymentCSV(payments)}>
                <Download size={16} className="mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Package</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Payment Status</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">Loading payments...</TableCell>
                  </TableRow>
                ) : payments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No payment records found
                    </TableCell>
                  </TableRow>
                ) : (
                  payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{payment.full_name}</p>
                          <p className="text-xs text-muted-foreground">{payment.email}</p>
                        </div>
                      </TableCell>
                      <TableCell className="capitalize">{payment.service_category.replace(/-/g, ' ')}</TableCell>
                      <TableCell>{payment.package_selected}</TableCell>
                      <TableCell className="text-right font-semibold">
                        R{(payment.amount || 0).toFixed(2)}
                      </TableCell>
                      <TableCell>{getStatusBadge(payment.payment_status)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {payment.payment_reference || '—'}
                      </TableCell>
                      <TableCell className="text-sm">
                        {new Date(payment.created_at).toLocaleDateString('en-ZA')}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedPayment(payment);
                            setNewStatus(payment.payment_status);
                            setNewReference(payment.payment_reference || '');
                            setDialogOpen(true);
                          }}
                        >
                          Update
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Update Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Payment Status</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedPayment && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm"><strong>Client:</strong> {selectedPayment.full_name}</p>
                <p className="text-sm"><strong>Amount:</strong> R{(selectedPayment.amount || 0).toFixed(2)}</p>
                <p className="text-sm"><strong>Service:</strong> {selectedPayment.service_category} — {selectedPayment.package_selected}</p>
              </div>
            )}
            <div className="space-y-2">
              <Label>Payment Status</Label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unpaid">Unpaid</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="quote_requested">Quote Requested</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Payment Reference</Label>
              <Input
                value={newReference}
                onChange={(e) => setNewReference(e.target.value)}
                placeholder="e.g. PayFast transaction ID"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleUpdateStatus}>Save Changes</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
