
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
import { ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface RiskRadarChartProps {
  data: Array<{
    attribute: string;
    value: number;
    confidence: number | null;
    fullMark: number;
  }>;
  showConfidence?: boolean;
}

const RiskRadarChart: React.FC<RiskRadarChartProps> = ({ data, showConfidence }) => {
  return (
    <ResponsiveContainer>
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
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
        {showConfidence && (
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
    </ResponsiveContainer>
  );
};

export default RiskRadarChart;
