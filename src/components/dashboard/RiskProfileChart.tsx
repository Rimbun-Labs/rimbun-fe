
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
  // Transform the data for the radar chart
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

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Risk Profile Analysis</CardTitle>
        <CardDescription>
          Your investment profile scores across five key dimensions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis dataKey="attribute" tick={{ fill: "#64748b", fontSize: 12 }} />
              <Radar
                name="Your Profile"
                dataKey="value"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.6}
                animationDuration={1000}
                animationEasing="ease-in-out"
              />
              <Tooltip 
                formatter={(value: number) => [value.toFixed(1), "Score"]} 
                labelFormatter={(label) => `${label}`}
                contentStyle={{ background: 'rgba(255, 255, 255, 0.9)', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}
              />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>

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
      </CardContent>
    </Card>
  );
};

export default RiskProfileChart;
