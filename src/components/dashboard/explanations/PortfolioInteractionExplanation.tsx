import { BaseExplanation } from './BaseExplanation';
import { getPortfolioInteractionExplanation } from './utils';
import { PortfolioStrategyProps } from './types';

export const PortfolioInteractionExplanation = ({
  riskAdjustedVolatility,
  riskProfile,
  className
}: PortfolioStrategyProps) => {
  const explanation = getPortfolioInteractionExplanation(riskAdjustedVolatility, riskProfile);
  return <BaseExplanation explanation={explanation} className={className} />;
}; 