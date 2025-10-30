/**
 * TypeScript types for Bank Analytics Dashboard API
 * Based on Bank Analytics Dashboard - Frontend Integration Guide
 */

/**
 * Main response type from API
 */
export interface BankCustomerInsightsResponse {
  data: BankCustomerInsights;
}

/**
 * Complete customer insights structure
 */
export interface BankCustomerInsights {
  totalCustomers: number;
  riskProfiles: RiskProfileDistribution;
  financialHealth: FinancialHealthMetrics;
  engagement: EngagementMetrics;
  investmentPreferences: InvestmentPreferences;
  customerSegments: CustomerSegments;
  generatedAt: string; // ISO 8601 date string
}

/**
 * Risk Profile Distribution
 */
export interface RiskProfileDistribution {
  conservative: {
    count: number;
    percentage: number;
  };
  moderate: {
    count: number;
    percentage: number;
  };
  aggressive: {
    count: number;
    percentage: number;
  };
  total: number;
}

/**
 * Financial Health Metrics
 */
export interface FinancialHealthMetrics {
  // Emergency Fund Metrics
  averageEmergencyFundRatio: number;
  averageEmergencyFundAdequacy: number; // months covered
  emergencyFundDistribution: {
    insufficient: number; // < 3 months
    adequate: number;     // 3-6 months
    optimal: number;      // > 6 months
  };
  
  // Spending Metrics
  averageMonthlySpending: number;
  medianMonthlySpending: number;
  
  // Savings Rate Metrics
  averageSavingsRate: number; // percentage
  medianSavingsRate: number; // percentage
  savingsRateDistribution: {
    negative: number;
    low: number;      // 0-10%
    moderate: number; // 10-20%
    high: number;     // >20%
  };
  
  // Income Metrics
  incomeMetrics: IncomeMetrics;
  
  // Overall Score (0-100)
  overallHealthScore: number;
}

export interface IncomeMetrics {
  averageMonthlyIncome: number;
  medianMonthlyIncome: number;
  incomeDistribution: {
    low: number;    // < $4,000/month
    medium: number; // $4,000-$10,000/month
    high: number;   // > $10,000/month
  };
}

/**
 * Engagement Metrics
 */
export interface EngagementMetrics {
  totalUsers: number;
  activeUsers: {
    last30Days: number;
    last90Days: number;
  };
  assessmentCompletion: {
    completed: number;
    total: number;
    completionRate: number; // percentage
  };
  chatEngagement: {
    usersWhoChatted: number;
    averageMessagesPerUser: number;
    totalChatSessions: number;
  };
  sessionActivity: {
    averageSessionsPerUser: number;
    averageSessionDuration: number; // minutes
    totalSessions: number;
  };
}

/**
 * Investment Preferences
 */
export interface InvestmentPreferences {
  preferredAssetClasses: {
    equities: AssetClassMetrics;
    bonds: AssetClassMetrics;
    realEstate: AssetClassMetrics;
    cash: AssetClassMetrics;
  };
  timeHorizonPreferences: {
    shortTerm: number;  // < 5 years
    mediumTerm: number; // 5-15 years
    longTerm: number;   // > 15 years
  };
}

export interface AssetClassMetrics {
  average: number; // percentage
  median: number;  // percentage
  distribution: {
    low: number;    // 0-25%
    medium: number; // 25-50%
    high: number;   // >50%
  };
}

/**
 * Customer Segmentation
 */
export interface CustomerSegments {
  byAge: {
    genZ: number;
    millennials: number;
    genX: number;
    boomers: number;
  };
  byIncome: {
    low: number;
    medium: number;
    high: number;
  };
  byRiskProfile: RiskProfileDistribution;
  byFinancialHealth: {
    healthy: number;
    moderate: number;
    atRisk: number;
  };
}

/**
 * Permission Check Response
 */
export interface BankPermissionResponse {
  hasPermission: boolean;
  role: string;
}

