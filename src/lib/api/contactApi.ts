import { apiClient } from './client';

export interface ContactFormData {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
}

class ContactApi {
  async sendContactMessage(data: ContactFormData): Promise<ContactResponse> {
    try {
      const response = await apiClient.post('/contact', data);
      return response.data;
    } catch (error: any) {
      console.error('Contact API error:', error);
      throw new Error(
        error.response?.data?.message || 
        'Failed to send message. Please try again later.'
      );
    }
  }
}

export const contactApi = new ContactApi();

