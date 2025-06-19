import { supabase } from '../supabase/client';
import { config } from './config';

interface RegisterUserData {
  authProviderId:string;
  displayName: string;
  email: string;
  username: string;
}

interface EnsureUserData {
  authProviderId: string;
  displayName: string;
  email: string;
  username?: string;
}

export const userService = {
  async registerUser(data: RegisterUserData) {
    try {
      console.log('🔵 userService.registerUser called with:', { ...data, authProviderId: data.authProviderId.substring(0, 8) + '...' });
      
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
        console.error('❌ userService.registerUser failed:', error);
        throw new Error(error.message || 'Failed to register user');
      }

      const result = await response.json();
      console.log('✅ userService.registerUser successful:', result);
      return result;
    } catch (error) {
      console.error('❌ userService.registerUser error:', error);
      throw error;
    }
  },

  async ensureUserExists(data: EnsureUserData) {
    try {
      console.log('🔵 userService.ensureUserExists called with:', { ...data, authProviderId: data.authProviderId.substring(0, 8) + '...' });
      
      // Generate a username if not provided
      const username = data.username || data.email.split('@')[0];
      
      const response = await fetch(`${config.API_BASE_URL}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          displayName: data.displayName,
          authProviderUid: data.authProviderId,
          email: data.email,
          username: username,
          authProviderType: 'supabase',
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        // If user already exists, that's fine - just log it
        if (response.status === 409) {
          console.log('ℹ️ userService.ensureUserExists - user already exists');
          return { message: 'User already exists' };
        }
        console.error('❌ userService.ensureUserExists failed:', error);
        throw new Error(error.message || 'Failed to ensure user exists');
      }

      const result = await response.json();
      console.log('✅ userService.ensureUserExists successful:', result);
      return result;
    } catch (error) {
      console.error('❌ userService.ensureUserExists error:', error);
      throw error;
    }
  },
}; 