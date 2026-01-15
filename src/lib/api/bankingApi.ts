import { apiClient } from './client';
import type {
  BankingProductRecommendationsResponse,
  ProductComparisonResponse,
  BankingProfileResponse,
  ProductCatalogResponse,
  BankingProductRecommendation,
  ProductCatalogItem,
  BankingFinancialSummary,
} from './types/banking';

export const bankingApi = {
  /**
   * Get personalized banking product recommendations
   * Backend extracts user ID from Authorization token
   */
  async getRecommendations(filters?: {
    goalId?: string;
    productType?: string;
    limit?: number;
    includeIneligible?: boolean;
  }): Promise<BankingProductRecommendationsResponse> {
    const params: Record<string, string> = {};
    if (filters?.goalId) params.goalId = filters.goalId;
    if (filters?.productType) params.productType = filters.productType;
    if (filters?.limit) params.limit = filters.limit.toString();
    if (filters?.includeIneligible) params.includeIneligible = 'true';
    
    // Add cache-busting parameter
    params._t = Date.now().toString();

    const response = await apiClient.get<{ data: BankingProductRecommendationsResponse }>(
      '/banking/recommendations',
      { params }
    );
    return response.data.data;
  },

  /**
   * Compare multiple banking products
   * Backend extracts user ID from Authorization token
   */
  async compareProducts(productIds: string[]): Promise<ProductComparisonResponse> {
    const response = await apiClient.post<{ data: ProductComparisonResponse }>(
      '/banking/recommendations/compare',
      { productIds },
      {
        params: {
          _t: Date.now().toString(),
        },
      }
    );
    return response.data.data;
  },

  /**
   * Get user's banking profile
   * Backend extracts user ID from Authorization token
   */
  async getProfile(): Promise<BankingProfileResponse> {
    const response = await apiClient.get<{ data: BankingProfileResponse }>('/banking/profile');
    return response.data.data;
  },

  /**
   * Add a product to user's profile
   * Backend extracts user ID from Authorization token
   * Backend expects: { product: { productId, ...fields based on product type } }
   * Only send fields relevant to the product type
   */
  async addProduct(productData: { 
    productId: string;
    // Savings/Fixed Deposit fields
    currentBalance?: number;
    // Credit Card fields
    outstandingBalance?: number;
    creditLimit?: number;
    // Loan fields
    loanAmount?: number;
    monthlyPayment?: number;
    // Common optional fields
    openedDate?: string;
    lastUsedDate?: string;
  }): Promise<void> {
    await apiClient.post('/banking/profile/products', {
      product: productData,
    });
  },

  /**
   * Update a product in user's profile
   * Backend extracts user ID from Authorization token
   * Backend expects: { product: { productId, ...fields to update } }
   * Can update individual fields without sending all fields
   */
  async updateProduct(
    productId: string,
    productData: {
      // Savings/Fixed Deposit fields
      currentBalance?: number;
      // Credit Card fields
      outstandingBalance?: number;
      creditLimit?: number;
      // Loan fields
      loanAmount?: number;
      monthlyPayment?: number;
      // Common optional fields
      openedDate?: string;
      lastUsedDate?: string;
    }
  ): Promise<void> {
    await apiClient.put(`/banking/profile/products/${productId}`, {
      product: {
        productId,
        ...productData,
      },
    });
  },

  /**
   * Delete a product from user's profile
   * Backend extracts user ID from Authorization token
   */
  async deleteProduct(productId: string): Promise<void> {
    await apiClient.delete(`/banking/profile/products/${productId}`);
  },

  /**
   * Get product history
   * Backend extracts user ID from Authorization token
   */
  async getProductHistory(filters?: {
    productId?: string;
    limit?: number;
    offset?: number;
  }): Promise<BankingProfileResponse> {
    const params: Record<string, string> = {};
    if (filters?.productId) params.productId = filters.productId;
    if (filters?.limit) params.limit = filters.limit.toString();
    if (filters?.offset) params.offset = filters.offset.toString();

    const response = await apiClient.get<{ data: BankingProfileResponse }>(
      '/banking/profile/history',
      { params }
    );
    return response.data.data;
  },

  /**
   * Get product catalog (all available products)
   * Public endpoint - no auth required
   * Backend uses 'type' parameter, not 'productType'
   */
  async getProducts(filters?: {
    productType?: string;
    bank?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<ProductCatalogResponse> {
    const params: Record<string, string> = {};
    if (filters?.productType) params.type = filters.productType; // Backend uses 'type'
    if (filters?.bank) params.bank = filters.bank;
    if (filters?.search) params.search = filters.search;
    if (filters?.limit) params.limit = filters.limit.toString();
    if (filters?.offset) params.offset = filters.offset.toString();

    const response = await apiClient.get<{ data: ProductCatalogResponse }>(
      '/banking/products',
      { params }
    );
    
    // Add defensive check
    if (!response.data?.data) {
      console.error('[Catalog] Invalid response structure:', response);
      throw new Error('Invalid catalog response structure');
    }
    
    const catalogResponse = response.data.data;
    
    // Log first product to verify structure
    if (catalogResponse.products?.[0]) {
      console.log('[Catalog] First product structure:', {
        id: catalogResponse.products[0].id,
        productName: catalogResponse.products[0].productName,
        bankName: catalogResponse.products[0].bankName,
        productType: catalogResponse.products[0].productType,
        hasAttributes: !!catalogResponse.products[0].attributes,
        attributesKeys: catalogResponse.products[0].attributes ? Object.keys(catalogResponse.products[0].attributes) : [],
      });
    }
    
    return catalogResponse;
  },

  /**
   * Get product details by ID
   * Public endpoint - no auth required
   */
  async getProductDetails(productId: string): Promise<BankingProductRecommendation> {
    const response = await apiClient.get<{ data: BankingProductRecommendation }>(
      `/banking/products/${productId}`
    );
    return response.data.data;
  },

  /**
   * Get financial summary (assets, liabilities, net worth, debt ratios)
   * Backend extracts user ID from Authorization token
   */
  async getFinancialSummary(): Promise<BankingFinancialSummary> {
    const response = await apiClient.get<{ data: BankingFinancialSummary }>(
      '/banking/profile/summary'
    );
    
    if (!response.data?.data) {
      throw new Error('Invalid financial summary response structure');
    }
    
    return response.data.data;
  },
};
