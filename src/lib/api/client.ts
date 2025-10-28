import axios from 'axios';
import { config } from './config';
import { storageUtils } from '../storage/storageUtils';

export const apiClient = axios.create({
  baseURL: config.API_BASE_URL,
  headers: {
    'Content-type': 'application/json',
  },
});

// Request interceptor for API calls
apiClient.interceptors.request.use(
  async (config) => {
    // Get current user and fresh token
    const { auth } = await import('../firebase/config');
    const user = auth.currentUser;
    
    if (user) {
      // Get fresh token (Firebase SDK auto-refreshes if needed)
      const idToken = await user.getIdToken();
      config.headers.Authorization = `Bearer ${idToken}`;
    } else {
      // Fallback to stored token if no current user
      const firebaseToken = storageUtils.getItem('firebaseIdToken');
      if (firebaseToken) {
        config.headers.Authorization = `Bearer ${firebaseToken}`;
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle specific error codes
    if (error.response) {
      // Handle 401 Unauthorized - e.g., redirect to login
      if (error.response.status === 401 && !originalRequest._retry) {
        // Handle token refresh or redirect to login
        console.error('Authentication error');
      }
      
      // Handle 500 errors
      if (error.response.status >= 500) {
        console.error('Server error');
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
