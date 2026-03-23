/**
 * Single-view profile API – GET /api/v1/profile
 * One payload for identity, assessment, spending, goals, banking, statement account.
 * Each section can be null if not available.
 */

import type { SpendingAnalysisDto } from '../spendingApi';
import type { UserGoalsResponse } from './goals';
import type { BankingProfileResponse } from './banking';
import type { InsuranceProfileDto } from './insuranceProfile';
import type { InvestmentProfileDto } from './investmentProfile';
import type { EconomicProfileDto } from './economicProfile';

export interface UserProfileIdentityDto {
  id: string;
  email: string;
  displayName: string;
  phone?: string | null;
  profilePictureURL?: string | null;
}

export interface UserProfileAssessmentDto {
  id: string;
  responseGroupId: string;
  scoreData: Record<string, unknown>;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface UserProfileStatementAccountDto {
  bankName?: string | null;
  accountType?: string | null;
  productName?: string | null;
  monthlyFee?: string | null;
  currency?: string | null;
  lastStatementAt: string;
}

/**
 * Single-view profile response. All sections nullable.
 */
export interface UserProfileDto {
  identity: UserProfileIdentityDto | null;
  economicProfile?: EconomicProfileDto | null;
  assessment: UserProfileAssessmentDto | null;
  spending: SpendingAnalysisDto | null;
  goals: UserGoalsResponse | null;
  banking: BankingProfileResponse | null;
  insurance: InsuranceProfileDto | null;
  investment: InvestmentProfileDto | null;
  statementAccount: UserProfileStatementAccountDto | null;
}

export interface SingleViewProfileResponse {
  data: UserProfileDto;
  meta?: {
    timestamp?: number;
    version?: string;
  };
}
