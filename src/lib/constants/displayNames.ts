import { AssetClass, MetricCategory } from '@/lib/api/types/metrics';

export const metricDisplayNames: Record<string, string> = {
  // Growth Metrics
  historicalReturn: "Historical Return",
  growthRate: "Growth Rate",
  appreciation: "Appreciation",
  
  // Risk Metrics
  volatility: "Volatility",
  beta: "Beta",
  sharpeRatio: "Sharpe Ratio",
  defaultRisk: "Default Risk",
  
  // Income Metrics
  dividendYield: "Dividend Yield",
  rentalIncome: "Rental Income",
  couponRate: "Coupon Rate",
  
  // Valuation Metrics
  peRatio: "Price-to-Earnings Ratio (P/E)",
  capRate: "Capitalization Rate (Cap Rate)",
  loanToValue: "Loan-to-Value Ratio (LTV)",
  
  // Return Metrics
  ytm: "Yield to Maturity (YTM)",
  interestRate: "Interest Rate",
  
  // Cost Metrics
  expenseRatio: "Expense Ratio",
  debtService: "Debt Service",
  
  // Liquidity Metrics
  liquidity: "Liquidity",
  etfLiquidity: "ETF Liquidity"
};

export const assetClassDisplayNames: Record<AssetClass, string> = {
  EQUITIES: "Equities",
  BONDS: "Bonds",
  REAL_ESTATE: "Real Estate",
  CASH: "Cash"
};

export const categoryDisplayNames: Record<MetricCategory, string> = {
  Growth: "Growth",
  Risk: "Risk",
  Income: "Income",
  Valuation: "Valuation",
  Return: "Return",
  Cost: "Cost",
  "ETF Liquidity": "ETF Liquidity",
  Liquidity: "Liquidity",
  Performance: "Performance"
};

// Helper function to get display name for a metric
export const getMetricDisplayName = (metric: string): string => {
  const displayNames: Record<string, string> = {
    'historicalReturn': 'Historical Return',
    'volatility': 'Volatility',
    'creditRating': 'Credit Rating',
    'duration': 'Duration',
    'dividendYield': 'Dividend Yield',
    'peRatio': 'P/E Ratio',
    'marketCap': 'Market Cap',
    'beta': 'Beta',
    'sharpeRatio': 'Sharpe Ratio',
    'sortinoRatio': 'Sortino Ratio',
    'maxDrawdown': 'Maximum Drawdown',
    'liquidity': 'Liquidity',
    'expenseRatio': 'Expense Ratio',
    'trackingError': 'Tracking Error',
    'correlation': 'Correlation',
    'momentum': 'Momentum',
    'rsi': 'RSI',
    'macd': 'MACD',
    'movingAverage': 'Moving Average',
    'volume': 'Volume'
  };

  return displayNames[metric] || metric;
};

// Helper function to get display name for an asset class
export const getAssetClassDisplayName = (assetClass: AssetClass): string => {
  switch (assetClass) {
    case 'equities':
      return 'Equities';
    case 'bonds':
      return 'Bonds';
    case 'realEstate':
      return 'Real Estate';
    case 'cash':
      return 'Cash';
    default:
      return assetClass;
  }
};

// Helper function to get display name for a category
export const getCategoryDisplayName = (category: MetricCategory): string => {
  switch (category) {
    case 'Growth':
      return 'Growth';
    case 'Value':
      return 'Value';
    case 'Income':
      return 'Income';
    case 'Risk':
      return 'Risk';
    case 'Technical':
      return 'Technical';
    default:
      return category;
  }
};

/** Shared risk profile label (used in Investment Explorer, Dashboard, etc.) */
export const getRiskProfileLabel = (score?: number): string => {
  if (score == null) return 'N/A';
  if (score >= 80) return 'Aggressive';
  if (score >= 60) return 'Growth-Oriented';
  if (score >= 40) return 'Balanced';
  if (score >= 20) return 'Conservative';
  return 'Very Conservative';
}; 