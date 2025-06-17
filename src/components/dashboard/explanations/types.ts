export interface ExplanationData {
  title: string;
  description: string;
  keyPoints: string[];
}

export interface ExplanationProps {
  score: number;
  className?: string;
}

export interface MetricExplanation {
  getExplanation: (score: number) => ExplanationData;
}

// Asset Allocation Types
export interface AssetAllocationData extends ExplanationData {
  allocation: number;
  riskProfile: number;
  typicalUse: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  timeHorizon: 'Short' | 'Medium' | 'Long';
  marketConditions: {
    good: string;
    bad: string;
  };
  riskContext: string;
}

export interface AssetAllocationProps {
  allocation: number;
  riskProfile: number;
  className?: string;
}

// Portfolio Strategy Types
export interface PortfolioStrategyData extends ExplanationData {
  diversificationScore: number;
  riskProfile: number;
  riskAdjustedVolatility: number;
  marketConditions: {
    good: string;
    bad: string;
  };
}

export interface PortfolioStrategyProps {
  diversificationScore: number;
  riskProfile: number;
  riskAdjustedVolatility: number;
  className?: string;
} 