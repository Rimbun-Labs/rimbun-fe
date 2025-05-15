import React, { useState } from 'react';
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
  const [activeMetric, setActiveMetric] = useState<string | null>(null);
  const chartData = transformRiskProfileData(data, confidenceMetrics);
  
  const colors = {
    primary: {
      stroke: '#4f46e5', // Brighter indigo
      fill: 'rgba(79, 70, 229, 0.7)', // More opaque fill
      gradient: 'linear-gradient(180deg, rgba(79, 70, 229, 0.9) 0%, rgba(79, 70, 229, 0.5) 100%)',
    },
    confidence: {
      high: {
        stroke: 'rgba(34, 197, 94, 0.6)', // More visible green
        fill: 'rgba(34, 197, 94, 0.2)',
      },
      medium: {
        stroke: 'rgba(234, 179, 8, 0.6)', // More visible yellow
        fill: 'rgba(234, 179, 8, 0.2)',
      },
      low: {
        stroke: 'rgba(239, 68, 68, 0.6)', // More visible red
        fill: 'rgba(239, 68, 68, 0.2)',
      }
    },
    grid: '#94a3b8', // Darker slate for better contrast
    text: '#1e293b', // Darker text for better readability
    active: {
      stroke: '#3730a3', // Darker indigo for active state
      fill: 'rgba(55, 48, 163, 0.9)',
    },
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return colors.confidence.high;
    if (confidence >= 60) return colors.confidence.medium;
    return colors.confidence.low;
  };

  const getConfidenceBadgeColor = (confidence: number) => {
    if (confidence >= 80) return "bg-green-100 text-green-800";
    if (confidence >= 60) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
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
      className="w-full h-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
          <defs>
            <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(79, 70, 229, 0.9)" />
              <stop offset="100%" stopColor="rgba(79, 70, 229, 0.5)" />
            </linearGradient>
          </defs>
          
          <PolarGrid 
            stroke={colors.grid} 
            strokeDasharray="3 3"
            strokeOpacity={0.7}
          />
          
          <PolarAngleAxis 
            dataKey="attribute" 
            tick={{ 
              fill: colors.text, 
              fontSize: 13,
              fontWeight: 600,
            }}
            tickLine={false}
            onClick={(data: any) => setActiveMetric(data.value)}
            style={{ cursor: 'pointer' }}
          />
          
          <Radar
            name="Your Profile"
            dataKey="value"
            stroke={colors.primary.stroke}
            fill="url(#scoreGradient)"
            fillOpacity={0.9}
            animationDuration={1000}
            animationEasing="ease-in-out"
            strokeWidth={2.5}
            onClick={(data: any) => setActiveMetric(data.attribute)}
            style={{ cursor: 'pointer' }}
          />
          
          {confidenceMetrics && (
            <Radar
              name="Confidence Range"
              dataKey="confidence"
              stroke={colors.confidence.medium.stroke}
              fill={colors.confidence.medium.fill}
              fillOpacity={0.4}
              strokeDasharray="5 5"
              animationDuration={1000}
              animationBegin={500}
              animationEasing="ease-in-out"
              strokeWidth={2}
            />
          )}
          
          <Tooltip 
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                const score = Number(payload[0].value);
                const confidence = payload[1]?.value ? Number(payload[1].value) : null;
                
                return (
                  <div className="bg-white p-4 rounded-lg shadow-lg border border-border">
                    <h3 className="font-medium text-sm mb-2">{label}</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Score:</span>
                        <span className="font-medium">{score}/100</span>
                      </div>
                      {confidence && (
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
              <span className="text-sm font-medium text-gray-700">{value}</span>
            )}
          />
        </RadarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default RiskProfileChart;
