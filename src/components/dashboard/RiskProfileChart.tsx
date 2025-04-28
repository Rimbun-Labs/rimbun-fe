
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from '@/components/ui/chart';
import { transformRiskProfileData } from '@/utils/chartUtils';
import RiskRadarChart from './RiskRadarChart';
import ConfidenceBadge from './ConfidenceBadge';

interface RiskProfileChartProps {
  data: {
    riskProfile: number;
    knowledgeLevel: number;
    leverageAptitude: number;
    decisionStyleScore: number;
    personalityScore: number;
  };
  confidenceMetrics?: {
    riskProfileConfidence: number;
    knowledgeLevelConfidence: number;
    leverageAptitudeConfidence: number;
    decisionStyleConfidence: number;
    personalityConfidence: number;
  };
}

const RiskProfileChart: React.FC<RiskProfileChartProps> = ({ data, confidenceMetrics }) => {
  const chartData = transformRiskProfileData(data, confidenceMetrics);
  
  const chartConfig = {
    profile: { color: "#8884d8" },
    confidence: { color: "rgba(136, 132, 216, 0.2)" },
  };

  return (
    <ChartContainer 
      config={chartConfig} 
      className="w-full h-full"
    >
      <>
        <RiskRadarChart 
          data={chartData} 
          showConfidence={!!confidenceMetrics} 
        />

        {confidenceMetrics && (
          <div className="mt-4 space-y-2">
            <h4 className="font-medium text-sm">Confidence Analysis</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {chartData.map((item) => (
                <div key={item.attribute} className="flex items-center text-sm">
                  <span>{item.attribute}</span>
                  <ConfidenceBadge confidence={item.confidence} />
                </div>
              ))}
            </div>
          </div>
        )}
      </>
    </ChartContainer>
  );
};

export default RiskProfileChart;
