import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  Lightbulb, 
  Target,
  TrendingUp,
  AlertTriangle,
  Info,
  Star,
  Loader2,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { EducationalAnalysisResponse } from '@/lib/api/assetAnalyzerApi';
import { useSession } from '@/contexts/SessionContext';
import { 
  formatMarketCap,
  formatPercentage,
  formatCurrency,
  formatNumber,
  getRecommendationColor
} from '@/lib/utils/assetAnalyzerUtils';

interface EducationalModeProps {
  data?: EducationalAnalysisResponse['data'];
  isLoading: boolean;
}

export const EducationalMode: React.FC<EducationalModeProps> = ({
  data,
  isLoading
}) => {
  const navigate = useNavigate();
  const { session } = useSession();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Loading educational analysis...</span>
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
              <p className="text-muted-foreground">No educational analysis available</p>
              <p className="text-xs text-muted-foreground mt-1">
                Please complete your assessment to access educational insights
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { assetInfo, analysis, educationalInsights, profileMatch } = data;

  return (
    <div className="space-y-6">
      {/* Educational Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              Educational Analysis
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Personalized insights based on your investment profile and risk tolerance
            </p>
          </CardHeader>
        </Card>
      </motion.div>

      {/* Educational Insights */}
      {educationalInsights && educationalInsights.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Key Learning Points
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {educationalInsights.map((insight, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="p-1 bg-primary/10 rounded-full">
                      <Info className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-foreground">{insight}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Profile Match Analysis */}
      {profileMatch && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Profile Match Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Strengths */}
                <div>
                  <h4 className="font-medium text-green-700 dark:text-green-300 mb-3 flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    Why This Asset Fits Your Profile
                  </h4>
                  <div className="space-y-2">
                    {profileMatch.strengths.map((strength, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className="flex items-start gap-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg"
                      >
                        <span className="text-green-600 dark:text-green-400 mt-1">✓</span>
                        <span className="text-sm text-muted-foreground">{strength}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Concerns */}
                <div>
                  <h4 className="font-medium text-yellow-700 dark:text-yellow-300 mb-3 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Areas to Consider
                  </h4>
                  <div className="space-y-2">
                    {profileMatch.concerns.map((concern, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        className="flex items-start gap-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg"
                      >
                        <span className="text-yellow-600 dark:text-yellow-400 mt-1">⚠</span>
                        <span className="text-sm text-muted-foreground">{concern}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Asset Fundamentals */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Understanding Asset Fundamentals
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <span className="text-sm text-muted-foreground">Company</span>
                <p className="font-medium">{assetInfo.name}</p>
              </div>
              <div className="space-y-2">
                <span className="text-sm text-muted-foreground">Sector</span>
                <p className="font-medium">{assetInfo.sector}</p>
              </div>
              <div className="space-y-2">
                <span className="text-sm text-muted-foreground">Market Cap</span>
                <p className="font-medium">{formatMarketCap(assetInfo.marketCap)}</p>
              </div>
              <div className="space-y-2">
                <span className="text-sm text-muted-foreground">P/E Ratio</span>
                <p className="font-medium">{formatNumber(assetInfo.peRatio)}</p>
                <p className="text-xs text-muted-foreground">
                  {assetInfo.peRatio > 20 ? 'High valuation' : assetInfo.peRatio < 10 ? 'Low valuation' : 'Fair valuation'}
                </p>
              </div>
              <div className="space-y-2">
                <span className="text-sm text-muted-foreground">Beta</span>
                <p className="font-medium">{formatNumber(assetInfo.beta)}</p>
                <p className="text-xs text-muted-foreground">
                  {assetInfo.beta > 1 ? 'More volatile than market' : assetInfo.beta < 1 ? 'Less volatile than market' : 'Market volatility'}
                </p>
              </div>
              <div className="space-y-2">
                <span className="text-sm text-muted-foreground">Dividend Yield</span>
                <p className="font-medium">{formatPercentage(assetInfo.dividendYield)}</p>
                <p className="text-xs text-muted-foreground">
                  {assetInfo.dividendYield > 0.03 ? 'High dividend' : assetInfo.dividendYield > 0.01 ? 'Moderate dividend' : 'Low/no dividend'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Learning Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="flex flex-wrap gap-3"
      >
        <Button variant="default" asChild className="flex items-center gap-2">
          <Link to="/learning">
            <BookOpen className="h-4 w-4" />
            Learn More About Investing
          </Link>
        </Button>
        <Button variant="outline" asChild className="flex items-center gap-2">
          <Link to="/profile">
            <Target className="h-4 w-4" />
            Review My Profile
          </Link>
        </Button>
        {session?.id && (
          <Button 
            variant="outline" 
            asChild
            className="flex items-center gap-2"
          >
            <Link to={`/investment-explorer/${session.id}`}>
              <ChevronRight className="h-4 w-4" />
              Explore Similar Assets
            </Link>
          </Button>
        )}
      </motion.div>
    </div>
  );
};