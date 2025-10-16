import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  AlertTriangle,
  Target,
  DollarSign,
  BarChart3,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { AssetAnalysisResponse } from '@/lib/api/assetAnalyzerApi';
import { 
  getRiskColor, 
  getReturnColor, 
  getCostColor, 
  getOverallColor, 
  getRecommendationColor,
  formatPercentage,
  getRiskLevel,
  getReturnLevel,
  getCostLevel,
  getOverallLevel
} from '@/lib/utils/assetAnalyzerUtils';

interface ScoreCardsProps {
  data?: AssetAnalysisResponse['data']['analysis'];
  isLoading: boolean;
}

export const ScoreCards: React.FC<ScoreCardsProps> = ({
  data,
  isLoading
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Loading analysis...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <AlertTriangle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">No analysis data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const analysis = data;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <BarChart3 className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Analysis Scores</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Risk Score */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-l-4 border-l-red-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <span className="text-sm font-medium text-muted-foreground">Risk</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {getRiskLevel(analysis.riskScore)}
                  </Badge>
                </div>
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {formatPercentage(analysis.riskScore)}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Lower is better
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Return Score */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-l-4 border-l-green-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium text-muted-foreground">Return</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {getReturnLevel(analysis.returnScore)}
                  </Badge>
                </div>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {formatPercentage(analysis.returnScore)}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Higher is better
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Cost Score */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium text-muted-foreground">Cost</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {getCostLevel(analysis.costScore)}
                  </Badge>
                </div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {formatPercentage(analysis.costScore)}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Lower is better
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Overall Score */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="border-l-4 border-l-purple-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-purple-500" />
                    <span className="text-sm font-medium text-muted-foreground">Overall</span>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={cn("text-xs", getRecommendationColor(analysis.recommendation))}
                  >
                    {analysis.recommendation}
                  </Badge>
                </div>
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {formatPercentage(analysis.overallScore)}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {getOverallLevel(analysis.overallScore)}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
    </div>
  );
};