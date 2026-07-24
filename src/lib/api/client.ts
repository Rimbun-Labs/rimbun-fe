import axios from 'axios';
import { config } from './config';
import { storageUtils } from '../storage/storageUtils';

export const apiClient = axios.create({
  baseURL: config.API_BASE_URL,
  headers: {
    'Content-type': 'application/json',
  },
});

function isPublicApiRequest(url?: string, params?: Record<string, unknown>): boolean {
  if (!url) return false;

  const isFundsWithFit =
    url.includes('/investment/funds') &&
    (params?.includeFit === true ||
      params?.includeFit === 'true' ||
      params?.includeFit === '1');

  return (
    url.includes('/personas') ||
    url.includes('/contact') ||
    (url.includes('/investment/funds') && !isFundsWithFit)
  );
}

// Request interceptor for API calls
apiClient.interceptors.request.use(
  async (requestConfig) => {
    // Skip auth for public endpoints (personas, contact). For investment/funds, only skip auth when NOT requesting profile fit.
    if (isPublicApiRequest(requestConfig.url, requestConfig.params)) {
      delete requestConfig.headers.Authorization;
      return requestConfig;
    }

    // Get current user and fresh token
    const { auth } = await import('../firebase/config');
    const user = auth.currentUser;

    if (user) {
      // Get fresh token (Firebase SDK auto-refreshes if needed)
      const idToken = await user.getIdToken();
      requestConfig.headers.Authorization = `Bearer ${idToken}`;
    }
    // Note: Removed fallback to stored token - if no current user, let backend return 401
    // This prevents sending expired tokens and ensures proper error handling

    return requestConfig;
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
      // Log all error responses for debugging
      const errorData = error.response.data;
      console.error('API Error Response:', {
        status: error.response.status,
        statusText: error.response.statusText,
        url: error.config?.url,
        method: error.config?.method,
        message: errorData?.message || errorData?.error || error.message,
        fullErrorData: errorData,
      });

      // Also log the full error data as a separate object for easier inspection
      console.error('Full Backend Error Data:', JSON.stringify(errorData, null, 2));

      // Handle 401 Unauthorized - token refresh or redirect to login.
      // Never bounce public marketing forms (e.g. /contact) into the login gate.
      if (
        error.response.status === 401 &&
        !originalRequest?._retry &&
        !isPublicApiRequest(originalRequest?.url, originalRequest?.params)
      ) {
        originalRequest._retry = true;

        // Try to refresh the token
        try {
          const { auth } = await import('../firebase/config');
          const user = auth.currentUser;

          if (user) {
            // Force token refresh
            const newToken = await user.getIdToken(true);
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            // Retry the original request with new token
            return apiClient(originalRequest);
          }
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
        }

        // Token refresh failed or no user - clear auth state and redirect to login
        storageUtils.removeItem('firebaseIdToken');
        storageUtils.removeItem('databaseUserId');

        // Only redirect if we're in a browser environment
        if (typeof window !== 'undefined') {
          const currentPath = window.location.pathname;
          const loginPath = '/login';
          // Only redirect if not already on login page
          if (currentPath !== loginPath && !currentPath.startsWith('/login')) {
            window.location.href = `${loginPath}?redirect=${encodeURIComponent(currentPath)}`;
          }
        }
      }

      // Handle 500 errors
      if (error.response.status >= 500) {
        console.error('Server error (500+) - Full error details logged above');
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error('API Request Error (no response):', {
        url: error.config?.url,
        method: error.config?.method,
        message: error.message,
      });
    } else {
      // Something else happened
      console.error('API Error (other):', error.message);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
