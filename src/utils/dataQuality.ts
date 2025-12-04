import { SpendingPeriodDto } from '@/lib/api/spendingApi';

export type DataQualityLevel = 'high' | 'medium' | 'low';

export interface DataQualityMetrics {
  completeness: number; // 0-100: percentage of expected months with data
  consistency: number; // 0-100: how consistent the data is (variance)
  timeliness: number; // 0-100: how recent the data is
  overallScore: number; // 0-100: weighted average
  level: DataQualityLevel;
  monthsAvailable: number;
  monthsExpected: number;
  missingMonths: Array<{ year: number; month: number }>;
  lastUpdated: Date | null;
  recommendations: string[];
}

/**
 * Calculate expected months based on current date and lookback period
 */
function getExpectedMonths(lookbackMonths: number = 3): Array<{ year: number; month: number }> {
  const expected: Array<{ year: number; month: number }> = [];
  const now = new Date();
  
  for (let i = 0; i < lookbackMonths; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    expected.push({
      year: date.getFullYear(),
      month: date.getMonth() + 1, // 1-12
    });
  }
  
  return expected.reverse(); // Oldest to newest
}

/**
 * Find missing months by comparing expected vs available periods
 */
function findMissingMonths(
  expected: Array<{ year: number; month: number }>,
  periods: SpendingPeriodDto[]
): Array<{ year: number; month: number }> {
  const available = new Set(
    periods.map(p => `${p.periodYear}-${p.periodMonth}`)
  );
  
  return expected.filter(
    exp => !available.has(`${exp.year}-${exp.month}`)
  );
}

/**
 * Calculate data consistency (variance in spending amounts)
 * Lower variance = higher consistency score
 */
function calculateConsistency(periods: SpendingPeriodDto[]): number {
  if (periods.length < 2) return 50; // Can't calculate variance with < 2 points
  
  const amounts = periods.map(p => p.monthlySpending);
  const mean = amounts.reduce((sum, val) => sum + val, 0) / amounts.length;
  const variance = amounts.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / amounts.length;
  const stdDev = Math.sqrt(variance);
  const coefficientOfVariation = mean > 0 ? stdDev / mean : 0;
  
  // Convert to 0-100 score (lower CV = higher score)
  // CV of 0 = 100, CV of 1 = 0, CV > 1 = 0
  const consistencyScore = Math.max(0, Math.min(100, (1 - coefficientOfVariation) * 100));
  
  return consistencyScore;
}

/**
 * Calculate timeliness (how recent is the data)
 */
function calculateTimeliness(periods: SpendingPeriodDto[]): number {
  if (periods.length === 0) return 0;
  
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();
  
  // Find most recent period
  const mostRecent = periods.reduce((latest, period) => {
    const periodDate = new Date(period.periodYear, period.periodMonth - 1);
    const latestDate = new Date(latest.periodYear, latest.periodMonth - 1);
    return periodDate > latestDate ? period : latest;
  });
  
  // Calculate months since most recent data
  const monthsAgo = (currentYear - mostRecent.periodYear) * 12 + 
                    (currentMonth - mostRecent.periodMonth);
  
  // Score: 0 months = 100, 1 month = 80, 2 months = 60, 3+ months = 40
  if (monthsAgo === 0) return 100;
  if (monthsAgo === 1) return 80;
  if (monthsAgo === 2) return 60;
  if (monthsAgo === 3) return 40;
  return Math.max(0, 40 - (monthsAgo - 3) * 10);
}

/**
 * Generate recommendations based on data quality metrics
 */
function generateRecommendations(metrics: Omit<DataQualityMetrics, 'recommendations'>): string[] {
  const recommendations: string[] = [];
  
  if (metrics.completeness < 70) {
    const missing = metrics.missingMonths.length;
    if (missing === 1) {
      recommendations.push(`Add 1 more month of data for better accuracy`);
    } else {
      recommendations.push(`Add ${missing} more months of data for better accuracy`);
    }
  }
  
  if (metrics.consistency < 50) {
    recommendations.push('Your spending varies significantly. Consider using average spending for projections.');
  }
  
  if (metrics.timeliness < 60) {
    recommendations.push('Update your spending data for the most recent month');
  }
  
  if (metrics.monthsAvailable < 3) {
    recommendations.push('Enter at least 3 months of data for accurate projections');
  }
  
  return recommendations;
}

/**
 * Calculate data quality metrics from spending history
 * 
 * @param periods - Array of spending periods
 * @param lookbackMonths - Number of months to look back (default: 3)
 */
export function calculateDataQuality(
  periods: SpendingPeriodDto[],
  lookbackMonths: number = 3
): DataQualityMetrics {
  const expected = getExpectedMonths(lookbackMonths);
  const monthsAvailable = periods.length;
  const monthsExpected = expected.length;
  const missingMonths = findMissingMonths(expected, periods);
  
  // Calculate completeness (percentage of expected months with data)
  const completeness = monthsExpected > 0 
    ? (monthsAvailable / monthsExpected) * 100 
    : 0;
  
  // Calculate consistency (variance in spending)
  const consistency = calculateConsistency(periods);
  
  // Calculate timeliness (how recent is the data)
  const timeliness = calculateTimeliness(periods);
  
  // Calculate overall score (weighted average)
  // Completeness: 50%, Consistency: 30%, Timeliness: 20%
  const overallScore = 
    (completeness * 0.5) + 
    (consistency * 0.3) + 
    (timeliness * 0.2);
  
  // Determine quality level
  let level: DataQualityLevel;
  if (overallScore >= 80) {
    level = 'high';
  } else if (overallScore >= 50) {
    level = 'medium';
  } else {
    level = 'low';
  }
  
  // Get last updated date
  const lastUpdated = periods.length > 0
    ? new Date(periods[periods.length - 1].updatedAt || periods[periods.length - 1].createdAt)
    : null;
  
  const metrics: Omit<DataQualityMetrics, 'recommendations'> = {
    completeness,
    consistency,
    timeliness,
    overallScore,
    level,
    monthsAvailable,
    monthsExpected,
    missingMonths,
    lastUpdated,
  };
  
  const recommendations = generateRecommendations(metrics);
  
  return {
    ...metrics,
    recommendations,
  };
}

/**
 * Get quality level color
 */
export function getQualityColor(level: DataQualityLevel): string {
  switch (level) {
    case 'high':
      return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
    case 'medium':
      return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400';
    case 'low':
      return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400';
  }
}

/**
 * Get quality level label
 */
export function getQualityLabel(level: DataQualityLevel): string {
  switch (level) {
    case 'high':
      return 'High Quality';
    case 'medium':
      return 'Medium Quality';
    case 'low':
      return 'Low Quality';
  }
}

