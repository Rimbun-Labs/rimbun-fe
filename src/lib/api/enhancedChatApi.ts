import { config } from './config';
import apiClient from './client';
import { auth } from '../firebase/config';

export interface ChatMessageDto {
  id: string;
  content: string;
  isAIResponse: boolean;
  timestamp: string;
  responseGroupId?: string;
}

export interface ChatRequest {
  message: string;
  responseGroupId?: string;
  context?: string;
}

export interface ChatResponse {
  success: boolean;
  data: {
    userMessage: ChatMessageDto;
    aiResponse: ChatMessageDto;
    behavioralInsights?: {
      decisionMakingStyle?: string;
      riskConsistency?: number;
      learningPreference?: string;
      investmentStyle?: string;
    };
  };
  message?: string;
}

export interface TestChatRequest {
  message: string;
  context?: string;
}

export interface TestChatResponse {
  success: boolean;
  data: {
    response: string;
    insights?: any;
  };
  message?: string;
}

class ChatApi {
  private baseUrl: string;

  constructor() {
    this.baseUrl = config.API_BASE_URL;
  }

  async sendMessage(userId: string, request: ChatRequest): Promise<ChatResponse> {
    try {
      // Debug logging
      console.log('🔍 Chat API Call:', {
        url: `/chat/${userId}/send`,
        method: 'POST',
        userId,
        requestBody: request
      });

      const response = await apiClient.post(`/chat/${userId}/send`, request);

      console.log('🔍 Chat API Success Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Chat API error:', error);
      throw new Error('Failed to send message to chat');
    }
  }

  async getMessages(userId: string): Promise<ChatMessageDto[]> {
    try {
      const response = await apiClient.get(`/chat/${userId}/messages`);
      return response.data.data || [];
    } catch (error) {
      console.error('Get messages API error:', error);
      throw new Error('Failed to get chat messages');
    }
  }

  async getConversation(userId: string): Promise<any> {
    try {
      const response = await apiClient.get(`/chat/${userId}/conversation`);
      return response.data.data;
    } catch (error) {
      console.error('Get conversation API error:', error);
      throw new Error('Failed to get conversation summary');
    }
  }

  async clearConversation(userId: string): Promise<void> {
    try {
      await apiClient.delete(`/chat/${userId}/conversation`);
    } catch (error) {
      console.error('Clear conversation API error:', error);
      throw new Error('Failed to clear conversation');
    }
  }

  async testChat(request: TestChatRequest): Promise<TestChatResponse> {
    try {
      const response = await apiClient.post('/chat/test', request);
      return response.data;
    } catch (error) {
      console.error('Chat test API error:', error);
      throw new Error('Failed to test chat');
    }
  }
}

export const chatApi = new ChatApi(); 