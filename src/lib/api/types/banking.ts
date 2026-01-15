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
  contactlessTransactionLimit?: string | number;
  dailyCardlessWithdrawal?: string | number;
  dailyBillPaymentLimit?: string | number;
  dailyTopupLimit?: string | number;
  dailyP2pLimit?: string | number;
  hariRayaP2pLimit?: string;
  hariRayaP2pNote?: string;
  minimumTransaction?: string;
  accountRequirement?: string;
  prestigeMembership?: string | object;
  perdanaMembership?: string | object;
  mobileWallets?: string;
  premiumBenefits?: string[] | string;
  travelInsurance?: string;
  loungeAccess?: string | object;
  
  // Additional fees
  atmWithdrawalOwnBank?: string | number;
  atmWithdrawalOtherLocal?: string | number;
  atmWithdrawalInternational?: string | number;
  disputeHandlingFee?: string | number;
  billPaymentFee?: string | number;
  p2pTransferFeeVcard?: string | number;
  atmCardlessWithdrawalFee?: string | number;
  salesDraftRetrievalFee?: string | number;
  nonPhysicalTransferFee?: string | number;
  
  // Features (flat fields)
  onlineBanking?: boolean | string; // Can be boolean from API or "Yes"/"No" string after transformation
  mobileApp?: boolean | string; // Can be boolean from API or "Yes"/"No" string after transformation
  atmAccess?: boolean | string; // Can be boolean from API or "Yes"/"No" string after transformation
  debitCard?: boolean;
  creditCard?: boolean;
  chequeBook?: boolean;
  mobileWalletCompatible?: string[];
  
  // Additional feature fields
  chipEnabled?: boolean;
  onlineShopping?: boolean;
  rewardsProgram?: boolean;
  rewardsRate?: string;
  rewardsNote?: string;
  contactlessPayment?: boolean;
  globalAcceptance?: boolean;
  atmAccessNetworks?: string[];
  digitalBanking?: string[];
  p2pTransfers?: string[];
  topupServices?: string[];
  specialOffers?: string[];
  familyCards?: boolean;
  cardFormat?: string;
  billPayment?: boolean;
  atmCardlessWithdrawal?: boolean;
  shariahConcept?: string;
  
  // Nested objects (from catalog items - these override flat fields if present)
  fees?: {
    annual_fee?: number;
    card_replacement_fee?: number;
    card_replacement_fee_faulty?: number;
    card_replacement_fee_lost?: number;
    pin_replacement_fee?: number;
    foreign_transaction_fee?: number;
    foreign_transaction_fee_type?: string;
    atm_withdrawal_own_bank?: number;
    atm_withdrawal_other_local?: number;
    atm_withdrawal_international?: number;
    dispute_handling_fee?: number;
    bill_payment_fee?: number;
    p2p_transfer_fee_vcard?: number;
    atm_cardless_withdrawal_fee?: number;
    sales_draft_retrieval_fee?: number;
    non_physical_transfer_fee?: number;
    [key: string]: any;
  };
  limits?: {
    daily_atm_withdrawal_limit?: number;
    daily_purchase_limit?: number;
    daily_purchase_limit_default?: number;
    contactless_transaction_limit?: number;
    daily_atm_cardless_withdrawal?: number;
    daily_bill_payment_limit?: number;
    daily_topup_limit?: number;
    daily_p2p_transfer_limit?: number;
    hari_raya_p2p_limit?: number;
    minimum_transaction?: number;
    [key: string]: any;
  };
  features?: {
    chip_enabled?: boolean;
    online_shopping?: boolean;
    rewards_program?: boolean;
    rewards_rate?: string;
    rewards_note?: string;
    mobile_wallet_compatible?: string[];
    premium_benefits?: string[];
    insurance_coverage?: {
      travel_takaful?: number;
      [key: string]: any;
    };
    lounge_access?: {
      network?: string;
      fee_per_visit?: number;
      [key: string]: any;
    } | string;
    contactless_payment?: boolean;
    global_acceptance?: boolean;
    atm_access_networks?: string[];
    digital_banking?: string[];
    p2p_transfers?: string[];
    topup_services?: string[];
    special_offers?: string[];
    family_cards?: boolean;
    card_format?: string;
    bill_payment?: boolean;
    atm_cardless_withdrawal?: boolean;
    shariah_concept?: string;
    [key: string]: any;
  };
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

export interface ComparisonValue {
  productId: string;
  value: string | number | boolean | null;
  display: string;
  isBest?: boolean;
  isWorst?: boolean;
}

export interface ComparisonRow {
  attribute: string;
  values: ComparisonValue[];
  unit?: string;
  note?: string;
  category?: 'basic' | 'eligibility' | 'fees' | 'rates' | 'features' | 'scores';
}

export interface ComparisonHighlights {
  bestOverall?: string;
  bestValue?: string;
  bestForGoals?: Array<{
    goalId: string;
    goalName: string;
    productId: string;
  }>;
  keyDifferences?: string[];
}

export interface ComparisonSummary {
  recommendation?: string;
  winner?: string;
  winnerReason?: string;
  considerations?: string[];
}

export interface ProductComparisonResponse {
  products: BankingProductRecommendation[];
  comparison: {
    basicInfo?: ComparisonRow[];
    eligibility?: ComparisonRow[];
    fees?: ComparisonRow[];
    rates?: ComparisonRow[];
    features?: ComparisonRow[];
    scores?: ComparisonRow[];
  };
  highlights?: ComparisonHighlights;
  summary?: ComparisonSummary;
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

// Backend response structure for user products (has nested product object)
export interface BackendUserProduct {
  id?: string;
  productId: string;
  // Balance fields
  currentBalance?: number;
  outstandingBalance?: number;
  creditLimit?: number;
  loanAmount?: number;
  monthlyPayment?: number;
  // Dates
  openedDate?: string;
  lastUsedDate?: string;
  // Other
  notes?: string;
  addedDate?: string;
  lastUpdated?: string;
  // Nested product details (backend returns this)
  product?: {
    productName?: string;
    bankName?: string;
    productType?: string;
    productCode?: string;
    productCategory?: string;
    [key: string]: any;
  };
  // Top-level fields for backward compatibility
  productName?: string;
  bankName?: string;
  productType?: string;
}

export interface BankingProfileResponse {
  // Backend uses "existingProducts" not "products"
  // Can be null if user has no products
  // Backend returns BackendUserProduct[] with nested product object
  existingProducts?: BackendUserProduct[];
  products?: BackendUserProduct[]; // Keep for backward compatibility
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

// Financial Summary - Backend calculates assets, liabilities, net worth, and ratios
export interface BankingFinancialSummary {
  // Assets (what you own)
  totalAssets: number; // Savings + Fixed Deposits
  
  // Liabilities (what you owe)
  totalLiabilities: number; // Credit Card Debt + Loan Debt
  
  // Net Worth
  netWorth: number; // Assets - Liabilities
  
  // Debt Ratios (optional - only if income data available)
  debtToIncomeRatio?: number; // Total debt / Monthly income (as percentage)
  creditUtilizationRatio?: number; // Credit card debt / Total credit limit (as percentage)
  
  // Product Counts
  productCountsByType: {
    savings?: number;
    fixedDeposit?: number;
    creditCard?: number;
    loan?: number;
    debitCard?: number;
    virtualPrepaidCard?: number;
    checking?: number;
    moneyMarket?: number;
  };
  
  // Breakdown (optional - for detailed view)
  assetsBreakdown?: {
    savings: number;
    fixedDeposits: number;
  };
  
  liabilitiesBreakdown?: {
    creditCardDebt: number;
    loanDebt: number;
  };
}
