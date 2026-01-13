// Banking Product Types

export type BankingProductType = 
  | 'savings'
  | 'credit_card'
  | 'checking'
  | 'cd'
  | 'money_market'
  | 'loan'
  | 'debit_card'
  | 'virtual_prepaid_card';

export type ProductTypeFilter = BankingProductType | 'all';
export type GoalFilter = string | 'all';

export type EligibilityStatus = 'eligible' | 'likely_eligible' | 'may_qualify' | 'not_eligible';

export interface ProductAttributes {
  // Numeric fields (from backend)
  interestRate?: number;
  annualFee?: number;
  monthlyFee?: number;
  minimumBalance?: number;
  creditLimit?: number;
  creditLimitMin?: number;
  creditLimitMax?: number;
  loanAmountMin?: number;
  loanAmountMax?: number;
  processingFee?: number;
  earlyWithdrawalPenalty?: number;
  apr?: number;
  apy?: number;
  openingFee?: number;
  closingFee?: number;
  cashAdvanceFee?: number;
  latePaymentFee?: number;
  foreignTransactionFee?: number;
  maximumBalance?: number;
  minimumBalanceToAvoidFee?: number;
  
  // String variants (for complex cases with additional text)
  interestRateStr?: string;
  annualFeeStr?: string;
  monthlyFeeStr?: string;
  minimumBalanceStr?: string;
  creditLimitStr?: string;
  loanAmountMaxStr?: string;
  processingFeeStr?: string;
  earlyWithdrawalPenaltyStr?: string;
  aprStr?: string;
  apyStr?: string;
  
  // Arrays (from backend)
  loanTenureYears?: number[];
  tenureMonths?: number[];
  tenureOptions?: string[];
  interestRateTiers?: Array<{
    minBalance: number;
    maxBalance?: number;
    rate: number;
  }>;
  
  // String fields (keep existing)
  rewards?: string;
  rewardsRate?: string;
  signupBonus?: string;
  tier?: string;
  cardNetwork?: string;
  loanAmount?: string; // Fallback for string format
  loanTerm?: string; // Fallback for string format
  tenure?: string; // Fallback for string format
  minBalance?: string; // Fallback for backward compatibility
  
  // Credit card specific
  rewardsProgram?: boolean;
  
  // Fixed deposit specific
  interestPayoutFrequency?: string;
  interestRateType?: string;
  
  // Debit card specific
  cardInfo?: string;
  cardReplacementFee?: string | number;
  cardReplacementFeeFaulty?: string | number;
  pinReplacementFee?: string | number;
  atmFees?: string | number;
  dailyAtmLimit?: string | number;
  dailyPurchaseLimit?: string | number;
  contactlessLimit?: string | number;
  dailyCardlessWithdrawal?: string | number;
  dailyBillPaymentLimit?: string | number;
  dailyTopupLimit?: string | number;
  dailyP2pLimit?: string | number;
  hariRayaP2pLimit?: string;
  hariRayaP2pNote?: string;
  minimumTransaction?: string;
  accountRequirement?: string;
  prestigeMembership?: string;
  perdanaMembership?: string;
  mobileWallets?: string;
  premiumBenefits?: string[] | string;
  travelInsurance?: string;
  loungeAccess?: string;
  
  // Features
  features?: string[];
  onlineBanking?: boolean;
  mobileApp?: boolean;
  atmAccess?: boolean;
  debitCard?: boolean;
  creditCard?: boolean;
  chequeBook?: boolean;
  mobileWalletCompatible?: string[];
}

export interface ScoreBreakdown {
  category: string;
  score: number;
  color: string;
}

export interface ProductExplanation {
  mainExplanation?: string;
  keyStrengths?: string[];
  goalBenefits?: Array<{
    goalId: string;
    goalName: string;
    benefit: string;
    timeline?: string;
    monthlyContribution?: string;
  }>;
  cashFlowImpact?: string;
  comparisonContext?: {
    vsExistingProducts?: string;
    improvement?: string;
  };
}

export interface BankingProduct {
  id: string;
  productId: string;
  name: string;
  bank: string;
  type: BankingProductType;
  description?: string;
  matchScore: number;
  eligibilityStatus: EligibilityStatus;
  alignedGoals: string[];
  features: ProductAttributes;
  scoreBreakdown?: ScoreBreakdown[];
  explanation?: ProductExplanation;
}

// API Response Types
export interface BankingProductRecommendation {
  productId: string;
  productCode?: string;
  productName: string;
  bankName: string;
  productType: BankingProductType;
  productCategory?: string;
  overallScore: number;
  isEligible: boolean;
  eligibilityGaps?: EligibilityGap[];
  alignedGoals: Array<{
    goalId: string;
    goalName: string;
    matchScore: number;
  }>;
  product: {
    id?: string;
    productCode?: string;
    productName?: string;
    bankName?: string;
    productType?: BankingProductType;
    productCategory?: string;
    isShariahCompliant?: boolean;
    attributes: ProductAttributes;
    description?: string;
  };
  // Optional fields - may be missing
  chartData?: Array<{
    category: string;
    value: number;
  }>;
  scoreContributions?: Array<{
    category: string;
    contribution: number;
  }>;
  scoreBreakdown?: {
    financialAndCashFlowFit?: number;
    personalityFit?: number;
    goalAlignment?: number;
    portfolioFit?: number;
  };
  portfolioFitDetails?: {
    productTypeDiversity?: number;
    avoidsDuplication?: boolean;
    fillsGap?: boolean;
  };
  crossGoalProduct?: boolean;
  explanation?: ProductExplanation;
}

export interface EligibilityGap {
  requirement: string;
  userStatus: string;
  severity: 'low' | 'medium' | 'high';
}

export interface BankingProductRecommendationsResponse {
  // Backend uses "recommendations" not "products"
  recommendations: BankingProductRecommendation[];
  // Backend uses "byGoal" not "groupedByGoal"
  byGoal?: Array<{
    goalId: string;
    goalName: string;
    products: BankingProductRecommendation[];
  }>;
  crossGoal?: BankingProductRecommendation[];
  filteredProducts?: BankingProductRecommendation[];
  metadata?: {
    totalProducts: number;
    eligibleCount: number;
    eligibleProducts?: number;
    averageScore: number;
    hasSpendingData?: boolean;
    hasExistingProducts?: boolean;
    hasActiveGoals?: boolean;
    confidenceLevel?: 'low' | 'medium' | 'high';
  };
}

export interface ProductComparisonResponse {
  products: BankingProductRecommendation[];
  comparison: {
    [key: string]: {
      [productId: string]: string | number;
    };
  };
  highlights?: {
    [productId: string]: string[];
  };
  summary?: string;
}

export interface UserProduct {
  id: string;
  productId: string;
  productName: string;
  bankName: string;
  productType: BankingProductType;
  // Balance fields - vary by product type
  currentBalance?: number; // For savings/fixed deposit
  outstandingBalance?: number; // For credit card/loan
  creditLimit?: number; // For credit card (optional)
  loanAmount?: number; // For loan (required)
  monthlyPayment?: number; // For loan (optional)
  // Dates
  openedDate?: string; // Optional for all types
  lastUsedDate?: string; // Optional for all types
  // Other
  notes?: string;
  addedDate: string;
  lastUpdated?: string;
}

export interface BankingProfileResponse {
  // Backend uses "existingProducts" not "products"
  // Can be null if user has no products
  existingProducts?: UserProduct[];
  products?: UserProduct[]; // Keep for backward compatibility
  userId?: string;
  totalBalance?: number;
  createdAt?: string;
  updatedAt?: string;
  lastUpdated?: string; // Keep for backward compatibility
}

export interface ProductCatalogItem {
  id: string; // UUID - Backend uses 'id' not 'productId'
  productCode: string; // e.g., "BIBD-SAV-001"
  productName: string; // REQUIRED - e.g., "BIBD Savings Account" - MUST NOT be empty
  bankName: string; // REQUIRED - e.g., "BIBD", "Baiduri", "TAIB" - MUST NOT be empty
  productType: string; // Backend returns: "savings_account" | "fixed_deposit" | "credit_card" | "debit_card" | "virtual_prepaid_card" | "loan"
  productCategory: string; // e.g., "deposit" | "credit" | "loan"
  isShariahCompliant: boolean;
  description: string | null; // Can be null - Product description
  attributes: ProductAttributes; // All product details here (flat structure, no nesting)
}

export interface ProductCatalogResponse {
  products: ProductCatalogItem[];
  total: number;
  limit?: number;
  offset?: number;
  filters?: {
    productTypes: string[];
    banks: string[];
  };
}
