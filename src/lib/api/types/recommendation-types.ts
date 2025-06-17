export interface InvestmentScenario {
  name: string;
  baseAmount: number;
  monthlyContribution: number;
  projectedAmount: number;
  timeToGoal: number;
  isRealistic: boolean;
  requiredMonthlySavings?: number;
  currentSavingsRate?: number;
}

export interface GoalGapInsights {
  currentGap: number;
  requiredMonthlySavings: number;
  currentSavingsRate: number;
  timeAnalysis: {
    actualYears: number;
    investmentHorizon: number;
    isRealistic: boolean;
    suggestedAdjustments?: {
      targetAmount?: number;
      monthlySavings?: number;
    };
  };
  goalAchievabilityScore: number;
  recommendations: {
    primaryAction: 'increase_savings' | 'adjust_strategy' | 'extend_timeline' | 'on_track';
    message: string;
    suggestedMonthlySavings?: number;
    suggestedStrategy?: 'more_aggressive' | 'more_conservative' | 'maintain';
  };
  investmentScenarios?: {
    conservative: InvestmentScenario;
    aggressive: InvestmentScenario;
  };
} 