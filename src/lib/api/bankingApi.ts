import { apiClient } from './client';
import type {
  BankingProductRecommendationsResponse,
  ProductComparisonResponse,
  BankingProfileResponse,
  ProductCatalogResponse,
  BankingProductRecommendation,
  BankingFinancialSummary,
} from './types/banking';

function requireCustomerId(customerId: string | undefined): string {
  const id = customerId?.trim();
  if (!id) {
    throw new Error('Select a customer to load personalized banking data');
  }
  return id;
}

export const bankingApi = {
  /**
   * Personalized recommendations for a tenant customer.
   */
  async getRecommendations(
    customerId: string,
    filters?: {
      goalId?: string;
      productType?: string;
      limit?: number;
      includeIneligible?: boolean;
      includeFiltered?: boolean;
      disableTypeFiltering?: boolean;
    }
  ): Promise<BankingProductRecommendationsResponse> {
    const id = requireCustomerId(customerId);
    const params: Record<string, string> = {};
    if (filters?.goalId) params.goalId = filters.goalId;
    if (filters?.productType) params.productType = filters.productType;
    if (filters?.limit) params.limit = filters.limit.toString();
    if (filters?.includeIneligible) params.includeIneligible = 'true';
    if (filters?.includeFiltered) params.includeFiltered = 'true';
    if (filters?.disableTypeFiltering) params.disableTypeFiltering = 'true';
    params._t = Date.now().toString();

    const response = await apiClient.get<{ data: BankingProductRecommendationsResponse }>(
      `/dashboard/customers/${id}/recommendations`,
      { params }
    );
    return response.data.data;
  },

  async compareProducts(
    customerId: string,
    productIds: string[]
  ): Promise<ProductComparisonResponse> {
    const id = requireCustomerId(customerId);
    const response = await apiClient.post<{ data: ProductComparisonResponse }>(
      `/dashboard/customers/${id}/recommendations/compare`,
      { productIds },
      { params: { _t: Date.now().toString() } }
    );
    return response.data.data;
  },

  async getProfile(customerId: string): Promise<BankingProfileResponse> {
    const id = requireCustomerId(customerId);
    const response = await apiClient.get<{ data: BankingProfileResponse }>(
      `/dashboard/customers/${id}/banking-profile`
    );
    return response.data.data;
  },

  async addProduct(
    customerId: string,
    productData: {
      productId: string;
      currentBalance?: number;
      outstandingBalance?: number;
      creditLimit?: number;
      loanAmount?: number;
      monthlyPayment?: number;
      openedDate?: string;
      lastUsedDate?: string;
    }
  ): Promise<void> {
    const id = requireCustomerId(customerId);
    await apiClient.post(`/dashboard/customers/${id}/banking-profile/products`, {
      product: productData,
    });
  },

  async updateProduct(
    customerId: string,
    productId: string,
    productData: {
      currentBalance?: number;
      outstandingBalance?: number;
      creditLimit?: number;
      loanAmount?: number;
      monthlyPayment?: number;
      openedDate?: string;
      lastUsedDate?: string;
    }
  ): Promise<void> {
    const id = requireCustomerId(customerId);
    await apiClient.put(`/dashboard/customers/${id}/banking-profile/products/${productId}`, {
      product: {
        productId,
        ...productData,
      },
    });
  },

  async deleteProduct(customerId: string, productId: string): Promise<void> {
    const id = requireCustomerId(customerId);
    await apiClient.delete(`/dashboard/customers/${id}/banking-profile/products/${productId}`);
  },

  async getProductHistory(
    customerId: string,
    filters?: {
      productId?: string;
      limit?: number;
      offset?: number;
    }
  ): Promise<BankingProfileResponse> {
    const id = requireCustomerId(customerId);
    const params: Record<string, string> = {};
    if (filters?.productId) params.productId = filters.productId;
    if (filters?.limit) params.limit = filters.limit.toString();
    if (filters?.offset) params.offset = filters.offset.toString();

    const response = await apiClient.get<{ data: BankingProfileResponse }>(
      `/dashboard/customers/${id}/banking-profile/history`,
      { params }
    );
    return response.data.data;
  },

  /** Shared product catalog (not customer-scoped). */
  async getProducts(filters?: {
    productType?: string;
    bank?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<ProductCatalogResponse> {
    const params: Record<string, string> = {};
    if (filters?.productType) params.type = filters.productType;
    if (filters?.bank) params.bank = filters.bank;
    if (filters?.search) params.search = filters.search;
    if (filters?.limit) params.limit = filters.limit.toString();
    if (filters?.offset) params.offset = filters.offset.toString();

    const response = await apiClient.get<{ data: ProductCatalogResponse }>(
      '/banking/products',
      { params }
    );

    if (!response.data?.data) {
      throw new Error('Invalid catalog response structure');
    }

    return response.data.data;
  },

  async getProductDetails(productId: string): Promise<BankingProductRecommendation> {
    const response = await apiClient.get<{ data: BankingProductRecommendation }>(
      `/banking/products/${productId}`
    );
    return response.data.data;
  },

  async getFinancialSummary(customerId: string): Promise<BankingFinancialSummary> {
    const id = requireCustomerId(customerId);
    const response = await apiClient.get<{ data: BankingFinancialSummary }>(
      `/dashboard/customers/${id}/banking-profile/summary`
    );

    if (!response.data?.data) {
      throw new Error('Invalid financial summary response structure');
    }

    return response.data.data;
  },
};
