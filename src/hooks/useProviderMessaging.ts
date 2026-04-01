import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Message } from '@/types/provider';
import { toast } from 'sonner';

export const useProviderMessaging = () => {
  const [conversations, setConversations] = useState<{ [key: string]: Message[] }>({});
  const [loading, setLoading] = useState(false);

  const fetchConversation = useCallback(async (providerId: string, recipientId: string, assignmentId?: string) => {
    setLoading(true);
    try {
      const { data, error } = await (supabase as any)
        .from('messages')
        .select('*')
        .or(
          `and(sender_id.eq.${providerId},recipient_id.eq.${recipientId}),and(sender_id.eq.${recipientId},recipient_id.eq.${providerId})`
        )
        .order('created_at', { ascending: true });

      if (error) throw error;

      const convoKey = `${providerId}-${recipientId}`;
      setConversations(prev => ({
        ...prev,
        [convoKey]: data || [],
      }));

      // Mark as read
      await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('recipient_id', providerId)
        .eq('sender_id', recipientId);

      return data;
    } catch (err) {
      toast.error('Failed to fetch conversation');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const sendMessage = useCallback(
    async (
      senderId: string,
      recipientId: string,
      content: string,
      senderName: string,
      assignmentId?: string,
      attachments?: string[]
    ) => {
      try {
        const { data, error } = await supabase
          .from('messages')
          .insert([
            {
              sender_id: senderId,
              sender_type: 'provider',
              sender_name: senderName,
              recipient_id: recipientId,
              assignment_id: assignmentId,
              content,
              is_read: false,
              created_at: new Date().toISOString(),
              attachments,
            },
          ])
          .select()
          .single();

        if (error) throw error;

        const convoKey = `${senderId}-${recipientId}`;
        setConversations(prev => ({
          ...prev,
          [convoKey]: [...(prev[convoKey] || []), data],
        }));

        // Send email notification
        await supabase.functions.invoke('send-email-notification', {
          body: {
            to: recipientId,
            subject: `New message from ${senderName}`,
            template: 'message_notification',
            data: { message: content, senderName },
          },
        });

        return data;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to send message';
        toast.error(message);
        return null;
      }
    },
    []
  );

  return {
    conversations,
    loading,
    fetchConversation,
    sendMessage,
  };
};
