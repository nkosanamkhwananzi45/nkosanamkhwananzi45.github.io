import { useState, useEffect, useRef } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useProviderMessaging } from '@/hooks/useProviderMessaging';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Send, MessageCircle } from 'lucide-react';

interface ProviderMessagingProps {
  recipientId: string;
  recipientName: string;
  assignmentId?: string;
}

export const ProviderMessaging = ({
  recipientId,
  recipientName,
  assignmentId,
}: ProviderMessagingProps) => {
  const { user } = useAuth();
  const { conversations, fetchConversation, sendMessage } = useProviderMessaging();
  const [messageContent, setMessageContent] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const convoKey = user?.id ? `${user.id}-${recipientId}` : '';
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const messages = conversations[convoKey] || [];

  useEffect(() => {
    if (user?.id) {
      fetchConversation(user.id, recipientId, assignmentId);

      // Real-time subscription
      const subscription = supabase
        .channel(`messages:${convoKey}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `or(and(sender_id=eq.${user.id},recipient_id=eq.${recipientId}),and(sender_id=eq.${recipientId},recipient_id=eq.${user.id}))`,
          },
          () => {
            fetchConversation(user.id, recipientId, assignmentId);
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [user?.id, recipientId, assignmentId, fetchConversation, convoKey]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!user?.id || !messageContent.trim()) return;

    setLoading(true);
    await sendMessage(user.id, recipientId, messageContent, user.email || 'Provider', assignmentId);
    setMessageContent('');
    setLoading(false);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle size={20} />
              Chat with {recipientName}
            </CardTitle>
            <CardDescription>Send secure messages to your client</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  msg.sender_id === user?.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="text-sm">{msg.content}</p>
                <span className="text-xs opacity-70 mt-1 block">
                  {new Date(msg.created_at).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </CardContent>

      <div className="border-t p-4 space-y-2">
        <Textarea
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          placeholder="Type your message... (Shift+Enter for new line)"
          rows={3}
        />
        <Button
          onClick={handleSendMessage}
          disabled={!messageContent.trim() || loading}
          className="w-full"
        >
          <Send size={16} className="mr-2" />
          {loading ? 'Sending...' : 'Send'}
        </Button>
      </div>
    </Card>
  );
};
