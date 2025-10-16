import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  AlertTriangle,
  Info,
  ChevronDown,
  ChevronUp,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { AssetAnalysisResponse } from '@/lib/api/assetAnalyzerApi';
import { 
  formatMarketCap,
  formatPercentage,
  formatCurrency,
  formatNumber,
  getRiskLevelColor
} from '@/lib/utils/assetAnalyzerUtils';

interface MetricsGridProps {
  data?: AssetAnalysisResponse['data']['metrics'];
  isLoading: boolean;
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({
  data,
  isLoading
}) => {
  const [expandedMetrics, setExpandedMetrics] = useState<Set<string>>(new Set());

  const toggleMetricExpansion = (metricName: string) => {
    const newExpanded = new Set(expandedMetrics);
    if (newExpanded.has(metricName)) {
      newExpanded.delete(metricName);
    } else {
      newExpanded.add(metricName);
    }
    setExpandedMetrics(newExpanded);
  };

  const formatMetricValue = (metricName: string, value: number): string => {
    const lowerName = metricName.toLowerCase();
    
    if (lowerName.includes('market cap') || lowerName.includes('marketcap')) {
      return formatMarketCap(value);
    }
    if (lowerName.includes('yield') || lowerName.includes('return') || lowerName.includes('ratio')) {
      return formatPercentage(value);
    }
    if (lowerName.includes('price') || lowerName.includes('eps') || lowerName.includes('revenue')) {
      return formatCurrency(value);
    }
    
    return formatNumber(value);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Loading metrics...</span>
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
            <p className="text-muted-foreground">No metrics data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <TrendingUp className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Key Financial Metrics</h3>
      </div>
      <div className="space-y-4">
          {data.recommended.map((metricName, index) => {
            const value = data.actual[metricName];
            const analysis = data.analysis[metricName];
            const isExpanded = expandedMetrics.has(metricName);
            
            // Skip if analysis data is missing
            if (!analysis) {
              return null;
            }
            
            return (
              <motion.div
                key={metricName}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border border-border hover:border-primary/30 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium text-foreground">{metricName}</h4>
                          <Badge 
                            variant="outline" 
                            className={cn("text-xs", getRiskLevelColor(analysis.riskLevel))}
                          >
                            {analysis.riskLevel} Risk
                          </Badge>
                        </div>
                        <div className="text-2xl font-bold text-primary mb-1">
                          {formatMetricValue(metricName, value)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {analysis.interpretation}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleMetricExpansion(metricName)}
                        className="ml-4"
                      >
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pt-4 border-t border-border"
                      >
                        <div className="space-y-3">
                          <div>
                            <h5 className="font-medium text-foreground mb-1 flex items-center gap-2">
                              <Info className="h-4 w-4" />
                              Explanation
                            </h5>
                            <p className="text-sm text-muted-foreground">
                              {analysis.explanation}
                            </p>
                          </div>
                          <div>
                            <h5 className="font-medium text-foreground mb-1 flex items-center gap-2">
                              <TrendingUp className="h-4 w-4" />
                              Action
                            </h5>
                            <p className="text-sm text-muted-foreground">
                              {analysis.action}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
  );
};