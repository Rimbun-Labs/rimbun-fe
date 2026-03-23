import { apiClient } from './client';
import type {
  ResilienceOverviewResponseDto,
  ResilienceSimulateRequest,
  ResilienceSimulateResponse,
  SafetyFloorResponseDto,
} from './types/resilience';

interface ApiResponse<T> {
  data: T;
  message?: string;
}

export const resilienceApi = {
  /** GET /resilience/overview – Tab 1 payload (Safety Floor + goals with resilience) */
  getOverview: async (): Promise<ResilienceOverviewResponseDto> => {
    const response = await apiClient.get<ApiResponse<ResilienceOverviewResponseDto>>(
      '/resilience/overview'
    );
    return response.data.data;
  },

  /** GET /resilience/safety-floor?limit= – Safety Floor only (products + nudge + foundation %) */
  getSafetyFloor: async (limit?: number): Promise<SafetyFloorResponseDto> => {
    const params = limit != null ? { limit: limit.toString() } : {};
    const response = await apiClient.get<ApiResponse<SafetyFloorResponseDto>>(
      '/resilience/safety-floor',
      { params }
    );
    return response.data.data;
  },

  /** POST /resilience/simulate – project maturity value for a product */
  simulate: async (body: ResilienceSimulateRequest): Promise<ResilienceSimulateResponse> => {
    const response = await apiClient.post<ApiResponse<ResilienceSimulateResponse>>(
      '/resilience/simulate',
      body
    );
    return response.data.data;
  },
};

export type ResilienceApi = typeof resilienceApi;
