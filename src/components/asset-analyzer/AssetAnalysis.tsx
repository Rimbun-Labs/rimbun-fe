import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  AlertTriangle,
  Info,
  Star,
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
  getRecommendationColor
} from '@/lib/utils/assetAnalyzerUtils';

interface AssetAnalysisProps {
  data?: AssetAnalysisResponse['data'];
  isLoading: boolean;
}

export const AssetAnalysis: React.FC<AssetAnalysisProps> = ({
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
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-8">
              <AlertTriangle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No analysis data available</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { assetInfo, analysis } = data;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Star className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Detailed Analysis</h3>
      </div>
        <div className="space-y-6">
          {/* Asset Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <h4 className="font-medium text-foreground mb-3">Asset Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <span className="text-sm text-muted-foreground">Sector</span>
                    <p className="font-medium">{assetInfo.sector}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Market Cap</span>
                    <p className="font-medium">{formatMarketCap(assetInfo.marketCap)}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">P/E Ratio</span>
                    <p className="font-medium">{formatNumber(assetInfo.peRatio)}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Beta</span>
                    <p className="font-medium">{formatNumber(assetInfo.beta)}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Dividend Yield</span>
                    <p className="font-medium">{formatPercentage(assetInfo.dividendYield)}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">EPS</span>
                    <p className="font-medium">{formatCurrency(assetInfo.eps)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recommendation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-foreground">Investment Recommendation</h4>
                  <Badge 
                    variant="outline" 
                    className={cn("text-sm font-medium", getRecommendationColor(analysis.recommendation))}
                  >
                    {analysis.recommendation}
                  </Badge>
                </div>
                <div className="space-y-2">
                  {analysis.reasoning.map((reason, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span className="text-sm text-muted-foreground">{reason}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Educational Insights (if available) */}
          {'educationalInsights' in data && data.educationalInsights && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20">
                <CardContent className="p-4">
                  <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    Educational Insights
                  </h4>
                  <div className="space-y-2">
                    {data.educationalInsights.map((insight, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                        <span className="text-sm text-muted-foreground">{insight}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Profile Match (if available) */}
          {'profileMatch' in data && data.profileMatch && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20">
                <CardContent className="p-4">
                  <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    Profile Match Analysis
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <h5 className="font-medium text-green-700 dark:text-green-300 mb-2">Strengths</h5>
                      <div className="space-y-1">
                        {data.profileMatch.strengths.map((strength, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <span className="text-green-600 dark:text-green-400 mt-1">•</span>
                            <span className="text-sm text-muted-foreground">{strength}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h5 className="font-medium text-yellow-700 dark:text-yellow-300 mb-2">Concerns</h5>
                      <div className="space-y-1">
                        {data.profileMatch.concerns.map((concern, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <span className="text-yellow-600 dark:text-yellow-400 mt-1">•</span>
                            <span className="text-sm text-muted-foreground">{concern}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
    </div>
  );
};