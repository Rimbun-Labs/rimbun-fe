import React from 'react';
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  Radar, 
  Tooltip,
  Legend
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { 
  ChartContainer, 
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';

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
  const chartData = [
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

  const getConfidenceBadge = (confidence: number | null | undefined) => {
    if (confidence === null || confidence === undefined) return null;
    
    let color = "bg-gray-200 text-gray-800";
    if (confidence >= 0.8) color = "bg-green-100 text-green-800";
    else if (confidence >= 0.6) color = "bg-blue-100 text-blue-800";
    else if (confidence >= 0.4) color = "bg-yellow-100 text-yellow-800";
    else color = "bg-red-100 text-red-800";

    return (
      <Badge variant="outline" className={cn("ml-2 text-xs font-normal", color)}>
        {Math.round(confidence * 100)}% confidence
      </Badge>
    );
  };

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
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis 
            dataKey="attribute" 
            tick={{ fill: "#64748b", fontSize: 12 }} 
          />
          <Radar
            name="Your Profile"
            dataKey="value"
            stroke="#8884d8"
            fill="#8884d8"
            fillOpacity={0.6}
            animationDuration={1000}
            animationEasing="ease-in-out"
          />
          {confidenceMetrics && (
            <Radar
              name="Confidence Range"
              dataKey="value"
              stroke="rgba(136, 132, 216, 0.4)"
              fill="rgba(136, 132, 216, 0.2)"
              fillOpacity={0.3}
              strokeDasharray="5 5"
              animationDuration={1000}
              animationBegin={500}
              animationEasing="ease-in-out"
            />
          )}
          <ChartTooltip content={<ChartTooltipContent />} />
          <Legend />
        </RadarChart>

        {confidenceMetrics && (
          <div className="mt-4 space-y-2">
            <h4 className="font-medium text-sm">Confidence Analysis</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {chartData.map((item) => (
                <div key={item.attribute} className="flex items-center text-sm">
                  <span>{item.attribute}</span>
                  {getConfidenceBadge(item.confidence)}
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
