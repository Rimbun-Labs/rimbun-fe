// Utility functions for Asset Analyzer components

// Helper functions for score colors
export const getRiskColor = (score: number): string => {
  if (score > 0.7) return 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20';
  if (score > 0.4) return 'text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-900/20';
  return 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20';
};

export const getReturnColor = (score: number): string => {
  if (score > 0.7) return 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20';
  if (score > 0.4) return 'text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-900/20';
  return 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20';
};

export const getCostColor = (score: number): string => {
  if (score > 0.7) return 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20';
  if (score > 0.4) return 'text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-900/20';
  return 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20';
};

export const getOverallColor = (score: number): string => {
  if (score > 0.7) return 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20';
  if (score > 0.4) return 'text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-900/20';
  return 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20';
};

export const getRecommendationColor = (recommendation: string): string => {
  switch (recommendation?.toUpperCase()) {
    case 'BUY': 
      return 'text-green-600 bg-green-50 border-green-200 dark:text-green-200 dark:bg-green-900/20 dark:border-green-800';
    case 'HOLD': 
      return 'text-yellow-600 bg-yellow-50 border-yellow-200 dark:text-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800';
    case 'SELL': 
      return 'text-red-600 bg-red-50 border-red-200 dark:text-red-200 dark:bg-red-900/20 dark:border-red-800';
    default: 
      return 'text-gray-600 bg-gray-50 border-gray-200 dark:text-gray-200 dark:bg-gray-900/20 dark:border-gray-800';
  }
};

// Formatting functions
export const formatMarketCap = (marketCap: number): string => {
  if (marketCap >= 1e12) return `$${(marketCap / 1e12).toFixed(1)}T`;
  if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(1)}B`;
  if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(1)}M`;
  return `$${marketCap.toLocaleString()}`;
};

export const formatPercentage = (value: number): string => {
  const pct = value * 100;
  return `${Number.isInteger(pct) ? pct : parseFloat(pct.toFixed(1))}%`;
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

/** Format number; avoid trailing zeros (use backend precision, max decimals). */
export const formatNumber = (value: number, decimals: number = 2): string => {
  const fixed = value.toFixed(decimals);
  return String(parseFloat(fixed));
};

// Error handling
export const handleApiError = (error: any): string => {
  if (error.message.includes('Asset data not found')) {
    return 'Asset not found. Please try a different symbol.';
  }
  if (error.message.includes('Assessment results not found')) {
    return 'User assessment not found. Please complete your assessment first.';
  }
  if (error.message.includes('Network error')) {
    return 'Network error. Please check your connection.';
  }
  if (error.message.includes('HTTP 404')) {
    return 'Asset not found. Please try a different symbol.';
  }
  if (error.message.includes('HTTP 500')) {
    return 'Server error. Please try again later.';
  }
  return 'An unexpected error occurred. Please try again.';
};

// Score interpretation helpers
export const getRiskLevel = (score: number): string => {
  if (score > 0.7) return 'High Risk';
  if (score > 0.4) return 'Medium Risk';
  return 'Low Risk';
};

export const getReturnLevel = (score: number): string => {
  if (score > 0.7) return 'High Return';
  if (score > 0.4) return 'Medium Return';
  return 'Low Return';
};

export const getCostLevel = (score: number): string => {
  if (score > 0.7) return 'High Cost';
  if (score > 0.4) return 'Medium Cost';
  return 'Low Cost';
};

export const getOverallLevel = (score: number): string => {
  if (score > 0.7) return 'Strong Buy';
  if (score > 0.4) return 'Hold';
  return 'Sell';
};

// Risk level colors
export const getRiskLevelColor = (level: string): string => {
  switch (level) {
    case 'High Risk': return 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20';
    case 'Medium Risk': return 'text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-900/20';
    case 'Low Risk': return 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20';
    default: return 'text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-900/20';
  }
};
