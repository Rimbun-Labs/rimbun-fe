import { BaseExplanation } from './BaseExplanation';
import { getAllocationStrategyExplanation } from './utils';
import { PortfolioStrategyProps } from './types';

export const AllocationStrategyExplanation = ({
  diversificationScore,
  riskProfile,
  className
}: PortfolioStrategyProps) => {
  const explanation = getAllocationStrategyExplanation(diversificationScore, riskProfile);
  return <BaseExplanation explanation={explanation} className={className} />;
}; 