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
 * Map frontend product type to backend API product type
 * Used when sending productType filter to the backend API
 */
export function mapProductTypeToBackend(frontendType: BankingProductType): string {
  const reverseMap: Record<BankingProductType, string> = {
    'savings': 'savings_account',
    'cd': 'fixed_deposit',
    'credit_card': 'credit_card',
    'loan': 'loan',
    'checking': 'checking_account',
    'money_market': 'money_market',
    'debit_card': 'debit_card',
    'virtual_prepaid_card': 'virtual_prepaid_card',
  };
  
  return reverseMap[frontendType] || 'savings_account';
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

  // NEW: Extract from nested fees object (catalog items have nested structure)
  if (attributes.fees && typeof attributes.fees === 'object' && !Array.isArray(attributes.fees)) {
    const fees = attributes.fees as any;
    // Annual fee from nested fees
    if (fees.annual_fee !== undefined && fees.annual_fee !== null) {
      const fee = formatCurrency(fees.annual_fee);
      features.annualFee = fee === 'No fee' ? 'No annual fee' : fee;
    }
    // Card replacement fee
    if (fees.card_replacement_fee !== undefined && fees.card_replacement_fee !== null) {
      features.cardReplacementFee = formatCurrency(fees.card_replacement_fee);
    }
    // Card replacement fee for faulty cards
    if (fees.card_replacement_fee_faulty !== undefined && fees.card_replacement_fee_faulty !== null) {
      features.cardReplacementFeeFaulty = formatCurrency(fees.card_replacement_fee_faulty);
    }
    // Card replacement fee for lost cards
    if (fees.card_replacement_fee_lost !== undefined && fees.card_replacement_fee_lost !== null) {
      features.cardReplacementFee = formatCurrency(fees.card_replacement_fee_lost);
    }
    // PIN replacement fee
    if (fees.pin_replacement_fee !== undefined && fees.pin_replacement_fee !== null) {
      features.pinReplacementFee = formatCurrency(fees.pin_replacement_fee);
    }
    // Foreign transaction fee
    if (fees.foreign_transaction_fee !== undefined && fees.foreign_transaction_fee !== null) {
      if (fees.foreign_transaction_fee_type === 'percentage') {
        features.foreignTransactionFee = formatPercentage(fees.foreign_transaction_fee);
      } else {
        features.foreignTransactionFee = formatCurrency(fees.foreign_transaction_fee);
      }
    }
    // ATM withdrawal fees
    if (fees.atm_withdrawal_own_bank !== undefined && fees.atm_withdrawal_own_bank !== null) {
      features.atmWithdrawalOwnBank = formatCurrency(fees.atm_withdrawal_own_bank);
    }
    if (fees.atm_withdrawal_other_local !== undefined && fees.atm_withdrawal_other_local !== null) {
      features.atmWithdrawalOtherLocal = formatCurrency(fees.atm_withdrawal_other_local);
    }
    if (fees.atm_withdrawal_international !== undefined && fees.atm_withdrawal_international !== null) {
      features.atmWithdrawalInternational = formatCurrency(fees.atm_withdrawal_international);
    }
    // Dispute handling fee
    if (fees.dispute_handling_fee !== undefined && fees.dispute_handling_fee !== null) {
      features.disputeHandlingFee = formatCurrency(fees.dispute_handling_fee);
    }
    // Bill payment fee
    if (fees.bill_payment_fee !== undefined && fees.bill_payment_fee !== null) {
      features.billPaymentFee = formatCurrency(fees.bill_payment_fee);
    }
    // P2P transfer fee
    if (fees.p2p_transfer_fee_vcard !== undefined && fees.p2p_transfer_fee_vcard !== null) {
      features.p2pTransferFeeVcard = formatCurrency(fees.p2p_transfer_fee_vcard);
    }
    // ATM cardless withdrawal fee
    if (fees.atm_cardless_withdrawal_fee !== undefined && fees.atm_cardless_withdrawal_fee !== null) {
      features.atmCardlessWithdrawalFee = formatCurrency(fees.atm_cardless_withdrawal_fee);
    }
    // Sales draft retrieval fee
    if (fees.sales_draft_retrieval_fee !== undefined && fees.sales_draft_retrieval_fee !== null) {
      features.salesDraftRetrievalFee = formatCurrency(fees.sales_draft_retrieval_fee);
    }
    // Non-physical transfer fee
    if (fees.non_physical_transfer_fee !== undefined && fees.non_physical_transfer_fee !== null) {
      features.nonPhysicalTransferFee = formatCurrency(fees.non_physical_transfer_fee);
    }
  }

  // NEW: Extract from nested limits object
  if (attributes.limits && typeof attributes.limits === 'object' && !Array.isArray(attributes.limits)) {
    const limits = attributes.limits as any;
    // Daily ATM withdrawal limit
    if (limits.daily_atm_withdrawal_limit !== undefined && limits.daily_atm_withdrawal_limit !== null) {
      features.dailyAtmLimit = formatCurrency(limits.daily_atm_withdrawal_limit);
    }
    // Daily purchase limit
    if (limits.daily_purchase_limit !== undefined && limits.daily_purchase_limit !== null) {
      features.dailyPurchaseLimit = formatCurrency(limits.daily_purchase_limit);
    }
    // Daily purchase limit default
    if (limits.daily_purchase_limit_default !== undefined && limits.daily_purchase_limit_default !== null && !features.dailyPurchaseLimit) {
      features.dailyPurchaseLimit = formatCurrency(limits.daily_purchase_limit_default);
    }
    // Contactless transaction limit
    if (limits.contactless_transaction_limit !== undefined && limits.contactless_transaction_limit !== null) {
      features.contactlessLimit = formatCurrency(limits.contactless_transaction_limit);
    }
    // Daily cardless withdrawal
    if (limits.daily_atm_cardless_withdrawal !== undefined && limits.daily_atm_cardless_withdrawal !== null) {
      features.dailyCardlessWithdrawal = formatCurrency(limits.daily_atm_cardless_withdrawal);
    }
    // Daily bill payment limit
    if (limits.daily_bill_payment_limit !== undefined && limits.daily_bill_payment_limit !== null) {
      features.dailyBillPaymentLimit = formatCurrency(limits.daily_bill_payment_limit);
    }
    // Daily topup limit
    if (limits.daily_topup_limit !== undefined && limits.daily_topup_limit !== null) {
      features.dailyTopupLimit = formatCurrency(limits.daily_topup_limit);
    }
    // Daily P2P limit
    if (limits.daily_p2p_transfer_limit !== undefined && limits.daily_p2p_transfer_limit !== null) {
      features.dailyP2pLimit = formatCurrency(limits.daily_p2p_transfer_limit);
    }
    // Hari Raya P2P limit
    if (limits.hari_raya_p2p_limit !== undefined && limits.hari_raya_p2p_limit !== null) {
      features.hariRayaP2pLimit = formatCurrency(limits.hari_raya_p2p_limit);
    }
    // Minimum transaction
    if (limits.minimum_transaction !== undefined && limits.minimum_transaction !== null) {
      features.minimumTransaction = formatCurrency(limits.minimum_transaction);
    }
  }

  // NEW: Extract from nested features object
  if (attributes.features && typeof attributes.features === 'object' && !Array.isArray(attributes.features)) {
    const nestedFeatures = attributes.features as any;
    // Chip enabled
    if (nestedFeatures.chip_enabled !== undefined) {
      features.chipEnabled = nestedFeatures.chip_enabled;
    }
    // Online shopping
    if (nestedFeatures.online_shopping !== undefined) {
      features.onlineShopping = nestedFeatures.online_shopping;
    }
    // Rewards program
    if (nestedFeatures.rewards_program !== undefined) {
      features.rewardsProgram = nestedFeatures.rewards_program;
    }
    // Rewards rate
    if (nestedFeatures.rewards_rate && !features.rewards) {
      features.rewards = capitalizeElite(nestedFeatures.rewards_rate);
    }
    // Rewards note
    if (nestedFeatures.rewards_note && !features.rewards) {
      features.rewards = capitalizeElite(nestedFeatures.rewards_note);
    }
    // Mobile wallet compatible
    if (nestedFeatures.mobile_wallet_compatible && Array.isArray(nestedFeatures.mobile_wallet_compatible)) {
      features.mobileWalletCompatible = nestedFeatures.mobile_wallet_compatible;
    }
    // Premium benefits
    if (nestedFeatures.premium_benefits && Array.isArray(nestedFeatures.premium_benefits)) {
      features.premiumBenefits = nestedFeatures.premium_benefits;
    }
    // Travel insurance / Takaful
    if (nestedFeatures.insurance_coverage?.travel_takaful) {
      features.travelInsurance = `BND ${nestedFeatures.insurance_coverage.travel_takaful.toLocaleString()}`;
    }
    // Lounge access
    if (nestedFeatures.lounge_access) {
      const lounge = nestedFeatures.lounge_access;
      if (typeof lounge === 'object' && lounge.network) {
        const fee = lounge.fee_per_visit ? formatCurrency(lounge.fee_per_visit) : '';
        features.loungeAccess = `${lounge.network}${fee ? ` (${fee} per visit)` : ''}`;
      } else if (typeof lounge === 'string') {
        features.loungeAccess = lounge;
      }
    }
    // Contactless payment
    if (nestedFeatures.contactless_payment !== undefined) {
      features.contactlessPayment = nestedFeatures.contactless_payment;
    }
    // Global acceptance
    if (nestedFeatures.global_acceptance !== undefined) {
      features.globalAcceptance = nestedFeatures.global_acceptance;
    }
    // ATM access networks
    if (nestedFeatures.atm_access_networks && Array.isArray(nestedFeatures.atm_access_networks)) {
      features.atmAccessNetworks = nestedFeatures.atm_access_networks;
    }
    // Digital banking
    if (nestedFeatures.digital_banking && Array.isArray(nestedFeatures.digital_banking)) {
      features.digitalBanking = nestedFeatures.digital_banking;
    }
    // P2P transfers
    if (nestedFeatures.p2p_transfers && Array.isArray(nestedFeatures.p2p_transfers)) {
      features.p2pTransfers = nestedFeatures.p2p_transfers;
    }
    // Topup services
    if (nestedFeatures.topup_services && Array.isArray(nestedFeatures.topup_services)) {
      features.topupServices = nestedFeatures.topup_services;
    }
    // Special offers
    if (nestedFeatures.special_offers && Array.isArray(nestedFeatures.special_offers)) {
      features.specialOffers = nestedFeatures.special_offers;
    }
    // Family cards
    if (nestedFeatures.family_cards !== undefined) {
      features.familyCards = nestedFeatures.family_cards;
    }
    // Card format (for virtual cards)
    if (nestedFeatures.card_format) {
      features.cardFormat = nestedFeatures.card_format;
    }
    // Bill payment
    if (nestedFeatures.bill_payment !== undefined) {
      features.billPayment = nestedFeatures.bill_payment;
    }
    // ATM cardless withdrawal
    if (nestedFeatures.atm_cardless_withdrawal !== undefined) {
      features.atmCardlessWithdrawal = nestedFeatures.atm_cardless_withdrawal;
    }
    // Shariah concept
    if (nestedFeatures.shariah_concept) {
      features.shariahConcept = nestedFeatures.shariah_concept;
    }
  }
  
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
  
  // Annual Fee - check string variant first (has complex text), then numeric, then nested fees
  if (attributes.annualFeeStr && !features.annualFee) {
    features.annualFee = capitalizeElite(attributes.annualFeeStr);
  } else if (attributes.annualFee !== undefined && attributes.annualFee !== null && !features.annualFee) {
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
  
  // Fees - handle numeric values (only if not already set from nested fees)
  if (attributes.cardReplacementFee !== undefined && attributes.cardReplacementFee !== null && !features.cardReplacementFee) {
    features.cardReplacementFee = formatCurrency(attributes.cardReplacementFee);
  } else if (attributes.cardReplacementFee && !features.cardReplacementFee) {
    features.cardReplacementFee = typeof attributes.cardReplacementFee === 'string' ? attributes.cardReplacementFee : String(attributes.cardReplacementFee);
  }
  
  if (attributes.cardReplacementFeeFaulty !== undefined && attributes.cardReplacementFeeFaulty !== null && !features.cardReplacementFeeFaulty) {
    features.cardReplacementFeeFaulty = formatCurrency(attributes.cardReplacementFeeFaulty);
  } else if (attributes.cardReplacementFeeFaulty && !features.cardReplacementFeeFaulty) {
    features.cardReplacementFeeFaulty = typeof attributes.cardReplacementFeeFaulty === 'string' ? attributes.cardReplacementFeeFaulty : String(attributes.cardReplacementFeeFaulty);
  }
  
  if (attributes.pinReplacementFee !== undefined && attributes.pinReplacementFee !== null && !features.pinReplacementFee) {
    features.pinReplacementFee = formatCurrency(attributes.pinReplacementFee);
  } else if (attributes.pinReplacementFee && !features.pinReplacementFee) {
    features.pinReplacementFee = typeof attributes.pinReplacementFee === 'string' ? attributes.pinReplacementFee : String(attributes.pinReplacementFee);
  }
  
  if (attributes.atmFees !== undefined && attributes.atmFees !== null && !features.atmFees) {
    features.atmFees = formatCurrency(attributes.atmFees);
  } else if (attributes.atmFees && !features.atmFees) {
    features.atmFees = typeof attributes.atmFees === 'string' ? attributes.atmFees : String(attributes.atmFees);
  }
  
  if (attributes.foreignTransactionFee !== undefined && attributes.foreignTransactionFee !== null && !features.foreignTransactionFee) {
    features.foreignTransactionFee = formatPercentage(attributes.foreignTransactionFee);
  } else if (attributes.foreignTransactionFee && !features.foreignTransactionFee) {
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
  
  // Limits - handle numeric values (only if not already set from nested limits)
  if (attributes.dailyAtmLimit !== undefined && attributes.dailyAtmLimit !== null && !features.dailyAtmLimit) {
    features.dailyAtmLimit = formatCurrency(attributes.dailyAtmLimit);
  } else if (attributes.dailyAtmLimit && !features.dailyAtmLimit) {
    features.dailyAtmLimit = typeof attributes.dailyAtmLimit === 'string' ? attributes.dailyAtmLimit : String(attributes.dailyAtmLimit);
  }
  
  if (attributes.dailyPurchaseLimit !== undefined && attributes.dailyPurchaseLimit !== null && !features.dailyPurchaseLimit) {
    features.dailyPurchaseLimit = formatCurrency(attributes.dailyPurchaseLimit);
  } else if (attributes.dailyPurchaseLimit && !features.dailyPurchaseLimit) {
    features.dailyPurchaseLimit = typeof attributes.dailyPurchaseLimit === 'string' ? attributes.dailyPurchaseLimit : String(attributes.dailyPurchaseLimit);
  }
  
  if (attributes.contactlessLimit !== undefined && attributes.contactlessLimit !== null && !features.contactlessLimit) {
    features.contactlessLimit = formatCurrency(attributes.contactlessLimit);
  } else if (attributes.contactlessTransactionLimit !== undefined && attributes.contactlessTransactionLimit !== null && !features.contactlessLimit) {
    features.contactlessLimit = formatCurrency(attributes.contactlessTransactionLimit);
  } else if (attributes.contactlessLimit && !features.contactlessLimit) {
    features.contactlessLimit = typeof attributes.contactlessLimit === 'string' ? attributes.contactlessLimit : String(attributes.contactlessLimit);
  }
  
  if (attributes.dailyCardlessWithdrawal !== undefined && attributes.dailyCardlessWithdrawal !== null && !features.dailyCardlessWithdrawal) {
    features.dailyCardlessWithdrawal = formatCurrency(attributes.dailyCardlessWithdrawal);
  } else if (attributes.dailyCardlessWithdrawal && !features.dailyCardlessWithdrawal) {
    features.dailyCardlessWithdrawal = typeof attributes.dailyCardlessWithdrawal === 'string' ? attributes.dailyCardlessWithdrawal : String(attributes.dailyCardlessWithdrawal);
  }
  
  if (attributes.dailyBillPaymentLimit !== undefined && attributes.dailyBillPaymentLimit !== null && !features.dailyBillPaymentLimit) {
    features.dailyBillPaymentLimit = formatCurrency(attributes.dailyBillPaymentLimit);
  } else if (attributes.dailyBillPaymentLimit && !features.dailyBillPaymentLimit) {
    features.dailyBillPaymentLimit = typeof attributes.dailyBillPaymentLimit === 'string' ? attributes.dailyBillPaymentLimit : String(attributes.dailyBillPaymentLimit);
  }
  
  if (attributes.dailyTopupLimit !== undefined && attributes.dailyTopupLimit !== null && !features.dailyTopupLimit) {
    features.dailyTopupLimit = formatCurrency(attributes.dailyTopupLimit);
  } else if (attributes.dailyTopupLimit && !features.dailyTopupLimit) {
    features.dailyTopupLimit = typeof attributes.dailyTopupLimit === 'string' ? attributes.dailyTopupLimit : String(attributes.dailyTopupLimit);
  }
  
  if (attributes.dailyP2pLimit !== undefined && attributes.dailyP2pLimit !== null && !features.dailyP2pLimit) {
    features.dailyP2pLimit = formatCurrency(attributes.dailyP2pLimit);
  } else if (attributes.dailyP2pLimit && !features.dailyP2pLimit) {
    features.dailyP2pLimit = typeof attributes.dailyP2pLimit === 'string' ? attributes.dailyP2pLimit : String(attributes.dailyP2pLimit);
  }
  
  // String-only fields (only if not already set from nested objects)
  if (attributes.hariRayaP2pLimit && !features.hariRayaP2pLimit) {
    features.hariRayaP2pLimit = typeof attributes.hariRayaP2pLimit === 'string' ? attributes.hariRayaP2pLimit : String(attributes.hariRayaP2pLimit);
  }
  if (attributes.hariRayaP2pNote && !features.hariRayaP2pNote) {
    features.hariRayaP2pNote = typeof attributes.hariRayaP2pNote === 'string' ? attributes.hariRayaP2pNote : String(attributes.hariRayaP2pNote);
  }
  if (attributes.minimumTransaction && !features.minimumTransaction) {
    features.minimumTransaction = typeof attributes.minimumTransaction === 'string' ? attributes.minimumTransaction : String(attributes.minimumTransaction);
  }
  if (attributes.accountRequirement && !features.accountRequirement) {
    features.accountRequirement = typeof attributes.accountRequirement === 'string' ? attributes.accountRequirement : String(attributes.accountRequirement);
  }
  if (attributes.prestigeMembership && !features.prestigeMembership) {
    if (typeof attributes.prestigeMembership === 'object') {
      const pm = attributes.prestigeMembership as any;
      if (pm.aum_requirement) {
        features.prestigeMembership = `BND ${pm.aum_requirement.toLocaleString()} AUM`;
      } else {
        features.prestigeMembership = 'Prestige Membership';
      }
    } else {
      features.prestigeMembership = capitalizeElite(attributes.prestigeMembership);
    }
  }
  if (attributes.perdanaMembership && !features.perdanaMembership) {
    if (typeof attributes.perdanaMembership === 'object') {
      const pm = attributes.perdanaMembership as any;
      if (pm.income_requirement) {
        features.perdanaMembership = `BND ${pm.income_requirement.toLocaleString()}/month income`;
      } else if (pm.aum_alternative) {
        features.perdanaMembership = `BND ${pm.aum_alternative.toLocaleString()} AUM`;
      } else {
        features.perdanaMembership = 'PERDANA Membership';
      }
    } else {
      features.perdanaMembership = capitalizeElite(attributes.perdanaMembership);
    }
  }
  if (attributes.mobileWallets && !features.mobileWallets) {
    features.mobileWallets = typeof attributes.mobileWallets === 'string' ? attributes.mobileWallets : String(attributes.mobileWallets);
  }
  if (attributes.premiumBenefits && !features.premiumBenefits) {
    features.premiumBenefits = Array.isArray(attributes.premiumBenefits)
      ? attributes.premiumBenefits
      : [attributes.premiumBenefits];
  }
  if (attributes.travelInsurance && !features.travelInsurance) {
    features.travelInsurance = typeof attributes.travelInsurance === 'string' ? attributes.travelInsurance : String(attributes.travelInsurance);
  }
  if (attributes.loungeAccess && !features.loungeAccess) {
    if (typeof attributes.loungeAccess === 'object') {
      const lounge = attributes.loungeAccess as any;
      if (lounge.network) {
        const fee = lounge.fee_per_visit ? formatCurrency(lounge.fee_per_visit) : '';
        features.loungeAccess = `${lounge.network}${fee ? ` (${fee} per visit)` : ''}`;
      }
    } else {
      features.loungeAccess = typeof attributes.loungeAccess === 'string' ? attributes.loungeAccess : String(attributes.loungeAccess);
    }
  }
  
  // Digital Features (only if not already set from nested features)
  if (attributes.onlineBanking !== undefined && !features.onlineBanking) {
    features.onlineBanking = attributes.onlineBanking ? 'Yes' : 'No';
  }
  if (attributes.mobileApp !== undefined && !features.mobileApp) {
    features.mobileApp = attributes.mobileApp ? 'Yes' : 'No';
  }
  if (attributes.atmAccess !== undefined && !features.atmAccess) {
    features.atmAccess = attributes.atmAccess ? 'Yes' : 'No';
  }
  if (attributes.mobileWalletCompatible && Array.isArray(attributes.mobileWalletCompatible) && !features.mobileWalletCompatible) {
    features.mobileWalletCompatible = attributes.mobileWalletCompatible;
  }

  // Additional flat fields that might exist (only if not already set)
  if (attributes.cardNetwork && !features.cardNetwork) {
    features.cardNetwork = typeof attributes.cardNetwork === 'string' ? attributes.cardNetwork : String(attributes.cardNetwork);
  }
  if (attributes.cardInfo && !features.cardInfo) {
    features.cardInfo = capitalizeElite(attributes.cardInfo);
  }
  if (attributes.contactlessPayment !== undefined && !features.contactlessPayment) {
    features.contactlessPayment = attributes.contactlessPayment;
  }
  if (attributes.globalAcceptance !== undefined && !features.globalAcceptance) {
    features.globalAcceptance = attributes.globalAcceptance;
  }
  if (attributes.atmAccessNetworks && Array.isArray(attributes.atmAccessNetworks) && !features.atmAccessNetworks) {
    features.atmAccessNetworks = attributes.atmAccessNetworks;
  }
  if (attributes.digitalBanking && Array.isArray(attributes.digitalBanking) && !features.digitalBanking) {
    features.digitalBanking = attributes.digitalBanking;
  }
  if (attributes.p2pTransfers && Array.isArray(attributes.p2pTransfers) && !features.p2pTransfers) {
    features.p2pTransfers = attributes.p2pTransfers;
  }
  if (attributes.topupServices && Array.isArray(attributes.topupServices) && !features.topupServices) {
    features.topupServices = attributes.topupServices;
  }
  if (attributes.chipEnabled !== undefined && !features.chipEnabled) {
    features.chipEnabled = attributes.chipEnabled;
  }
  if (attributes.onlineShopping !== undefined && !features.onlineShopping) {
    features.onlineShopping = attributes.onlineShopping;
  }
  if (attributes.rewardsProgram !== undefined && !features.rewardsProgram) {
    features.rewardsProgram = attributes.rewardsProgram;
  }
  if (attributes.rewardsRate && !features.rewards) {
    features.rewards = capitalizeElite(attributes.rewardsRate);
  }
  if (attributes.rewardsNote && !features.rewards) {
    features.rewards = capitalizeElite(attributes.rewardsNote);
  }
  if (attributes.shariahConcept && !features.shariahConcept) {
    features.shariahConcept = typeof attributes.shariahConcept === 'string' ? attributes.shariahConcept : String(attributes.shariahConcept);
  }
  if (attributes.cardFormat && !features.cardFormat) {
    features.cardFormat = typeof attributes.cardFormat === 'string' ? attributes.cardFormat : String(attributes.cardFormat);
  }
  if (attributes.billPayment !== undefined && !features.billPayment) {
    features.billPayment = attributes.billPayment;
  }
  if (attributes.atmCardlessWithdrawal !== undefined && !features.atmCardlessWithdrawal) {
    features.atmCardlessWithdrawal = attributes.atmCardlessWithdrawal;
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
  summary?: ProductComparisonResponse['summary'];
}

export function transformComparisonResponse(
  apiResponse: ProductComparisonResponse
): ProductComparison {
  // Transform products but pass through comparison, highlights, and summary as-is
  // The backend provides these in the exact format we need
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
        // Backend returns product details nested under 'product' object
        // Read from nested product object first, fallback to top-level for backward compatibility
        const productName = product.product?.productName || product.productName;
        const bankName = product.product?.bankName || product.bankName;
        const productType = product.product?.productType || product.productType;
        
        // ADD DEBUG LOGGING HERE
        console.log('[Transform] Transforming product from profile:', {
          productId: product.productId,
          productNameFromNested: product.product?.productName,
          productNameFromTop: product.productName,
          productNameFinal: productName,
          productTypeFromNested: product.product?.productType,
          productTypeFromTop: product.productType,
          productTypeFinal: productType,
          productTypeMapped: mapProductType(productType || 'savings'),
          allProductFields: product,
        });
        
        return {
          id: product.id || product.productId, // Fallback to productId if id is missing
          productId: product.productId,
          productName: productName || 'Product Name Not Available',
          bankName: bankName || 'Bank Name Not Available',
          productType: mapProductType(productType || 'savings'),
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

