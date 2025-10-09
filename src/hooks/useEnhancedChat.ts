import { useState, useEffect, useCallback } from 'react';
import { chatApi } from '@/lib/api/enhancedChatApi';
import { ChatMessageDto } from '@/lib/api/enhancedChatApi';
// REMOVED: getLatestAssessmentResults import - replaced by useSessionState hook
import { useAuth } from '@/contexts/AuthContext';
import { useSession } from '@/contexts/SessionContext';

export interface BehavioralInsights {
  riskTolerance?: string;
  investmentStyle?: string;
}

export const useChat = (sessionId: string) => {
  const [messages, setMessages] = useState<ChatMessageDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [behavioralInsights, setBehavioralInsights] = useState<BehavioralInsights | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [realResponseGroupId, setRealResponseGroupId] = useState<string | null>(null);
  const { user } = useAuth();
  const { session } = useSession();

  // Load existing messages and get real response group ID on mount
  useEffect(() => {
    if (user?.uid) {
      loadMessages();
      loadRealResponseGroupId();
    }
  }, [user?.uid]);

  const loadMessages = useCallback(async () => {
    if (!user?.uid) return;

    try {
      const existingMessages = await chatApi.getMessages(user.uid);
      setMessages(existingMessages);
    } catch (error) {
      console.error('Failed to load messages:', error);
      // Don't set error for loading messages, just log it
    }
  }, [user?.uid]);

  const loadRealResponseGroupId = useCallback(async () => {
    if (!user?.uid) return;

    try {
      // REMOVED: getLatestAssessmentResults call - replaced by useSessionState hook
      // Chat will work without response group context for now
      console.log('⚠️ Chat will work without response group context (useSessionState integration pending)');
    } catch (error) {
      console.error('Failed to load real response group ID:', error);
      // Don't set error, just log it
    }
  }, [user?.uid]);

  const sendMessage = useCallback(async (message: string, responseGroupId?: string) => {
    if (!user?.uid) return;

    const newMessage: ChatMessageDto = {
      id: Date.now().toString(),
      content: message,
      role: 'user',
      timestamp: new Date().toISOString(),
      userId: user.uid,
      responseGroupId: responseGroupId || realResponseGroupId || sessionId
    };

    setMessages(prev => [...prev, newMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await chatApi.sendMessage(message, responseGroupId || realResponseGroupId || sessionId);
      
      const assistantMessage: ChatMessageDto = {
        id: (Date.now() + 1).toString(),
        content: response.content,
        role: 'assistant',
        timestamp: new Date().toISOString(),
        userId: user.uid,
        responseGroupId: responseGroupId || realResponseGroupId || sessionId
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      // Extract behavioral insights if available
      if (response.behavioralInsights) {
        setBehavioralInsights(response.behavioralInsights);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      setError('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [user?.uid, realResponseGroupId, sessionId]);

  return {
    messages,
    isLoading,
    error,
    behavioralInsights,
    sendMessage,
    loadMessages
  };
}; 