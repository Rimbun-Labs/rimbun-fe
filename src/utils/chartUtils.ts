interface ChartDataPoint {
  attribute: string;
  value: number;
  confidence: number | null;
  fullMark: number;
}

export const transformRiskProfileData = (data: {
  riskProfile: number;
  knowledgeLevel: number;
  leverageAptitude: number;
  decisionStyleScore: number;
  personalityScore: number;
}, confidenceMetrics?: {
  riskProfileConfidence: number;
  knowledgeLevelConfidence: number;
  leverageAptitudeConfidence: number;
  decisionStyleConfidence: number;
  personalityConfidence: number;
}): ChartDataPoint[] => {
  // Normalize values from 0-100 to 0-10 scale
  const normalizeValue = (value: number): number => {
    return Math.round((value / 100) * 10);
  };

  const getConfidenceValue = (metric: string): number | null => {
    if (!confidenceMetrics) return null;
    const confidenceKey = `${metric}Confidence` as keyof typeof confidenceMetrics;
    const confidence = confidenceMetrics[confidenceKey];
    if (confidence === undefined) return null;
    // Scale confidence to match the value range (0-10)
    return Math.round(confidence * 10);
  };

  return [
    { 
      attribute: "Risk Profile",
      value: normalizeValue(data.riskProfile),
      confidence: getConfidenceValue('riskProfile'),
      fullMark: 10,
    },
    { 
      attribute: "Knowledge",
      value: normalizeValue(data.knowledgeLevel),
      confidence: getConfidenceValue('knowledgeLevel'),
      fullMark: 10,
    },
    { 
      attribute: "Leverage",
      value: normalizeValue(data.leverageAptitude),
      confidence: getConfidenceValue('leverageAptitude'),
      fullMark: 10,
    },
    { 
      attribute: "Decision Style",
      value: normalizeValue(data.decisionStyleScore),
      confidence: getConfidenceValue('decisionStyle'),
      fullMark: 10,
    },
    { 
      attribute: "Personality",
      value: normalizeValue(data.personalityScore),
      confidence: getConfidenceValue('personality'),
      fullMark: 10,
    },
  ];
};

export const getConfidenceColor = (confidence: number): string => {
  if (confidence >= 0.8) return "bg-green-100 text-green-800";
  if (confidence >= 0.6) return "bg-blue-100 text-blue-800";
  if (confidence >= 0.4) return "bg-yellow-100 text-yellow-800";
  return "bg-red-100 text-red-800";
};

export const formatConfidence = (confidence: number): string => {
  return `${Math.round(confidence * 100)}%`;
};
