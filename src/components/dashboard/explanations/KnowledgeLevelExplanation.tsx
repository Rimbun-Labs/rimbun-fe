import React from 'react';
import { ExplanationProps } from './types';
import { BaseExplanation } from './BaseExplanation';
import { getKnowledgeLevelExplanation } from './utils';

export const KnowledgeLevelExplanation: React.FC<ExplanationProps> = ({
  score,
  className
}) => {
  const explanation = getKnowledgeLevelExplanation(score);
  return <BaseExplanation explanation={explanation} className={className} />;
}; 