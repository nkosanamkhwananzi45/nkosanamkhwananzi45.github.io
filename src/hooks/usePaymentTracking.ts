import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface PaymentRecord {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  service_category: string;
  package_selected: string;
  amount: number | null;
  payment_status: string;
  payment_reference: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  due_date: string | null;
}

export interface PaymentStats {
  totalRevenue: number;
  pendingAmount: number;
  completedCount: number;
  pendingCount: number;
  quoteRequestedCount: number;
  averagePayment: number;
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
  count: number;
}

export const usePaymentTracking = () => {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [stats, setStats] = useState<PaymentStats>({
    totalRevenue: 0,
    pendingAmount: 0,
    completedCount: 0,
    pendingCount: 0,
    quoteRequestedCount: 0,
    averagePayment: 0,
  });
  const [monthlyRevenue, setMonthlyRevenue] = useState<MonthlyRevenue[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPayments = useCallback(async (statusFilter?: string) => {
    setLoading(true);
    try {
      let query = supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (statusFilter && statusFilter !== 'all') {
        query = query.eq('payment_status', statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;

      const records = (data || []) as PaymentRecord[];
      setPayments(records);

      // Calculate stats
      const paid = records.filter(r => r.payment_status === 'paid');
      const pending = records.filter(r => r.payment_status === 'unpaid');
      const quoteRequested = records.filter(r => r.payment_status === 'quote_requested');
      const totalRevenue = paid.reduce((sum, r) => sum + (r.amount || 0), 0);
      const pendingAmount = pending.reduce((sum, r) => sum + (r.amount || 0), 0);

      setStats({
        totalRevenue,
        pendingAmount,
        completedCount: paid.length,
        pendingCount: pending.length,
        quoteRequestedCount: quoteRequested.length,
        averagePayment: paid.length > 0 ? totalRevenue / paid.length : 0,
      });

      // Monthly revenue
      const monthlyMap: Record<string, MonthlyRevenue> = {};
      paid.forEach(r => {
        const d = new Date(r.created_at);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        const label = d.toLocaleDateString('en-ZA', { year: '2-digit', month: 'short' });
        if (!monthlyMap[key]) {
          monthlyMap[key] = { month: label, revenue: 0, count: 0 };
        }
        monthlyMap[key].revenue += r.amount || 0;
        monthlyMap[key].count++;
      });

      setMonthlyRevenue(
        Object.entries(monthlyMap)
          .sort(([a], [b]) => a.localeCompare(b))
          .slice(-6)
          .map(([, v]) => v)
      );

      return records;
    } catch (err) {
      console.error('Failed to fetch payment data:', err);
      toast.error('Failed to load payment data');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePaymentStatus = useCallback(async (bookingId: string, paymentStatus: string, paymentReference?: string) => {
    try {
      const updates: Record<string, string> = {
        payment_status: paymentStatus,
        updated_at: new Date().toISOString(),
      };
      if (paymentReference) {
        updates.payment_reference = paymentReference;
      }
      if (paymentStatus === 'paid') {
        updates.status = 'confirmed';
      }

      const { error } = await supabase
        .from('bookings')
        .update(updates)
        .eq('id', bookingId);

      if (error) throw error;
      toast.success('Payment status updated');
      return true;
    } catch (err) {
      console.error('Failed to update payment status:', err);
      toast.error('Failed to update payment status');
      return false;
    }
  }, []);

  const exportPaymentCSV = useCallback((data: PaymentRecord[], startDate?: string, endDate?: string) => {
    const filtered = data.filter(r => {
      if (startDate && new Date(r.created_at) < new Date(startDate)) return false;
      if (endDate && new Date(r.created_at) > new Date(endDate)) return false;
      return true;
    });

    const csv = [
      ['Date', 'Client', 'Email', 'Service', 'Package', 'Amount (ZAR)', 'Payment Status', 'Reference'],
      ...filtered.map(r => [
        new Date(r.created_at).toLocaleDateString('en-ZA'),
        r.full_name,
        r.email,
        r.service_category,
        r.package_selected,
        `R${(r.amount || 0).toFixed(2)}`,
        r.payment_status,
        r.payment_reference || '',
      ]),
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payments-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Payment data exported');
  }, []);

  return {
    payments,
    stats,
    monthlyRevenue,
    loading,
    fetchPayments,
    updatePaymentStatus,
    exportPaymentCSV,
  };
};
