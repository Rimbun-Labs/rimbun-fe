import React, { useState, useEffect, useMemo } from 'react';
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
import { transformRiskProfileData } from '@/utils/chartUtils';
import { Badge } from "@/components/ui/badge";
import { motion } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';
import { ComponentErrorBoundary } from '@/components/error/ComponentErrorBoundary';

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
  /** When true, axis ticks show the score value (e.g. "Risk Profile 72") */
  showScoreOnAxis?: boolean;
}

const RiskProfileChart: React.FC<RiskProfileChartProps> = React.memo(({ data, confidenceMetrics, showScoreOnAxis = false }) => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  // Use theme primary (same as rest of app: teal from CSS var --primary)
  const primaryColor = 'hsl(var(--primary))';

  // Memoize the colors object to prevent recreation on every render
  const colors = useMemo(() => ({
    primary: {
      stroke: primaryColor,
      fill: primaryColor,
    },
    confidence: {
      high: {
        stroke: isDarkMode ? '#10B981' : '#22c55e',
        fill: isDarkMode ? '#10B981' : '#22c55e',
      },
      medium: {
        stroke: isDarkMode ? '#CA8A04' : '#eab308',
        fill: isDarkMode ? '#CA8A04' : '#eab308',
      },
      low: {
        stroke: isDarkMode ? '#EF4444' : '#ef4444',
        fill: isDarkMode ? '#EF4444' : '#ef4444',
      }
    },
  }), [isDarkMode]);

  // Memoize the chart data transformation to prevent unnecessary recalculations
  const chartData = useMemo(() => 
    transformRiskProfileData(data, confidenceMetrics), [data, confidenceMetrics]
  );

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return colors.confidence.high;
    if (confidence >= 60) return colors.confidence.medium;
    return colors.confidence.low;
  };

  const getConfidenceBadgeColor = (confidence: number) => {
    if (confidence >= 80) return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200 border-green-200 dark:border-green-800";
    if (confidence >= 60) return "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-200 border-amber-200 dark:border-amber-800";
    return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200 border-red-200 dark:border-red-800";
  };

  const getMetricDescription = (label: string): string => {
    switch (label) {
      case "Risk Profile":
        return "Your risk tolerance and investment preferences";
      case "Knowledge":
        return "Your understanding of investment concepts";
      case "Leverage":
        return "Your comfort level with using leverage";
      case "Decision Style":
        return "Your approach to making investment decisions";
      case "Personality":
        return "How your personality traits influence your investment style";
      default:
        return "";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
      style={{ minHeight: 320 }}
    >
      <ResponsiveContainer width="100%" height={320}>
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
          <defs>
            <linearGradient id="scoreGradient-radar" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={primaryColor} />
              <stop offset="100%" stopColor={primaryColor} />
            </linearGradient>
          </defs>
          
          <PolarGrid 
            stroke={isDarkMode ? '#6b7280' : '#d1d5db'} 
            strokeDasharray="3 3"
            strokeOpacity={0.9}
            strokeWidth={1}
          />
          
          <PolarAngleAxis 
            dataKey="attribute" 
            tick={
              showScoreOnAxis
                ? (props: { payload?: { attribute?: string; value?: number | string }; x?: number; y?: number; textAnchor?: string }) => {
                    const { payload, x = 0, y = 0, textAnchor = 'middle' } = props;
                    const label = (typeof payload?.value === 'string' ? payload.value : payload?.attribute) ?? '';
                    const numericValue = typeof payload?.value === 'number'
                      ? payload.value
                      : chartData.find((d) => d.attribute === label)?.value ?? 0;
                    const displayValue = Math.round(numericValue);
                    const fill = isDarkMode ? '#9ca3af' : '#64748b';
                    return (
                      <g transform={`translate(${x}, ${y})`}>
                        <text
                          textAnchor={textAnchor}
                          fill={fill}
                          fontSize={11}
                          fontWeight={500}
                        >
                          {label}
                        </text>
                        <text
                          textAnchor={textAnchor}
                          fill={isDarkMode ? '#e2e8f0' : '#1e293b'}
                          fontSize={13}
                          fontWeight={700}
                          dy={14}
                        >
                          {displayValue}
                        </text>
                      </g>
                    );
                  }
                : {
                    fill: isDarkMode ? '#9ca3af' : '#64748b',
                    fontSize: 12,
                    fontWeight: 500,
                  }
            }
            axisLine={{ stroke: isDarkMode ? '#374151' : '#e2e8f0' }}
          />
          
          <Radar
            name="Your Profile"
            dataKey="value"
            stroke={colors.primary.stroke}
            fill={`url(#scoreGradient-radar)`}
            fillOpacity={0.7}
            animationDuration={1000}
            animationEasing="ease-in-out"
            strokeWidth={3}
          />
          
          {confidenceMetrics && (
            <Radar
              name="Confidence Range"
              dataKey="confidence"
              stroke={colors.confidence.medium.stroke}
              fill={colors.confidence.medium.fill}
              fillOpacity={isDarkMode ? 0.15 : 0.2}
              strokeDasharray="8 4"
              animationBegin={500}
              animationEasing="ease-in-out"
              strokeWidth={2}
            />
          )}
          
          <Tooltip 
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                const score = Math.round(Number(payload[0].value));
                const confidenceRaw = payload[1]?.value ? Number(payload[1].value) : null;
                const confidence = confidenceRaw != null ? Math.round(confidenceRaw) : null;
                
                return (
                  <div className="bg-popover p-4 rounded-lg shadow-lg border border-border">
                    <h3 className="font-medium text-sm mb-2 text-popover-foreground">{label}</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Score:</span>
                        <span className="font-medium text-popover-foreground">{score}/100</span>
                      </div>
                      {confidence != null && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Confidence:</span>
                          <Badge variant="outline" className={getConfidenceBadgeColor(confidence)}>
                            {confidence}%
                          </Badge>
                        </div>
                      )}
                      <div className="text-xs text-muted-foreground mt-2">
                        {getMetricDescription(label)}
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          
          <Legend 
            verticalAlign="bottom" 
            height={36}
            wrapperStyle={{
              paddingTop: '20px',
            }}
            formatter={(value) => (
              <span style={{ 
                color: isDarkMode ? '#e2e8f0' : '#64748b',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                {value}
              </span>
            )}
          />
        </RadarChart>
      </ResponsiveContainer>
    </motion.div>
  );
});

RiskProfileChart.displayName = 'RiskProfileChart';

// Wrap the RiskProfileChart component with ComponentErrorBoundary
const RiskProfileChartWithErrorBoundary: React.FC<RiskProfileChartProps> = (props) => {
  return (
    <ComponentErrorBoundary 
      componentName="RiskProfileChart"
      variant="card"
      showDetails={false}
    >
      <RiskProfileChart {...props} />
    </ComponentErrorBoundary>
  );
};

export default RiskProfileChartWithErrorBoundary;
