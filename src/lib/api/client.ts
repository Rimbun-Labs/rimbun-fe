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
  (config) => {
    // You can add auth tokens here if needed
    const token = storageUtils.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
