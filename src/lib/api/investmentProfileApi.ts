import { apiClient } from './client';
import type {
  InvestmentProfileDto,
  AddExistingPositionRequest,
  UpdateExistingPositionRequest,
} from './types/investmentProfile';

/**
 * Investment profile API – /api/v1/investment/profile
 * Same auth as banking (Firebase ID token in Authorization).
 */
export const investmentProfileApi = {
  /**
   * Get current user's investment profile (positions + share class/fund details).
   */
  async getProfile(): Promise<InvestmentProfileDto | null> {
    const response = await apiClient.get<{ data: InvestmentProfileDto | null }>('/investment/profile');
    return response.data.data ?? null;
  },

  /**
   * Add one position.
   */
  async addPosition(body: AddExistingPositionRequest): Promise<void> {
    await apiClient.post('/investment/profile/positions', body);
  },

  /**
   * Update one position. shareClassId must match the position being updated.
   */
  async updatePosition(
    shareClassId: string,
    body: UpdateExistingPositionRequest
  ): Promise<void> {
    await apiClient.put(
      `/investment/profile/positions/${encodeURIComponent(shareClassId)}`,
      body
    );
  },

  /**
   * Remove one position.
   */
  async deletePosition(shareClassId: string): Promise<void> {
    await apiClient.delete(
      `/investment/profile/positions/${encodeURIComponent(shareClassId)}`
    );
  },
};
