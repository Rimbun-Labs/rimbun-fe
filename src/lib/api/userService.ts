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

interface UserRegistrationResponse {
  data: {
    id: string; // Database user ID
    displayName: string;
    email: string;
    authProviderId: string;
  };
}

export const userService = {
  async registerUser(data: RegisterUserData): Promise<UserRegistrationResponse> {
    try {
      console.log('🔵 userService.registerUser called with:', { ...data, authProviderId: data.authProviderId.substring(0, 8) + '...' });
      
      const response = await fetch(`${config.API_BASE_URL}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          displayName: data.displayName,
          authProviderId: data.authProviderId,
          email: data.email,
          username: data.username,
          authProviderType: 'firebase',
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('❌ userService.registerUser failed:', error);
        throw new Error(error.message || 'Failed to register user');
      }

      const result = await response.json();
      console.log('✅ userService.registerUser successful:', result);
      
      // Store the database user ID in localStorage for session creation
      if (result.data?.id) {
        localStorage.setItem('databaseUserId', result.data.id);
        console.log('🔵 Stored database user ID:', result.data.id);
      }
      
      return result;
    } catch (error) {
      console.error('❌ userService.registerUser error:', error);
      throw error;
    }
  },

  async ensureUserExists(data: EnsureUserData): Promise<UserRegistrationResponse | { message: string }> {
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
          authProviderId: data.authProviderId,
          email: data.email,
          username: username,
          authProviderType: 'firebase',
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
      
      // Store the database user ID in localStorage for session creation
      if (result.data?.id) {
        localStorage.setItem('databaseUserId', result.data.id);
        console.log('🔵 Stored database user ID:', result.data.id);
      }
      
      return result;
    } catch (error) {
      console.error('❌ userService.ensureUserExists error:', error);
      throw error;
    }
  },

  getDatabaseUserId(): string | null {
    return localStorage.getItem('databaseUserId');
  },

  clearDatabaseUserId(): void {
    localStorage.removeItem('databaseUserId');
  },
}; 