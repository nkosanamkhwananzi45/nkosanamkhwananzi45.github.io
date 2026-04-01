import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase';
import { ProviderPayment } from '@/types/provider';
import { toast } from 'sonner';

export const useProviderPayments = () => {
  const [payments, setPayments] = useState<ProviderPayment[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPayments = useCallback(async (providerId: string, status?: string) => {
    setLoading(true);
    try {
      let query = supabase
        .from('provider_payments')
        .select('*')
        .eq('provider_id', providerId)
        .order('created_at', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;

      if (error) throw error;

      setPayments(data || []);
      return data;
    } catch (err) {
      toast.error('Failed to fetch payments');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const downloadPaymentStatement = useCallback(async (providerId: string, startDate: string, endDate: string) => {
    try {
      const { data, error } = await supabase
        .from('provider_payments')
        .select('*')
        .eq('provider_id', providerId)
        .gte('created_at', startDate)
        .lte('created_at', endDate)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Generate PDF
      const csv = [
        ['Payment Statement', `${startDate} to ${endDate}`],
        [],
        ['Date', 'Assignment', 'Amount (ZAR)', 'Status'],
        ...data.map(p => [
          new Date(p.created_at).toLocaleDateString(),
          p.assignment_id,
          `R${p.amount.toFixed(2)}`,
          p.status,
        ]),
        [],
        ['Total', '', `R${data.reduce((sum, p) => sum + p.amount, 0).toFixed(2)}`, ''],
      ]
        .map(row => row.join(','))
        .join('\n');

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `payment-statement-${providerId}-${startDate}-to-${endDate}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);

      toast.success('Payment statement downloaded');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to download statement';
      toast.error(message);
    }
  }, []);

  const getPaymentSummary = useCallback(async (providerId: string) => {
    try {
      const { data, error } = await supabase
        .from('provider_payments')
        .select('amount, status')
        .eq('provider_id', providerId);

      if (error) throw error;

      const summary = {
        pending: 0,
        processed: 0,
        paid_out: 0,
        total_earned: 0,
      };

      data?.forEach(p => {
        summary.total_earned += p.amount;
        if (p.status === 'pending') summary.pending += p.amount;
        else if (p.status === 'processed') summary.processed += p.amount;
        else if (p.status === 'paid_out') summary.paid_out += p.amount;
      });

      return summary;
    } catch (err) {
      toast.error('Failed to fetch payment summary');
      return null;
    }
  }, []);

  return {
    payments,
    loading,
    fetchPayments,
    downloadPaymentStatement,
    getPaymentSummary,
  };
};
