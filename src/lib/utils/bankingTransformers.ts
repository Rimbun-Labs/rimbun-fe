import type {
  BankingProductRecommendation,
  BankingProduct,
  BankingProductRecommendationsResponse,
  ProductComparisonResponse,
  ProductComparison,
  BankingProfileResponse,
  UserProduct,
  ProductCatalogItem,
  BankingProductType,
  EligibilityStatus,
  ScoreBreakdown,
} from '@/lib/api/types/banking';

/**
 * Map API product type to frontend product type
 */
export function mapProductType(apiType: string): BankingProductType {
  const typeMap: Record<string, BankingProductType> = {
    'savings_account': 'savings',
    'fixed_deposit': 'cd',
    'credit_card': 'credit_card',
    'loan': 'loan',
    'checking_account': 'checking',
    'money_market': 'money_market',
    'debit_card': 'debit_card',
    'virtual_prepaid_card': 'virtual_prepaid_card',
  };
  
  return typeMap[apiType] || 'savings';
}

/**
 * Map eligibility boolean + gaps to status string
 */
export function mapEligibilityStatus(
  isEligible: boolean,
  gaps?: Array<{ severity: string }>
): EligibilityStatus {
  if (isEligible) {
    return 'eligible';
  }
  
  if (!gaps || gaps.length === 0) {
    return 'not_eligible';
  }
  
  const hasLowSeverity = gaps.some(g => g.severity === 'low');
  if (hasLowSeverity) {
    return 'may_qualify';
  }
  
  return 'likely_eligible';
}

/**
 * Capitalize "Elite" consistently
 * Handles non-string values gracefully
 */
export function capitalizeElite(text: string | number | null | undefined): string {
  // Handle null/undefined
  if (text == null) {
    return '';
  }
  
  // Convert non-strings to strings
  const textStr = typeof text === 'string' ? text : String(text);
  
  // Return empty string if result is empty
  if (!textStr) {
    return '';
  }
  
  return textStr.replace(/\belite\b/gi, 'Elite');
}

/**
 * Format product features for display
 * Backend returns numeric values (interestRate: number, annualFee: number)
 * and string variants (annualFeeStr, minimumBalanceStr) for complex cases
 */
export function formatProductFeatures(attributes?: BankingProductRecommendation['product']['attributes']): BankingProduct['features'] {
  if (!attributes) return {};
  
  const features: BankingProduct['features'] = {};
  
  // Helper to format numbers with currency
  const formatCurrency = (value: number | string | undefined): string | undefined => {
    if (value === undefined || value === null) return undefined;
    if (typeof value === 'number') {
      if (value === 0) return 'No fee';
      return `BND ${value.toLocaleString()}`;
    }
    return String(value);
  };
  
  // Helper to format percentages
  const formatPercentage = (value: number | string | undefined): string | undefined => {
    if (value === undefined || value === null) return undefined;
    if (typeof value === 'number') return `${value}%`;
    return String(value);
  };
  
  // Interest Rates - check numeric first, then string variants
  if (attributes.interestRate !== undefined && attributes.interestRate !== null) {
    features.interestRate = formatPercentage(attributes.interestRate);
  } else if (attributes.interestRateStr) {
    features.interestRate = String(attributes.interestRateStr);
  }
  
  // APY - check numeric first, then string variant
  if (attributes.apy !== undefined && attributes.apy !== null) {
    features.apy = formatPercentage(attributes.apy);
  } else if (attributes.apyStr) {
    features.apy = String(attributes.apyStr);
  }
  
  // Annual Fee - check string variant first (has complex text), then numeric
  if (attributes.annualFeeStr) {
    features.annualFee = capitalizeElite(attributes.annualFeeStr);
  } else if (attributes.annualFee !== undefined && attributes.annualFee !== null) {
    const fee = formatCurrency(attributes.annualFee);
    features.annualFee = fee === 'No fee' ? 'No annual fee' : fee;
  }
  
  // Monthly Fee - check string variant first, then numeric
  if (attributes.monthlyFeeStr) {
    features.monthlyFee = String(attributes.monthlyFeeStr);
  } else if (attributes.monthlyFee !== undefined && attributes.monthlyFee !== null) {
    const fee = formatCurrency(attributes.monthlyFee);
    features.monthlyFee = fee === 'No fee' ? 'No monthly fee' : fee;
  }
  
  // Minimum Balance - backend uses 'minimumBalance' not 'minBalance'
  if (attributes.minimumBalanceStr) {
    features.minBalance = String(attributes.minimumBalanceStr);
  } else if (attributes.minimumBalance !== undefined && attributes.minimumBalance !== null) {
    features.minBalance = formatCurrency(attributes.minimumBalance);
  } else if (attributes.minBalance) {
    // Fallback to minBalance for backward compatibility
    features.minBalance = typeof attributes.minBalance === 'string' ? attributes.minBalance : String(attributes.minBalance);
  }

  // Maximum Balance
  if (attributes.maximumBalance !== undefined && attributes.maximumBalance !== null) {
    features.maximumBalance = formatCurrency(attributes.maximumBalance);
  } else if (attributes.maximumBalance) {
    features.maximumBalance = typeof attributes.maximumBalance === 'string' ? attributes.maximumBalance : String(attributes.maximumBalance);
  }

  // Minimum Balance to Avoid Fee
  if (attributes.minimumBalanceToAvoidFee !== undefined && attributes.minimumBalanceToAvoidFee !== null) {
    features.minimumBalanceToAvoidFee = formatCurrency(attributes.minimumBalanceToAvoidFee);
  } else if (attributes.minimumBalanceToAvoidFee) {
    features.minimumBalanceToAvoidFee = typeof attributes.minimumBalanceToAvoidFee === 'string' ? attributes.minimumBalanceToAvoidFee : String(attributes.minimumBalanceToAvoidFee);
  }
  
  // Credit Limit - check numeric first, then string, then range
  if (attributes.creditLimit !== undefined && attributes.creditLimit !== null) {
    features.creditLimit = formatCurrency(attributes.creditLimit);
  } else if (attributes.creditLimitStr) {
    features.creditLimit = String(attributes.creditLimitStr);
  } else if (attributes.creditLimitMin !== undefined && attributes.creditLimitMax !== undefined) {
    features.creditLimit = `${formatCurrency(attributes.creditLimitMin)} - ${formatCurrency(attributes.creditLimitMax)}`;
  } else if (attributes.creditLimit) {
    // Fallback for string creditLimit
    features.creditLimit = typeof attributes.creditLimit === 'string' ? attributes.creditLimit : String(attributes.creditLimit);
  }
  
  // Loan Amount - check string variant first, then numeric range
  if (attributes.loanAmountMaxStr) {
    features.loanAmount = String(attributes.loanAmountMaxStr);
  } else if (attributes.loanAmountMin !== undefined && attributes.loanAmountMax !== undefined) {
    features.loanAmount = `${formatCurrency(attributes.loanAmountMin)} - ${formatCurrency(attributes.loanAmountMax)}`;
  } else if (attributes.loanAmountMax !== undefined) {
    features.loanAmount = `Up to ${formatCurrency(attributes.loanAmountMax)}`;
  } else if (attributes.loanAmount) {
    // Fallback for string loanAmount
    features.loanAmount = typeof attributes.loanAmount === 'string' ? attributes.loanAmount : String(attributes.loanAmount);
  }
  
  // Loan Tenure - check array first, then string
  if (attributes.loanTenureYears && Array.isArray(attributes.loanTenureYears) && attributes.loanTenureYears.length > 0) {
    features.loanTerm = `${attributes.loanTenureYears.join(', ')} years`;
  } else if (attributes.loanTerm) {
    features.loanTerm = typeof attributes.loanTerm === 'string' ? attributes.loanTerm : String(attributes.loanTerm);
  }
  
  // Processing Fee - check string variant first, then numeric
  if (attributes.processingFeeStr) {
    features.processingFee = String(attributes.processingFeeStr);
  } else if (attributes.processingFee !== undefined && attributes.processingFee !== null) {
    features.processingFee = formatCurrency(attributes.processingFee);
  } else if (attributes.processingFee) {
    // Fallback for string processingFee
    features.processingFee = typeof attributes.processingFee === 'string' ? attributes.processingFee : String(attributes.processingFee);
  }
  
  // Fixed Deposit Tenure - check array first
  if (attributes.tenureMonths && Array.isArray(attributes.tenureMonths) && attributes.tenureMonths.length > 0) {
    features.tenure = attributes.tenureMonths.map(m => `${m} month${m > 1 ? 's' : ''}`).join(', ');
  } else if (attributes.tenureOptions && Array.isArray(attributes.tenureOptions) && attributes.tenureOptions.length > 0) {
    features.tenure = attributes.tenureOptions.join(', ');
  } else if (attributes.tenure) {
    features.tenure = typeof attributes.tenure === 'string' ? attributes.tenure : String(attributes.tenure);
  }

  // Fixed Deposit Interest Details
  if (attributes.interestPayoutFrequency) {
    features.interestPayoutFrequency = typeof attributes.interestPayoutFrequency === 'string' ? attributes.interestPayoutFrequency : String(attributes.interestPayoutFrequency);
  }

  if (attributes.interestRateType) {
    features.interestRateType = typeof attributes.interestRateType === 'string' ? attributes.interestRateType : String(attributes.interestRateType);
  }

  // Interest Rate Tiers (for savings and fixed deposits)
  if (attributes.interestRateTiers && Array.isArray(attributes.interestRateTiers) && attributes.interestRateTiers.length > 0) {
    features.interestRateTiers = attributes.interestRateTiers;
  }
  
  // Early Withdrawal Penalty - check numeric first, then string variant
  if (attributes.earlyWithdrawalPenalty !== undefined && attributes.earlyWithdrawalPenalty !== null) {
    features.earlyWithdrawalPenalty = formatPercentage(attributes.earlyWithdrawalPenalty);
  } else if (attributes.earlyWithdrawalPenaltyStr) {
    features.earlyWithdrawalPenalty = String(attributes.earlyWithdrawalPenaltyStr);
  } else if (attributes.earlyWithdrawalPenalty) {
    // Fallback for string earlyWithdrawalPenalty
    features.earlyWithdrawalPenalty = typeof attributes.earlyWithdrawalPenalty === 'string' ? attributes.earlyWithdrawalPenalty : String(attributes.earlyWithdrawalPenalty);
  }
  
  // APR - check numeric first, then string variant
  if (attributes.apr !== undefined && attributes.apr !== null) {
    features.apr = formatPercentage(attributes.apr);
  } else if (attributes.aprStr) {
    features.apr = String(attributes.aprStr);
  } else if (attributes.apr) {
    // Fallback for string apr
    features.apr = typeof attributes.apr === 'string' ? attributes.apr : String(attributes.apr);
  }
  
  // Rewards - check rewardsRate first, then rewards
  if (attributes.rewardsRate) {
    features.rewards = capitalizeElite(attributes.rewardsRate);
  } else if (attributes.rewards) {
    features.rewards = capitalizeElite(attributes.rewards);
  }
  
  // Tier
  if (attributes.tier) {
    features.tier = capitalizeElite(attributes.tier);
  }
  
  // Card Network
  if (attributes.cardNetwork) {
    features.cardNetwork = typeof attributes.cardNetwork === 'string' ? attributes.cardNetwork : String(attributes.cardNetwork);
  }
  
  // Signup Bonus
  if (attributes.signupBonus) {
    features.signupBonus = typeof attributes.signupBonus === 'string' ? attributes.signupBonus : String(attributes.signupBonus);
  }
  
  // Debit card specific
  if (attributes.cardInfo) {
    features.cardInfo = capitalizeElite(attributes.cardInfo);
  }
  
  // Fees - handle numeric values
  if (attributes.cardReplacementFee !== undefined && attributes.cardReplacementFee !== null) {
    features.cardReplacementFee = formatCurrency(attributes.cardReplacementFee);
  } else if (attributes.cardReplacementFee) {
    features.cardReplacementFee = typeof attributes.cardReplacementFee === 'string' ? attributes.cardReplacementFee : String(attributes.cardReplacementFee);
  }
  
  if (attributes.cardReplacementFeeFaulty !== undefined && attributes.cardReplacementFeeFaulty !== null) {
    features.cardReplacementFeeFaulty = formatCurrency(attributes.cardReplacementFeeFaulty);
  } else if (attributes.cardReplacementFeeFaulty) {
    features.cardReplacementFeeFaulty = typeof attributes.cardReplacementFeeFaulty === 'string' ? attributes.cardReplacementFeeFaulty : String(attributes.cardReplacementFeeFaulty);
  }
  
  if (attributes.pinReplacementFee !== undefined && attributes.pinReplacementFee !== null) {
    features.pinReplacementFee = formatCurrency(attributes.pinReplacementFee);
  } else if (attributes.pinReplacementFee) {
    features.pinReplacementFee = typeof attributes.pinReplacementFee === 'string' ? attributes.pinReplacementFee : String(attributes.pinReplacementFee);
  }
  
  if (attributes.atmFees !== undefined && attributes.atmFees !== null) {
    features.atmFees = formatCurrency(attributes.atmFees);
  } else if (attributes.atmFees) {
    features.atmFees = typeof attributes.atmFees === 'string' ? attributes.atmFees : String(attributes.atmFees);
  }
  
  if (attributes.foreignTransactionFee !== undefined && attributes.foreignTransactionFee !== null) {
    features.foreignTransactionFee = formatPercentage(attributes.foreignTransactionFee);
  } else if (attributes.foreignTransactionFee) {
    features.foreignTransactionFee = typeof attributes.foreignTransactionFee === 'string' ? attributes.foreignTransactionFee : String(attributes.foreignTransactionFee);
  }

  // Additional credit card fees
  if (attributes.cashAdvanceFee !== undefined && attributes.cashAdvanceFee !== null) {
    features.cashAdvanceFee = formatCurrency(attributes.cashAdvanceFee);
  } else if (attributes.cashAdvanceFee) {
    features.cashAdvanceFee = typeof attributes.cashAdvanceFee === 'string' ? attributes.cashAdvanceFee : String(attributes.cashAdvanceFee);
  }

  if (attributes.latePaymentFee !== undefined && attributes.latePaymentFee !== null) {
    features.latePaymentFee = formatCurrency(attributes.latePaymentFee);
  } else if (attributes.latePaymentFee) {
    features.latePaymentFee = typeof attributes.latePaymentFee === 'string' ? attributes.latePaymentFee : String(attributes.latePaymentFee);
  }

  // Opening and closing fees
  if (attributes.openingFee !== undefined && attributes.openingFee !== null) {
    features.openingFee = formatCurrency(attributes.openingFee);
  } else if (attributes.openingFee) {
    features.openingFee = typeof attributes.openingFee === 'string' ? attributes.openingFee : String(attributes.openingFee);
  }

  if (attributes.closingFee !== undefined && attributes.closingFee !== null) {
    features.closingFee = formatCurrency(attributes.closingFee);
  } else if (attributes.closingFee) {
    features.closingFee = typeof attributes.closingFee === 'string' ? attributes.closingFee : String(attributes.closingFee);
  }
  
  // Limits - handle numeric values
  if (attributes.dailyAtmLimit !== undefined && attributes.dailyAtmLimit !== null) {
    features.dailyAtmLimit = formatCurrency(attributes.dailyAtmLimit);
  } else if (attributes.dailyAtmLimit) {
    features.dailyAtmLimit = typeof attributes.dailyAtmLimit === 'string' ? attributes.dailyAtmLimit : String(attributes.dailyAtmLimit);
  }
  
  if (attributes.dailyPurchaseLimit !== undefined && attributes.dailyPurchaseLimit !== null) {
    features.dailyPurchaseLimit = formatCurrency(attributes.dailyPurchaseLimit);
  } else if (attributes.dailyPurchaseLimit) {
    features.dailyPurchaseLimit = typeof attributes.dailyPurchaseLimit === 'string' ? attributes.dailyPurchaseLimit : String(attributes.dailyPurchaseLimit);
  }
  
  if (attributes.contactlessLimit !== undefined && attributes.contactlessLimit !== null) {
    features.contactlessLimit = formatCurrency(attributes.contactlessLimit);
  } else if (attributes.contactlessLimit) {
    features.contactlessLimit = typeof attributes.contactlessLimit === 'string' ? attributes.contactlessLimit : String(attributes.contactlessLimit);
  }
  
  if (attributes.dailyCardlessWithdrawal !== undefined && attributes.dailyCardlessWithdrawal !== null) {
    features.dailyCardlessWithdrawal = formatCurrency(attributes.dailyCardlessWithdrawal);
  } else if (attributes.dailyCardlessWithdrawal) {
    features.dailyCardlessWithdrawal = typeof attributes.dailyCardlessWithdrawal === 'string' ? attributes.dailyCardlessWithdrawal : String(attributes.dailyCardlessWithdrawal);
  }
  
  if (attributes.dailyBillPaymentLimit !== undefined && attributes.dailyBillPaymentLimit !== null) {
    features.dailyBillPaymentLimit = formatCurrency(attributes.dailyBillPaymentLimit);
  } else if (attributes.dailyBillPaymentLimit) {
    features.dailyBillPaymentLimit = typeof attributes.dailyBillPaymentLimit === 'string' ? attributes.dailyBillPaymentLimit : String(attributes.dailyBillPaymentLimit);
  }
  
  if (attributes.dailyTopupLimit !== undefined && attributes.dailyTopupLimit !== null) {
    features.dailyTopupLimit = formatCurrency(attributes.dailyTopupLimit);
  } else if (attributes.dailyTopupLimit) {
    features.dailyTopupLimit = typeof attributes.dailyTopupLimit === 'string' ? attributes.dailyTopupLimit : String(attributes.dailyTopupLimit);
  }
  
  if (attributes.dailyP2pLimit !== undefined && attributes.dailyP2pLimit !== null) {
    features.dailyP2pLimit = formatCurrency(attributes.dailyP2pLimit);
  } else if (attributes.dailyP2pLimit) {
    features.dailyP2pLimit = typeof attributes.dailyP2pLimit === 'string' ? attributes.dailyP2pLimit : String(attributes.dailyP2pLimit);
  }
  
  // String-only fields
  if (attributes.hariRayaP2pLimit) features.hariRayaP2pLimit = typeof attributes.hariRayaP2pLimit === 'string' ? attributes.hariRayaP2pLimit : String(attributes.hariRayaP2pLimit);
  if (attributes.hariRayaP2pNote) features.hariRayaP2pNote = typeof attributes.hariRayaP2pNote === 'string' ? attributes.hariRayaP2pNote : String(attributes.hariRayaP2pNote);
  if (attributes.minimumTransaction) features.minimumTransaction = typeof attributes.minimumTransaction === 'string' ? attributes.minimumTransaction : String(attributes.minimumTransaction);
  if (attributes.accountRequirement) features.accountRequirement = typeof attributes.accountRequirement === 'string' ? attributes.accountRequirement : String(attributes.accountRequirement);
  if (attributes.prestigeMembership) {
    features.prestigeMembership = capitalizeElite(attributes.prestigeMembership);
  }
  if (attributes.perdanaMembership) {
    features.perdanaMembership = capitalizeElite(attributes.perdanaMembership);
  }
  if (attributes.mobileWallets) features.mobileWallets = typeof attributes.mobileWallets === 'string' ? attributes.mobileWallets : String(attributes.mobileWallets);
  if (attributes.premiumBenefits) {
    features.premiumBenefits = Array.isArray(attributes.premiumBenefits)
      ? attributes.premiumBenefits
      : [attributes.premiumBenefits];
  }
  if (attributes.travelInsurance) features.travelInsurance = typeof attributes.travelInsurance === 'string' ? attributes.travelInsurance : String(attributes.travelInsurance);
  if (attributes.loungeAccess) features.loungeAccess = typeof attributes.loungeAccess === 'string' ? attributes.loungeAccess : String(attributes.loungeAccess);
  
  // Digital Features
  if (attributes.onlineBanking !== undefined) {
    features.onlineBanking = attributes.onlineBanking;
  }
  if (attributes.mobileApp !== undefined) {
    features.mobileApp = attributes.mobileApp;
  }
  if (attributes.atmAccess !== undefined) {
    features.atmAccess = attributes.atmAccess;
  }
  if (attributes.mobileWalletCompatible && Array.isArray(attributes.mobileWalletCompatible)) {
    features.mobileWalletCompatible = attributes.mobileWalletCompatible;
  }
  
  return features;
}

/**
 * Transform API recommendation to frontend product
 */
export function transformRecommendation(
  apiProduct: BankingProductRecommendation
): BankingProduct {
  // Handle optional chartData and scoreContributions
  const chartData = apiProduct.chartData || [];
  const scoreContributions = apiProduct.scoreContributions || [];
  
  // Build score breakdown from chartData and scoreContributions if available
  // Otherwise use scoreBreakdown if provided
  let scoreBreakdown: ScoreBreakdown[] = [];
  
  if (chartData.length > 0) {
    scoreBreakdown = chartData.map((item, index) => {
      const contribution = scoreContributions[index];
      return {
        category: item.category,
        score: contribution?.contribution || item.value,
        color: getCategoryColor(item.category),
      };
    });
  } else if (apiProduct.scoreBreakdown) {
    // Fallback to scoreBreakdown object if chartData is not available
    scoreBreakdown = [
      { category: 'Financial Fit', score: apiProduct.scoreBreakdown.financialAndCashFlowFit || 0, color: getCategoryColor('Financial Fit') },
      { category: 'Personality Fit', score: apiProduct.scoreBreakdown.personalityFit || 0, color: getCategoryColor('Personality Fit') },
      { category: 'Goal Alignment', score: apiProduct.scoreBreakdown.goalAlignment || 0, color: getCategoryColor('Goal Alignment') },
      { category: 'Portfolio Fit', score: apiProduct.scoreBreakdown.portfolioFit || 0, color: getCategoryColor('Portfolio Fit') },
    ].filter(item => item.score > 0);
  }
  
  // Handle alignedGoals - may be empty array
  const alignedGoals = (apiProduct.alignedGoals || []).map(g => g.goalName);
  
  // Use top-level fields first, fallback to nested product object
  // Backend provides both top-level and nested fields
  // Handle both undefined and empty strings
  const productName = (apiProduct.productName?.trim() || apiProduct.product?.productName?.trim() || '').trim();
  const bankName = (apiProduct.bankName?.trim() || apiProduct.product?.bankName?.trim() || '').trim();
  const productType = apiProduct.productType || apiProduct.product?.productType || 'savings';
  const description = (apiProduct.product?.description || '').trim();
  
  // Log for debugging if fields are missing
  if (!productName || !bankName) {
    console.warn('[Transform] Missing product name or bank name:', {
      productId: apiProduct.productId,
      topLevel: {
        productName: apiProduct.productName,
        bankName: apiProduct.bankName,
        productType: apiProduct.productType,
      },
      nested: {
        productName: apiProduct.product?.productName,
        bankName: apiProduct.product?.bankName,
        productType: apiProduct.product?.productType,
      },
      fullApiProduct: apiProduct, // Log full object for debugging
    });
  }
  
  return {
    id: apiProduct.productId,
    productId: apiProduct.productId,
    name: productName,
    bank: bankName,
    type: mapProductType(productType),
    description: description,
    matchScore: apiProduct.overallScore || 0,
    eligibilityStatus: mapEligibilityStatus(
      apiProduct.isEligible ?? false,
      apiProduct.eligibilityGaps
    ),
    alignedGoals,
    features: formatProductFeatures(apiProduct.product?.attributes),
    scoreBreakdown,
    explanation: apiProduct.explanation,
  };
}

/**
 * Get color for score breakdown category
 */
function getCategoryColor(category: string): string {
  const colorMap: Record<string, string> = {
    'Goal Alignment': '#3B82F6',
    'Financial Fit': '#10B981',
    'Eligibility': '#F59E0B',
    'Portfolio Fit': '#8B5CF6',
    'Cost Efficiency': '#EF4444',
  };
  
  return colorMap[category] || '#6B7280';
}

/**
 * Transform recommendations response
 * Backend returns: { recommendations: [...], byGoal: [...], crossGoal: [...] }
 */
export function transformRecommendationsResponse(
  apiResponse: BankingProductRecommendationsResponse
): {
  products: BankingProduct[];
  groupedByGoal?: Array<{
    goalId: string;
    goalName: string;
    products: BankingProduct[];
  }>;
  crossGoal?: BankingProduct[];
  filteredProducts?: BankingProduct[];
  metadata?: BankingProductRecommendationsResponse['metadata'];
} {
  try {
    // Log for debugging
    console.log('[Transform] Recommendations response structure:', {
      hasRecommendations: !!apiResponse.recommendations,
      recommendationsCount: apiResponse.recommendations?.length || 0,
      hasByGoal: !!apiResponse.byGoal,
      byGoalCount: apiResponse.byGoal?.length || 0,
      hasCrossGoal: !!apiResponse.crossGoal,
      crossGoalCount: apiResponse.crossGoal?.length || 0,
      hasMetadata: !!apiResponse.metadata,
    });

    // Use backend field names: recommendations (not products), byGoal (not groupedByGoal)
    const recommendations = apiResponse.recommendations || [];
    const byGoal = apiResponse.byGoal || [];
    const crossGoal = apiResponse.crossGoal || [];
    const filteredProducts = apiResponse.filteredProducts || [];

    // Log first product structure for debugging
    if (recommendations.length > 0) {
      console.log('[Transform] First recommendation structure:', {
        productId: recommendations[0].productId,
        productName: recommendations[0].productName,
        bankName: recommendations[0].bankName,
        hasNestedProduct: !!recommendations[0].product,
        nestedProductName: recommendations[0].product?.productName,
        nestedBankName: recommendations[0].product?.bankName,
      });
    }

    return {
      products: recommendations.map((rec, index) => {
        try {
          return transformRecommendation(rec);
        } catch (error) {
          console.error(`[Transform] Error transforming recommendation ${index}:`, error);
          console.error('[Transform] Problematic recommendation:', rec);
          // Return a minimal valid product to prevent UI crash
          return {
            id: rec.productId || `error-${index}`,
            productId: rec.productId || `error-${index}`,
            name: rec.productName || rec.product?.productName || 'Product Name Not Available',
            bank: rec.bankName || rec.product?.bankName || 'Bank Name Not Available',
            type: mapProductType(rec.productType || rec.product?.productType || 'savings'),
            description: rec.product?.description || '',
            matchScore: rec.overallScore || 0,
            eligibilityStatus: mapEligibilityStatus(rec.isEligible ?? false, rec.eligibilityGaps),
            alignedGoals: (rec.alignedGoals || []).map(g => g.goalName),
            features: formatProductFeatures(rec.product?.attributes),
            scoreBreakdown: [],
            explanation: rec.explanation,
          };
        }
      }),
      groupedByGoal: byGoal.map(group => ({
        goalId: group.goalId,
        goalName: group.goalName,
        products: (group.products || []).map(transformRecommendation),
      })),
      crossGoal: crossGoal.map(transformRecommendation),
      filteredProducts: filteredProducts.map(transformRecommendation),
      metadata: apiResponse.metadata,
    };
  } catch (error) {
    console.error('[Transform] Error transforming recommendations response:', error);
    console.error('[Transform] Response that caused error:', apiResponse);
    throw error;
  }
}

/**
 * Transform comparison response
 */
export interface ProductComparison {
  products: BankingProduct[];
  comparison: ProductComparisonResponse['comparison'];
  highlights?: ProductComparisonResponse['highlights'];
  summary?: string;
}

export function transformComparisonResponse(
  apiResponse: ProductComparisonResponse
): ProductComparison {
  return {
    products: apiResponse.products.map(transformRecommendation),
    comparison: apiResponse.comparison,
    highlights: apiResponse.highlights,
    summary: apiResponse.summary,
  };
}

/**
 * Transform profile response
 * Backend returns: { existingProducts: [...], userId, createdAt, updatedAt }
 */
export function transformProfileResponse(
  apiResponse: BankingProfileResponse
): UserProduct[] {
  try {
    // Log for debugging
    console.log('[Transform] Profile response structure:', {
      hasExistingProducts: !!apiResponse.existingProducts,
      existingProductsCount: apiResponse.existingProducts?.length || 0,
      hasProducts: !!apiResponse.products, // Backward compatibility
      productsCount: apiResponse.products?.length || 0,
    });

    // Backend uses "existingProducts" not "products"
    // Support both for backward compatibility
    const products = apiResponse.existingProducts || apiResponse.products || [];

    if (products.length === 0) {
      console.log('[Transform] No products in profile response');
      return [];
    }

    return products.map(product => {
      try {
        return {
          id: product.id || product.productId, // Fallback to productId if id is missing
          productId: product.productId,
          productName: product.productName,
          bankName: product.bankName,
          productType: mapProductType(product.productType),
          // Balance fields - include all that exist in response
          currentBalance: product.currentBalance,
          outstandingBalance: product.outstandingBalance,
          creditLimit: product.creditLimit,
          loanAmount: product.loanAmount,
          monthlyPayment: product.monthlyPayment,
          // Date fields
          openedDate: product.openedDate,
          lastUsedDate: product.lastUsedDate,
          // Other fields
          notes: product.notes,
          addedDate: product.addedDate,
          lastUpdated: product.lastUpdated || apiResponse.updatedAt,
        };
      } catch (error) {
        console.error('[Transform] Error transforming product:', product.productId, error);
        throw error;
      }
    });
  } catch (error) {
    console.error('[Transform] Error transforming profile response:', error);
    console.error('[Transform] Response that caused error:', apiResponse);
    // Return empty array instead of throwing to prevent UI crash
    return [];
  }
}

/**
 * Transform catalog item to product
 * Backend returns FLAT structure (no nested objects):
 * - id, productCode, productName, bankName, productType, productCategory, isShariahCompliant, description, attributes
 * - All fields at top level (unlike recommendations which have nested 'product' object)
 */
export function transformCatalogItem(item: ProductCatalogItem): BankingProduct {
  // Backend uses 'id' not 'productId' for catalog items
  // Use 'id' as both 'id' and 'productId' for consistency with frontend
  const productId = item.id || '';
  
  // Get type labels for fallback
  const typeLabels: Record<string, string> = {
    savings: 'Savings',
    credit_card: 'Credit Card',
    checking: 'Checking',
    cd: 'Fixed Deposit',
    money_market: 'Money Market',
    loan: 'Loan',
    debit_card: 'Debit Card',
    virtual_prepaid_card: 'Virtual Prepaid Card',
  };
  
  // Map backend product type to frontend type
  // Backend: "savings_account", "fixed_deposit", "credit_card", "debit_card", "virtual_prepaid_card", "loan"
  const productType = mapProductType(item.productType || 'savings_account');
  const typeLabel = typeLabels[productType] || 'Product';
  
  // Backend provides FLAT fields - access directly (no nesting)
  // REQUIRED fields: productName, bankName
  const productName = (item.productName || '').trim();
  const bankName = (item.bankName || '').trim();
  const description = item.description || null; // Can be null from backend
  
  // Debug logging - log the FULL raw item first to see actual structure
  console.log('[Transform] Catalog item RAW (full structure):', JSON.stringify(item, null, 2));
  console.log('[Transform] Catalog item field check:', {
    id: productId,
    'item.productName': item.productName,
    'item.productName type': typeof item.productName,
    'item.productName length': item.productName?.length,
    'item.bankName': item.bankName,
    'item.bankName type': typeof item.bankName,
    'item.bankName length': item.bankName?.length,
    'item.productType': item.productType,
    'item.productCode': item.productCode,
    'item.id': item.id,
    'All item keys': Object.keys(item),
  });
  
  // Debug logging for attributes
  console.log('[Transform] Catalog item attributes:', {
    id: productId,
    productName,
    productType: item.productType,
    hasAttributes: !!item.attributes,
    attributesKeys: item.attributes ? Object.keys(item.attributes) : [],
    attributesType: typeof item.attributes,
    // Sample key attributes for debit cards
    annualFee: item.attributes?.annualFee,
    dailyAtmLimit: item.attributes?.dailyAtmLimit,
    rewards: item.attributes?.rewards,
    cardInfo: item.attributes?.cardInfo,
  });
  
  // Log if REQUIRED fields are missing (productName and bankName are REQUIRED by backend)
  if (!productName || !bankName) {
    console.error('[Transform] Catalog item missing REQUIRED fields - DETAILED:', {
      id: productId,
      'Raw item.productName': item.productName,
      'Raw item.productName === undefined': item.productName === undefined,
      'Raw item.productName === null': item.productName === null,
      'Raw item.productName === ""': item.productName === '',
      'Trimmed productName': productName,
      'productName length': productName.length,
      'Raw item.bankName': item.bankName,
      'Raw item.bankName === undefined': item.bankName === undefined,
      'Raw item.bankName === null': item.bankName === null,
      'Raw item.bankName === ""': item.bankName === '',
      'Trimmed bankName': bankName,
      'bankName length': bankName.length,
      productType: item.productType,
      productCode: item.productCode,
      'Full item keys': Object.keys(item),
      'Full item (stringified)': JSON.stringify(item, null, 2),
    });
    
    // If required fields are missing, this is a backend data issue
    // Still return a product to prevent UI crash, but log the error
  }
  
  // Format features from attributes (flat structure, no nesting)
  const features = formatProductFeatures(item.attributes || {});
  
  // Log formatted features for debugging (especially for debit cards)
  if (productType === 'debit_card' || productType === 'virtual_prepaid_card') {
    console.log('[Transform] Debit card formatted features:', {
      id: productId,
      productName,
      formattedFeatures: features,
      hasAnnualFee: !!features.annualFee,
      hasDailyAtmLimit: !!features.dailyAtmLimit,
      hasRewards: !!features.rewards,
      hasCardInfo: !!features.cardInfo,
    });
  }
  
  // Return transformed product
  // NOTE: If productName or bankName are empty, backend data is invalid
  // We still return a product with fallback to prevent UI crash
  return {
    id: productId,
    productId: productId, // Use 'id' as productId for consistency
    name: productName || `${bankName || 'Unknown Bank'} ${typeLabel}`, // Fallback if missing
    bank: bankName || 'Unknown Bank', // Fallback if missing
    type: productType,
    description: description || undefined, // Convert null to undefined for frontend
    matchScore: 0, // Catalog items don't have scores (no personalization)
    eligibilityStatus: 'not_eligible', // Catalog items don't have eligibility (no personalization)
    alignedGoals: [], // Catalog items don't have goal alignment (no personalization)
    features: features,
    scoreBreakdown: [], // Empty array for catalog items (no scores)
    explanation: undefined, // No explanation for catalog items (no personalization)
  };
}

