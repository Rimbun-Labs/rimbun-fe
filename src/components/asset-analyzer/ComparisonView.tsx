import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  GitCompare, 
  TrendingUp, 
  TrendingDown,
  Minus,
  BarChart3,
  Loader2,
  ArrowLeft,
  Star,
  AlertTriangle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { ComparisonResponse } from '@/lib/api/assetAnalyzerApi';
import { 
  formatMarketCap,
  formatPercentage,
  formatCurrency,
  formatNumber,
  getRecommendationColor
} from '@/lib/utils/assetAnalyzerUtils';

interface ComparisonViewProps {
  data?: ComparisonResponse['data'];
  isLoading: boolean;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({
  data,
  isLoading
}) => {

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitCompare className="h-5 w-5" />
            Asset Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Comparing assets...</span>
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
              <p className="text-muted-foreground">No comparison data available</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
            <GitCompare className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Asset Comparison</h2>
            <p className="text-muted-foreground">
              Comparing {symbols.join(', ')}
            </p>
          </div>
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Search
        </Button>
      </div>
          <div className="space-y-6">
            {/* Asset Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.assets.map((asset, index) => (
                <motion.div
                  key={asset.symbol}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.1 }}
                >
                  <Card className="border border-border hover:border-primary/30 transition-colors">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-primary" />
                          <CardTitle className="text-lg">{asset.symbol}</CardTitle>
                        </div>
                        <Badge 
                          variant="outline" 
                          className={getRecommendationColor(asset.analysis.recommendation)}
                        >
                          {asset.analysis.recommendation}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{asset.assetInfo.name}</p>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {/* Key Metrics */}
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Sector</span>
                          <p className="font-medium">{asset.assetInfo.sector}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Market Cap</span>
                          <p className="font-medium">{formatMarketCap(asset.assetInfo.marketCap)}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">P/E Ratio</span>
                          <p className="font-medium">{formatNumber(asset.assetInfo.peRatio)}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Beta</span>
                          <p className="font-medium">{formatNumber(asset.assetInfo.beta)}</p>
                        </div>
                      </div>

                      {/* Scores */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Risk Score</span>
                          <span className="font-medium">{formatPercentage(asset.analysis.riskScore)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Return Score</span>
                          <span className="font-medium">{formatPercentage(asset.analysis.returnScore)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Overall Score</span>
                          <span className="font-medium text-primary">{formatPercentage(asset.analysis.overallScore)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Comparison Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="bg-muted/50">
                <CardContent className="p-4">
                  <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Comparison Summary
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <h5 className="font-medium text-green-700 dark:text-green-300 mb-2">Best Performer</h5>
                      <p className="text-sm text-muted-foreground">{data.comparison.bestPerformer}</p>
                    </div>
                    <div>
                      <h5 className="font-medium text-red-700 dark:text-red-300 mb-2">Worst Performer</h5>
                      <p className="text-sm text-muted-foreground">{data.comparison.worstPerformer}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h5 className="font-medium text-foreground mb-2">Key Differences</h5>
                    <ul className="space-y-1">
                      {data.comparison.keyDifferences.map((difference, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          {difference}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
    </motion.div>
  );
};