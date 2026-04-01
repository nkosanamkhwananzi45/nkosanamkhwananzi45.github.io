import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ProgressUpdate } from '@/types/provider';
import { toast } from 'sonner';

export const useProgressUpdates = () => {
  const [updates, setUpdates] = useState<ProgressUpdate[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchProgressUpdates = useCallback(async (assignmentId: string) => {
    setLoading(true);
    try {
      const { data, error } = await (supabase as any)
        .from('progress_updates')
        .select('*')
        .eq('assignment_id', assignmentId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setUpdates(data || []);
      return data;
    } catch (err) {
      toast.error('Failed to fetch progress updates');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const postProgressUpdate = useCallback(
    async (
      assignmentId: string,
      providerId: string,
      status: ProgressUpdate['status'],
      notes: string,
      progress: number
    ) => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('progress_updates')
          .insert([
            {
              assignment_id: assignmentId,
              provider_id: providerId,
              status,
              notes,
              progress_percentage: progress,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          ])
          .select()
          .single();

        if (error) throw error;

        setUpdates(prev => [data, ...prev]);

        // Update assignment status
        await supabase
          .from('assignments')
          .update({
            status,
            updated_at: new Date().toISOString(),
          })
          .eq('id', assignmentId);

        // Notify client
        await supabase.from('notifications').insert({
          type: 'assignment',
          title: 'Progress Update',
          message: `Your assignment has a new progress update: ${notes}`,
          related_id: assignmentId,
        });

        toast.success('Progress update posted');
        return data;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to post update';
        toast.error(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const completeAssignment = useCallback(async (assignmentId: string, providerId: string) => {
    return postProgressUpdate(assignmentId, providerId, 'completed', 'Assignment completed', 100);
  }, [postProgressUpdate]);

  return {
    updates,
    loading,
    fetchProgressUpdates,
    postProgressUpdate,
    completeAssignment,
  };
};
