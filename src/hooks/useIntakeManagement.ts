import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Intake, IntakeFormData, IntakeFilter } from '@/types/intake';
import { toast } from 'sonner';

export const useIntakeManagement = () => {
  const [intakes, setIntakes] = useState<Intake[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const fetchIntakes = useCallback(
    async (filter?: IntakeFilter, pageSize = 10, pageIndex = 0) => {
      setLoading(true);
      setError(null);
      try {
        let query = supabase
          .from('intakes')
          .select('*', { count: 'exact' });

        if (filter?.status) {
          query = query.eq('status', filter.status);
        }
        if (filter?.priority) {
          query = query.eq('priority', filter.priority);
        }
        if (filter?.serviceType) {
          query = query.eq('service_type', filter.serviceType);
        }
        if (filter?.searchTerm) {
          query = query.or(
            `client_name.ilike.%${filter.searchTerm}%,client_email.ilike.%${filter.searchTerm}%,service_description.ilike.%${filter.searchTerm}%`
          );
        }
        if (filter?.dateRange) {
          query = query
            .gte('created_at', filter.dateRange.from)
            .lte('created_at', filter.dateRange.to);
        }

        const { data, error: fetchError, count } = await query
          .order('created_at', { ascending: false })
          .range(pageIndex * pageSize, pageIndex * pageSize + pageSize - 1);

        if (fetchError) throw fetchError;

        setIntakes(data || []);
        setTotalCount(count || 0);
        return { data, count };
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch intakes';
        setError(message);
        toast.error(message);
        return { data: [], count: 0 };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const fetchIntakeById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('intakes')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;
      return data as Intake;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch intake';
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createIntake = useCallback(async (formData: IntakeFormData, userId: string) => {
    setLoading(true);
    setError(null);
    try {
      const newIntake: Omit<Intake, 'id' | 'created_at' | 'updated_at'> = {
        ...formData,
        status: 'new',
        client_id: '',
        admin_id: null,
        created_by: userId,
      };

      const { data, error: insertError } = await supabase
        .from('intakes')
        .insert([newIntake])
        .select()
        .single();

      if (insertError) throw insertError;

      setIntakes((prev) => [data, ...prev]);
      toast.success('Intake created successfully');
      return data as Intake;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create intake';
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateIntake = useCallback(async (id: string, updates: Partial<Intake>) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: updateError } = await supabase
        .from('intakes')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;

      setIntakes((prev) =>
        prev.map((intake) => (intake.id === id ? data : intake))
      );
      toast.success('Intake updated successfully');
      return data as Intake;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update intake';
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteIntake = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const { error: deleteError } = await supabase
        .from('intakes')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      setIntakes((prev) => prev.filter((intake) => intake.id !== id));
      toast.success('Intake deleted successfully');
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete intake';
      setError(message);
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateIntakeStatus = useCallback(
    async (id: string, status: Intake['status']) => {
      return updateIntake(id, { status });
    },
    [updateIntake]
  );

  return {
    intakes,
    loading,
    error,
    totalCount,
    fetchIntakes,
    fetchIntakeById,
    createIntake,
    updateIntake,
    deleteIntake,
    updateIntakeStatus,
  };
};
