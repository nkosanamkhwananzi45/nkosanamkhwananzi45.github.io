import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Assignment } from '@/types/provider';
import { toast } from 'sonner';

export const useAssignmentDistribution = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAssignments = useCallback(async (providerId: string, filter?: string) => {
    setLoading(true);
    setError(null);
    try {
      let query = (supabase as any)
        .from('assignments')
        .select('*')
        .eq('provider_id', providerId)
        .order('created_at', { ascending: false });

      if (filter) {
        query = query.eq('status', filter);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      setAssignments(data || []);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch assignments';
      setError(message);
      toast.error(message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const acceptAssignment = useCallback(async (assignmentId: string, providerId: string) => {
    setLoading(true);
    try {
      const { error: updateError } = await (supabase as any)
        .from('assignments')
        .update({
          status: 'in_progress',
          updated_at: new Date().toISOString(),
        })
        .eq('id', assignmentId)
        .eq('provider_id', providerId);

      if (updateError) throw updateError;

      // Create notification for client
      await (supabase as any).from('notifications').insert({
        user_id: '', // client_id
        type: 'assignment',
        title: 'Assignment Accepted',
        message: 'Your assigned provider has accepted the assignment',
        related_id: assignmentId,
      });

      setAssignments(prev =>
        prev.map(a => a.id === assignmentId ? { ...a, status: 'in_progress' } : a)
      );

      toast.success('Assignment accepted');
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to accept assignment';
      setError(message);
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const rejectAssignment = useCallback(async (assignmentId: string, providerId: string, reason: string) => {
    setLoading(true);
    try {
      const { error: updateError } = await supabase
        .from('assignments')
        .update({
          status: 'assigned', // Reset to assigned so admin can reallocate
          updated_at: new Date().toISOString(),
        })
        .eq('id', assignmentId)
        .eq('provider_id', providerId);

      if (updateError) throw updateError;

      // Log rejection reason
      await supabase.from('assignment_rejections').insert({
        assignment_id: assignmentId,
        provider_id: providerId,
        reason,
        created_at: new Date().toISOString(),
      });

      setAssignments(prev => prev.filter(a => a.id !== assignmentId));
      toast.success('Assignment rejected');
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to reject assignment';
      setError(message);
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    assignments,
    loading,
    error,
    fetchAssignments,
    acceptAssignment,
    rejectAssignment,
  };
};
