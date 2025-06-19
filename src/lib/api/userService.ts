import { supabase } from '../supabase/client';
import { config } from './config';

interface RegisterUserData {
  authProviderId:string;
  displayName: string;
  email: string;
  username: string;
}

export const userService = {
  async registerUser(data: RegisterUserData) {
    try {
      const response = await fetch(`${config.API_BASE_URL}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          displayName: data.displayName,
          authProviderUid: data.authProviderId,
          email: data.email,
          username: data.username,
          authProviderType: 'supabase',
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to register user');
      }

      return await response.json();
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  },
}; 