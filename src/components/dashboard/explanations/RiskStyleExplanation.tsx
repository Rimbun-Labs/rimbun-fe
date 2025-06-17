import React from 'react';
import { ExplanationProps } from './types';
import { BaseExplanation } from './BaseExplanation';
import { getRiskStyleExplanation } from './utils';

export const RiskStyleExplanation: React.FC<ExplanationProps> = ({
  score,
  className
}) => {
  const explanation = getRiskStyleExplanation(score);
  return <BaseExplanation explanation={explanation} className={className} />;
}; 