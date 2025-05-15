export type MetricCategory = 
  | 'Growth'
  | 'Risk'
  | 'Income'
  | 'Valuation'
  | 'Return'
  | 'Cost'
  | 'ETF Liquidity'
  | 'Liquidity'
  | 'Performance';

export type MetricPriority = 'Primary' | 'Secondary' | 'Tertiary';

export type AssetClass = 'EQUITIES' | 'BONDS' | 'REAL_ESTATE' | 'CASH';

export interface RecommendedMetric {
  name: string;
  category: MetricCategory;
  weight: number;
  priority: MetricPriority;
}

export interface RecommendedMetricsWithWeights {
  [AssetClass.EQUITIES]?: Record<string, RecommendedMetric>;
  [AssetClass.BONDS]?: Record<string, RecommendedMetric>;
  [AssetClass.REAL_ESTATE]?: Record<string, RecommendedMetric>;
  [AssetClass.CASH]?: Record<string, RecommendedMetric>;
} 