import { apiClient } from './client';
import type {
  InsuranceProductCompareResponseDto,
  InsuranceProductDetailDto,
  InsuranceProductListResponseDto,
} from './types/insuranceProducts';
import type { ProductDnaResponseDto } from './types/documents';

interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface InsuranceProductsFilters {
  category?: string;
  subcategory?: string;
  takaful_only?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
}

export const insuranceProductsApi = {
  /**
   * GET /insurance/products – list with optional filters.
   * Query params: category, subcategory, takaful_only, search, limit, offset
   */
  getProducts: async (
    filters?: InsuranceProductsFilters
  ): Promise<InsuranceProductListResponseDto> => {
    const params: Record<string, string> = {};
    if (filters?.category) params.category = filters.category;
    if (filters?.subcategory) params.subcategory = filters.subcategory;
    if (filters?.takaful_only === true) params.takaful_only = 'true';
    if (filters?.search) params.search = filters.search;
    if (filters?.limit != null) params.limit = filters.limit.toString();
    if (filters?.offset != null) params.offset = filters.offset.toString();

    const response = await apiClient.get<ApiResponse<InsuranceProductListResponseDto>>(
      '/insurance/products',
      { params }
    );
    return response.data.data;
  },

  /** GET /insurance/products/:productId – full detail (InsuranceProductDetailDto) */
  getProduct: async (productId: string): Promise<InsuranceProductDetailDto> => {
    const response = await apiClient.get<ApiResponse<InsuranceProductDetailDto>>(
      `/insurance/products/${encodeURIComponent(productId)}`
    );
    return response.data.data;
  },

  /** GET /insurance/products/compare?productIds=id1,id2,id3 – compare 2–4 products (single comma-separated param) */
  getCompare: async (productIds: string[]): Promise<InsuranceProductCompareResponseDto> => {
    const productIdsParam = productIds.filter(Boolean).join(',');
    const response = await apiClient.get<ApiResponse<InsuranceProductCompareResponseDto>>(
      `/insurance/products/compare?productIds=${encodeURIComponent(productIdsParam)}`
    );
    return response.data.data;
  },

  /**
   * POST /insurance/products/:productId/enrich-from-pds
   * Merge PDS-extracted productDna into catalog product; returns updated product detail.
   */
  enrichProductFromPds: async (
    productId: string,
    productDna: ProductDnaResponseDto
  ): Promise<InsuranceProductDetailDto> => {
    const response = await apiClient.post<ApiResponse<InsuranceProductDetailDto>>(
      `/insurance/products/${encodeURIComponent(productId)}/enrich-from-pds`,
      { productDna }
    );
    return response.data.data;
  },
};

export type InsuranceProductsApi = typeof insuranceProductsApi;
