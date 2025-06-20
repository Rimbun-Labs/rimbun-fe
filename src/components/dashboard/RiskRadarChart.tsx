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
import { useTheme } from '@/hooks/useTheme';

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
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  
  const colors = {
    grid: isDarkMode ? '#475569' : '#e5e7eb',
    text: isDarkMode ? '#f1f5f9' : '#64748b',
    primary: '#4f46e5', // Indigo that works in both modes
    confidence: 'rgba(79, 70, 229, 0.4)', // Semi-transparent indigo
  };

  return (
    <ResponsiveContainer>
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
        <PolarGrid stroke={colors.grid} />
        <PolarAngleAxis 
          dataKey="attribute" 
          tick={{ fill: colors.text, fontSize: 12 }} 
        />
        <Radar
          name="Your Profile"
          dataKey="value"
          stroke={colors.primary}
          fill={colors.primary}
          fillOpacity={0.6}
          animationDuration={1000}
          animationEasing="ease-in-out"
        />
        {showConfidence && (
          <Radar
            name="Confidence Range"
            dataKey="value"
            stroke={colors.confidence}
            fill={colors.confidence}
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
