/**
 * Insurance profile API – GET/POST/PUT/DELETE /api/v1/insurance/profile
 * User's policies (existing products) with catalog details resolved.
 */

export interface ExistingInsuranceProductProductDto {
  productId: string;
  productName: string;
  insurerName: string;
  productCategory: string;
  productSubcategory: string;
  isTakaful: boolean;
  currency: string;
}

export interface ExistingInsuranceProductDto {
  productId: string;
  sumAssured?: number;
  premiumMonthly?: number;
  cashValue?: number;
  startDate?: string;
  product: ExistingInsuranceProductProductDto;
}

export interface InsuranceProfileDto {
  userId: string;
  existingProducts: ExistingInsuranceProductDto[];
  createdAt: string;
  updatedAt: string;
}

/** Request body for POST /insurance/profile/products */
export interface AddExistingInsuranceProductRequest {
  productId: string;
  sumAssured?: number;
  premiumMonthly?: number;
  cashValue?: number;
  startDate?: string;
}

/** Request body for PUT /insurance/profile/products/:productId */
export interface UpdateExistingInsuranceProductRequest {
  sumAssured?: number;
  premiumMonthly?: number;
  cashValue?: number;
  startDate?: string;
}
