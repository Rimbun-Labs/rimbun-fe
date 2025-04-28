
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
  return [
    { 
      attribute: "Risk Tolerance",
      value: data.riskProfile,
      confidence: confidenceMetrics?.riskProfileConfidence || null,
      fullMark: 10,
    },
    { 
      attribute: "Knowledge",
      value: data.knowledgeLevel,
      confidence: confidenceMetrics?.knowledgeLevelConfidence || null,
      fullMark: 10,
    },
    { 
      attribute: "Leverage",
      value: data.leverageAptitude,
      confidence: confidenceMetrics?.leverageAptitudeConfidence || null,
      fullMark: 10,
    },
    { 
      attribute: "Decision",
      value: data.decisionStyleScore,
      confidence: confidenceMetrics?.decisionStyleConfidence || null,
      fullMark: 10,
    },
    { 
      attribute: "Personality",
      value: data.personalityScore,
      confidence: confidenceMetrics?.personalityConfidence || null,
      fullMark: 10,
    },
  ];
};
