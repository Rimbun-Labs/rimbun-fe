import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, CheckCircle2, Target, Sparkles, Info } from 'lucide-react';
import { RecommendationsMetadata } from '@/lib/api/types/banking';
import { useSession } from '@/contexts/SessionContext';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface FinancialProfileSummaryProps {
  metadata: RecommendationsMetadata;
  totalProducts: number;
  eligibleCount: number;
  highMatchCount: number;
}

export const FinancialProfileSummary = ({
  metadata,
  totalProducts,
  eligibleCount,
  highMatchCount,
}: FinancialProfileSummaryProps) => {
  const { session } = useSession();
  const profile = session?.metadata?.profile || 'Balanced Investor';
  const riskProfile = session?.metadata?.riskProfile || 50;

  // Determine profile description
  const getProfileDescription = () => {
    if (profile.includes('Conservative')) {
      return 'You prefer lower-risk products that prioritize stability and security.';
    } else if (profile.includes('Balanced')) {
      return 'You seek a balanced approach between growth and security.';
    } else if (profile.includes('Advanced') || profile.includes('Opportunistic')) {
      return 'You\'re comfortable with higher-risk products that offer greater growth potential.';
    }
    return 'Your financial profile shows a balanced approach to banking products.';
  };

  // Determine recommendation strategy
  const getRecommendationStrategy = () => {
    const strategies = [];
    if (eligibleCount > 0) {
      strategies.push(`${eligibleCount} product${eligibleCount !== 1 ? 's' : ''} you can apply for now`);
    }
    if (highMatchCount > 0) {
      strategies.push(`${highMatchCount} high-priority match${highMatchCount !== 1 ? 'es' : ''} (80+ score)`);
    }
    if (metadata.hasActiveGoals) {
      strategies.push('Products aligned with your active financial goals');
    }
    return strategies.length > 0 ? strategies.join(', ') : 'Products that match your profile';
  };

  return (
    <Card className="bg-gradient-to-br from-primary/5 via-background to-background border-primary/20">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-1">
                Your Financial Profile
              </h3>
              <p className="text-sm text-muted-foreground">
                {getProfileDescription()}
              </p>
            </div>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              {profile}
            </Badge>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1">
                  <p className="text-xs text-muted-foreground">Total Matches</p>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs">
                      <p className="text-sm">Total number of products that match your financial profile, goals, and preferences.</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <p className="text-lg font-semibold">{totalProducts}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1">
                  <p className="text-xs text-muted-foreground">Eligible Now</p>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs">
                      <p className="text-sm">Products you can apply for right now based on your current eligibility requirements.</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <p className="text-lg font-semibold">{eligibleCount}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1">
                  <p className="text-xs text-muted-foreground">High Match</p>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs">
                      <p className="text-sm">Products with a match score of 80% or higher, indicating strong alignment with your needs.</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <p className="text-lg font-semibold">{highMatchCount}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                <Target className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1">
                  <p className="text-xs text-muted-foreground">Active Goals</p>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs">
                      <p className="text-sm">Whether you have active financial goals that products can help you achieve.</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <p className="text-lg font-semibold">
                  {metadata.hasActiveGoals ? 'Yes' : 'No'}
                </p>
              </div>
            </div>
          </div>

          {/* Recommendation Strategy */}
          <div className="pt-2 border-t border-border">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Our recommendation:</span>{' '}
              {getRecommendationStrategy()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};


