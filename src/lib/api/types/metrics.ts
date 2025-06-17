import { MetricExplanation } from './metricContent';

/**
 * Categories for investment metrics:
 * - Growth: Metrics related to growth potential and historical growth
 * - Value: Metrics used for valuation and price assessment
 * - Income: Metrics related to income generation and yield
 * - Risk: Metrics measuring risk and volatility
 * - Technical: Technical analysis indicators
 * - Valuation: Metrics used for asset valuation
 * - Return: Metrics measuring returns and performance
 * - Cost: Metrics related to costs and expenses
 * - ETF Liquidity: Metrics specific to ETF trading and liquidity
 * - Liquidity: General liquidity metrics
 * - Performance: Overall performance metrics
 */
export type MetricCategory = 
  | 'Growth' 
  | 'Value' 
  | 'Income' 
  | 'Risk' 
  | 'Technical'
  | 'Valuation'
  | 'Return'
  | 'Cost'
  | 'ETF Liquidity'
  | 'Liquidity'
  | 'Performance';

export type MetricPriority = 'Primary' | 'Secondary' | 'Tertiary';

export type AssetClass = 'equities' | 'bonds' | 'realEstate' | 'cash';

export interface RecommendedMetric {
  name: string;
  category: MetricCategory;
  weight: number;
  priority?: MetricPriority;
  description: string;
  content?: MetricExplanation;
}

export interface RecommendedMetricsWithWeights {
  [assetClass: string]: {
    [metricName: string]: {
      weight: number;
      description: string;
    }
  }
} 