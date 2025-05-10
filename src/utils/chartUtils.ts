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
  // Keep values in 0-100 range for better precision
  const getConfidenceValue = (metric: string): number | null => {
    if (!confidenceMetrics) return null;
    const confidenceKey = `${metric}Confidence` as keyof typeof confidenceMetrics;
    const confidence = confidenceMetrics[confidenceKey];
    if (confidence === undefined) return null;
    // Convert confidence to percentage (0-100)
    return Math.round(confidence * 100);
  };

  return [
    { 
      attribute: "Risk Profile",
      value: data.riskProfile,
      confidence: getConfidenceValue('riskProfile'),
      fullMark: 100,
    },
    { 
      attribute: "Knowledge",
      value: data.knowledgeLevel,
      confidence: getConfidenceValue('knowledgeLevel'),
      fullMark: 100,
    },
    { 
      attribute: "Leverage",
      value: data.leverageAptitude,
      confidence: getConfidenceValue('leverageAptitude'),
      fullMark: 100,
    },
    { 
      attribute: "Decision Style",
      value: data.decisionStyleScore,
      confidence: getConfidenceValue('decisionStyle'),
      fullMark: 100,
    },
    { 
      attribute: "Personality",
      value: data.personalityScore,
      confidence: getConfidenceValue('personality'),
      fullMark: 100,
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
