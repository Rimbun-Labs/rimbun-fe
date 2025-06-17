import React from 'react';
import { ExplanationProps } from './types';
import { BaseExplanation } from './BaseExplanation';
import { getDecisionStyleExplanation } from './utils';

export const DecisionStyleExplanation: React.FC<ExplanationProps> = ({
  score,
  className
}) => {
  const explanation = getDecisionStyleExplanation(score);
  return <BaseExplanation explanation={explanation} className={className} />;
}; 