/**
 * Investment profile API – GET/POST/PUT/DELETE /api/v1/investment/profile
 * User's positions (share classes) with fund/share-class details resolved.
 */

export interface ExistingPositionProductDto {
  shareClassId: string;
  className: string;
  fundId: string;
  fundName: string;
  fundHouse: string;
  currency: string;
  isActive: boolean;
}

export interface ExistingPositionDto {
  shareClassId: string;
  currentValue?: number;
  units?: number;
  monthlyContribution?: number;
  startDate?: string;
  product: ExistingPositionProductDto;
}

export interface InvestmentProfileDto {
  userId: string;
  existingPositions: ExistingPositionDto[];
  createdAt: string;
  updatedAt: string;
}

/** Request body for POST /investment/profile/positions */
export interface AddExistingPositionRequest {
  shareClassId: string;
  currentValue?: number;
  units?: number;
  monthlyContribution?: number;
  startDate?: string;
}

/** Request body for PUT /investment/profile/positions/:shareClassId */
export interface UpdateExistingPositionRequest {
  currentValue?: number;
  units?: number;
  monthlyContribution?: number;
  startDate?: string;
}
