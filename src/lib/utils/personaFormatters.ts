/**
 * Formatting utilities for persona display
 */

/**
 * Format product type for display
 * Maps backend product types to properly capitalized display names
 */
export const formatProductType = (productType: string): string => {
  const typeMap: Record<string, string> = {
    // Standard mappings
    'savings_account': 'Savings Account',
    'savings': 'Savings Account',
    'checking_account': 'Checking Account',
    'checking': 'Checking Account',
    'fixed_deposit': 'Fixed Deposit',
    'cd': 'Fixed Deposit',
    'credit_card': 'Credit Card',
    'debit_card': 'Debit Card',
    'virtual_prepaid_card': 'Virtual Prepaid Card',
    'money_market': 'Money Market Account',
    'loan': 'Loan',
  };

  // Check if exact match exists
  if (typeMap[productType.toLowerCase()]) {
    return typeMap[productType.toLowerCase()];
  }

  // Fallback: title case the product type
  return productType
    .split(/[\s_-]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

/**
 * Format product name for display
 * Ensures proper capitalization, especially for terms like "Elite", "Premium", etc.
 */
export const formatProductName = (productName: string): string => {
  if (!productName) return productName;

  // Special terms that should always be capitalized
  const specialTerms: Record<string, string> = {
    'elite': 'Elite',
    'premium': 'Premium',
    'platinum': 'Platinum',
    'gold': 'Gold',
    'silver': 'Silver',
    'savings': 'Savings',
    'account': 'Account',
    'deposit': 'Deposit',
    'card': 'Card',
  };

  // Split by common separators and capitalize
  const words = productName.split(/[\s-]+/);
  const formatted = words.map(word => {
    const lowerWord = word.toLowerCase();
    // Check if it's a special term
    if (specialTerms[lowerWord]) {
      return specialTerms[lowerWord];
    }
    // Otherwise, capitalize first letter
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });

  return formatted.join(' ');
};

/**
 * Format bank name for display
 * Ensures proper capitalization
 */
export const formatBankName = (bankName: string): string => {
  if (!bankName) return bankName;

  // Common bank acronyms that should be all caps
  const acronyms = ['BIBD', 'BAIDURI', 'TAIB', 'RHB', 'UOB', 'SCB', 'HSBC', 'CIMB', 'AMBD'];
  
  const upperBankName = bankName.toUpperCase();
  if (acronyms.includes(upperBankName)) {
    return upperBankName;
  }

  // Otherwise, title case
  return bankName
    .split(/[\s-]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

/**
 * Format goal type for display
 */
export const formatGoalType = (goalType: string): string => {
  if (!goalType) return goalType;

  // Common goal type mappings
  const typeMap: Record<string, string> = {
    'short-term': 'Short-term',
    'shortterm': 'Short-term',
    'long-term': 'Long-term',
    'longterm': 'Long-term',
    'emergency_fund': 'Emergency Fund',
    'emergency fund': 'Emergency Fund',
    'retirement': 'Retirement',
    'education': 'Education',
    'house': 'House',
    'car': 'Car',
    'vacation': 'Vacation',
  };

  const lowerType = goalType.toLowerCase();
  if (typeMap[lowerType]) {
    return typeMap[lowerType];
  }

  // Fallback: title case
  return goalType
    .split(/[\s_-]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

/**
 * Format educational content type for display
 */
export const formatContentType = (contentType: string): string => {
  if (!contentType) return contentType;

  const typeMap: Record<string, string> = {
    'article': 'Article',
    'video': 'Video',
    'course': 'Course',
    'tutorial': 'Tutorial',
    'guide': 'Guide',
    'ebook': 'eBook',
    'webinar': 'Webinar',
    'podcast': 'Podcast',
  };

  const lowerType = contentType.toLowerCase();
  if (typeMap[lowerType]) {
    return typeMap[lowerType];
  }

  // Fallback: capitalize first letter
  return contentType.charAt(0).toUpperCase() + contentType.slice(1).toLowerCase();
};

/**
 * Get priority label from numeric priority (1-5)
 * 1 = Highest priority, 5 = Lowest priority
 */
export const getPriorityLabel = (priority: number): string => {
  switch (priority) {
    case 1:
      return 'Highest';
    case 2:
      return 'High';
    case 3:
      return 'Medium';
    case 4:
      return 'Low';
    case 5:
      return 'Lowest';
    default:
      return 'Medium';
  }
};

/**
 * Get priority variant for Badge component
 */
export const getPriorityVariant = (priority: number): 'default' | 'secondary' | 'outline' => {
  switch (priority) {
    case 1:
    case 2:
      return 'default'; // High priority - use primary color
    case 3:
      return 'secondary'; // Medium priority
    default:
      return 'outline'; // Low priority
  }
};

/**
 * Format family status for display
 */
export const formatFamilyStatus = (status: string): string => {
  const map: Record<string, string> = {
    single: 'Single',
    married: 'Married',
    married_with_children: 'Married with Children',
    living_with_parents: 'Living with Parents',
    divorced: 'Divorced',
    widowed: 'Widowed',
  };
  return map[status] || status;
};

/**
 * Format living situation for display
 */
export const formatLivingSituation = (situation: string): string => {
  const map: Record<string, string> = {
    renting: 'Renting',
    owns_home: 'Owns Home',
    living_with_family: 'Living with Family',
    student_housing: 'Student Housing',
    mortgage: 'Mortgage',
  };
  return map[situation] || situation;
};

/**
 * Format education level for display
 */
export const formatEducationLevel = (level: string): string => {
  const map: Record<string, string> = {
    high_school: "High School",
    diploma: 'Diploma',
    bachelor: "Bachelor's Degree",
    postgraduate: 'Postgraduate Degree',
    professional_certification: 'Professional Certification',
  };
  return map[level] || level;
};

/**
 * Format life stage for display
 */
export const formatLifeStage = (stage: string): string => {
  const map: Record<string, string> = {
    student: 'Student',
    early_career: 'Early Career',
    mid_career: 'Mid Career',
    senior: 'Senior',
    retired: 'Retired',
  };
  return map[stage] || stage;
};

/**
 * Format career stage for display
 */
export const formatCareerStage = (stage: string): string => {
  const map: Record<string, string> = {
    entry: 'Entry Level',
    mid: 'Mid Level',
    senior: 'Senior Level',
    executive: 'Executive',
    entrepreneur: 'Entrepreneur',
    retired: 'Retired',
  };
  return map[stage] || stage;
};

/**
 * Format lifestyle type for display
 */
export const formatLifestyleType = (type: string): string => {
  const map: Record<string, string> = {
    minimalist: 'Minimalist',
    moderate: 'Moderate',
    active: 'Active',
    luxury: 'Luxury',
    balanced: 'Balanced',
  };
  return map[type] || type;
};

