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

function safeRequestPath(url?: string): string | undefined {
  if (!url) return undefined;
  try {
    // Absolute or relative — never log query strings (may contain tokens).
    const path = url.includes('://') ? new URL(url).pathname : url.split('?')[0];
    return path;
  } catch {
    return undefined;
  }
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

    if (error.response) {
      // Never dump response bodies, requestIds, or provider payloads to the console.
      // Call sites map status/code → operator-facing copy.
      if (import.meta.env.DEV) {
        console.error('API request failed', {
          status: error.response.status,
          method: originalRequest?.method,
          path: safeRequestPath(originalRequest?.url),
        });
      }

      // Handle 401 Unauthorized - token refresh or redirect to login.
      // Never bounce public marketing forms (e.g. /contact) into the login gate.
      if (
        error.response.status === 401 &&
        !originalRequest?._retry &&
        !isPublicApiRequest(originalRequest?.url, originalRequest?.params)
      ) {
        originalRequest._retry = true;

        try {
          const { auth } = await import('../firebase/config');
          const user = auth.currentUser;

          if (user) {
            const newToken = await user.getIdToken(true);
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return apiClient(originalRequest);
          }
        } catch {
          // Token refresh failed — fall through to logout redirect.
        }

        storageUtils.removeItem('firebaseIdToken');
        storageUtils.removeItem('databaseUserId');

        if (typeof window !== 'undefined') {
          const currentPath = window.location.pathname;
          const loginPath = '/login';
          if (currentPath !== loginPath && !currentPath.startsWith('/login')) {
            window.location.href = `${loginPath}?redirect=${encodeURIComponent(currentPath)}`;
          }
        }
      }
    } else if (error.request && import.meta.env.DEV) {
      console.error('API request failed (no response)', {
        method: originalRequest?.method,
        path: safeRequestPath(originalRequest?.url),
      });
    }

    return Promise.reject(error);
  }
);

export default apiClient;
