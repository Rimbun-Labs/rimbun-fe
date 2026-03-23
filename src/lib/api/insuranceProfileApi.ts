import { apiClient } from './client';
import type {
  InsuranceProfileDto,
  AddExistingInsuranceProductRequest,
  UpdateExistingInsuranceProductRequest,
} from './types/insuranceProfile';

/**
 * Insurance profile API – /api/v1/insurance/profile
 * Same auth as banking (Firebase ID token in Authorization).
 */
export const insuranceProfileApi = {
  /**
   * Get current user's insurance profile (policies + product details).
   */
  async getProfile(): Promise<InsuranceProfileDto | null> {
    const response = await apiClient.get<{ data: InsuranceProfileDto | null }>('/insurance/profile');
    return response.data.data ?? null;
  },

  /**
   * Add one policy.
   */
  async addProduct(body: AddExistingInsuranceProductRequest): Promise<void> {
    await apiClient.post('/insurance/profile/products', body);
  },

  /**
   * Update one policy. productId must match the policy being updated.
   */
  async updateProduct(productId: string, body: UpdateExistingInsuranceProductRequest): Promise<void> {
    await apiClient.put(`/insurance/profile/products/${encodeURIComponent(productId)}`, body);
  },

  /**
   * Remove one policy.
   */
  async deleteProduct(productId: string): Promise<void> {
    await apiClient.delete(`/insurance/profile/products/${encodeURIComponent(productId)}`);
  },
};
