import { config } from './config';

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
      const url = `${this.baseUrl}/chat/${userId}/send`;
      const body = JSON.stringify(request);
      
      // Debug logging
      console.log('🔍 Chat API Call:', {
        url,
        method: 'POST',
        userId,
        requestBody: request
      });

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      });

      console.log('🔍 Chat API Response:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('🔍 Chat API Error Response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('🔍 Chat API Success Response:', data);
      return data;
    } catch (error) {
      console.error('Chat API error:', error);
      throw new Error('Failed to send message to chat');
    }
  }

  async getMessages(userId: string): Promise<ChatMessageDto[]> {
    try {
      const response = await fetch(`${this.baseUrl}/chat/${userId}/messages`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Get messages API error:', error);
      throw new Error('Failed to get chat messages');
    }
  }

  async getConversation(userId: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/chat/${userId}/conversation`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Get conversation API error:', error);
      throw new Error('Failed to get conversation summary');
    }
  }

  async clearConversation(userId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/chat/${userId}/conversation`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Clear conversation API error:', error);
      throw new Error('Failed to clear conversation');
    }
  }

  async testChat(request: TestChatRequest): Promise<TestChatResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/chat/test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Chat test API error:', error);
      throw new Error('Failed to test chat');
    }
  }
}

export const chatApi = new ChatApi(); 