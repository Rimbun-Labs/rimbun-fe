import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, ChevronDown, ChevronUp, ChevronRight, GraduationCap } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getRecommendations } from '@/lib/api/recommendationApi';
import { learningPathsContent } from '@/lib/api/types/learningPaths';
import { LoadingState } from '@/components/dashboard/ui/LoadingState';
import { EnhancedEmptyState } from '@/components/ui/enhanced-empty-state';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LearningPathSectionProps {
  sessionId?: string;
  knowledgeLevel?: number;
  portfolioAllocations?: {
    equities: number;
    bonds: number;
    realEstate: number;
    cash: number;
  };
}

export const LearningPathSection: React.FC<LearningPathSectionProps> = ({
  sessionId,
  knowledgeLevel,
  portfolioAllocations,
}) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  // Fetch recommendations to get learning paths
  const { data: recommendations, isLoading, error } = useQuery({
    queryKey: ['recommendations', sessionId],
    queryFn: () => getRecommendations(sessionId || ''),
    enabled: !!sessionId,
    retry: 3,
    staleTime: 5 * 60 * 1000,
  });

  // Get learning paths from recommendations
  const learningPaths = recommendations?.adjustedAllocations
    ? Object.entries(recommendations.adjustedAllocations)
        .filter(([_, allocation]) => allocation > 0)
        .map(([assetClass, allocation]) => {
          const formattedAssetClass = assetClass.toLowerCase().replace('_', '');
          const content = learningPathsContent[formattedAssetClass];
          
          // Get progress from localStorage
          const savedProgress = localStorage.getItem(`learning-path-${sessionId}-${formattedAssetClass}`);
          let completedSections: number[] = [];
          if (savedProgress) {
            try {
              const parsed = JSON.parse(savedProgress);
              completedSections = parsed.completedSections || [];
            } catch (e) {
              console.error('Error parsing saved progress:', e);
            }
          }
          
          const totalSections = content?.sections.length || 0;
          const completedCount = completedSections.length;
          const progressPercentage = totalSections > 0 ? (completedCount / totalSections) * 100 : 0;
          
          return {
            assetClass,
            formattedAssetClass,
            allocation,
            content,
            progressPercentage,
            completedCount,
            totalSections,
          };
        })
    : [];

  const totalPaths = learningPaths.length;
  const totalCompleted = learningPaths.reduce((sum, path) => sum + (path.totalSections > 0 && path.progressPercentage === 100 ? 1 : 0), 0);
  const overallProgress = totalPaths > 0 
    ? learningPaths.reduce((sum, path) => sum + path.progressPercentage, 0) / totalPaths 
    : 0;

  const knowledgeContext = knowledgeLevel !== undefined
    ? `Personalized for your ${knowledgeLevel}% knowledge level`
    : 'Personalized for your knowledge level';

  const handleViewFullPath = () => {
    if (sessionId) {
      navigate(`/learning-path/${sessionId}`);
    } else {
      navigate('/learning');
    }
  };

  const handlePathClick = (formattedAssetClass: string) => {
    if (sessionId) {
      navigate(`/learning-path/${sessionId}/${formattedAssetClass}`);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <div className="flex items-center gap-2">
          <CardTitle className="text-xl flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Learning Path
          </CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="p-1 rounded-full text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  aria-label="About learning path"
                >
                  <Info className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>Your personalized learning journey based on your assessment results</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleViewFullPath}
            className="flex items-center gap-2"
          >
            View Full Path
            <ChevronRight className="h-4 w-4" />
          </Button>
          {totalPaths > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-2"
            >
              {isExpanded ? 'Show Less' : 'Learn More'}
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="py-4">
            <LoadingState variant="compact" lines={2} />
          </div>
        ) : error ? (
          <EnhancedEmptyState
            icon={GraduationCap}
            title="Learning Paths Unavailable"
            description="We couldn't load your learning paths. Complete your assessment first, or check your connection and try again."
            variant="compact"
          />
        ) : totalPaths === 0 ? (
          <div className="space-y-4">
            <EnhancedEmptyState
              icon={GraduationCap}
              title="No Learning Path Yet"
              description="Complete your assessment to unlock a personalized learning path tailored to your knowledge level and goals"
              actionText="Complete Assessment"
              onAction={() => navigate('/assessment')}
              variant="compact"
            />
            {/* Preview/Teaser Content */}
            <div className="mt-4 p-4 rounded-lg bg-muted/30 border border-border">
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">What you'll learn:</p>
                <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Asset class fundamentals (Equities, Bonds, Real Estate, Cash)</li>
                  <li>Key investment metrics and how to analyze them</li>
                  <li>Portfolio strategies aligned with your risk profile</li>
                  <li>Practical investment decision-making skills</li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Overview - Always Visible */}
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                {knowledgeContext}
              </p>
              {/* Cross-section connection to Investment Portfolio */}
              {portfolioAllocations && (
                <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">💡 Connection:</span> Your learning paths align with your portfolio allocation -{' '}
                    {portfolioAllocations.equities > 0 && (
                      <span className="font-semibold">Equities ({portfolioAllocations.equities}%)</span>
                    )}
                    {portfolioAllocations.bonds > 0 && (
                      <>{portfolioAllocations.equities > 0 ? ', ' : ''}<span className="font-semibold">Bonds ({portfolioAllocations.bonds}%)</span></>
                    )}
                    {portfolioAllocations.realEstate > 0 && (
                      <>{portfolioAllocations.equities > 0 || portfolioAllocations.bonds > 0 ? ', ' : ''}<span className="font-semibold">Real Estate ({portfolioAllocations.realEstate}%)</span></>
                    )}
                    . Complete these paths to better understand your investments.
                  </p>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Learning Paths</div>
                  <div className="text-2xl font-bold">
                    {totalPaths}
                  </div>
                  <div className="text-xs text-muted-foreground">available paths</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Completed</div>
                  <div className="text-2xl font-bold">
                    {totalCompleted}/{totalPaths}
                  </div>
                  <div className="text-xs text-muted-foreground">paths completed</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Overall Progress</div>
                  <div className="text-2xl font-bold">
                    {Math.round(overallProgress)}%
                  </div>
                  <Progress value={overallProgress} className="h-2 mt-2" />
                </div>
              </div>
            </div>

            {/* Expanded Content - Learning Path Cards */}
            {isExpanded && (
              <div className="space-y-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">Your Learning Paths</h3>
                  {portfolioAllocations && (
                    <p className="text-xs text-muted-foreground">
                      💡 Complete these paths to better understand your portfolio allocations
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {learningPaths.map((path) => {
                    // Find matching allocation - map asset class names from recommendations to portfolio allocations
                    // Recommendations use: EQUITIES, BONDS, REAL_ESTATE, CASH
                    // Portfolio allocations use: equities, bonds, realEstate, cash
                    const assetClassMap: Record<string, keyof typeof portfolioAllocations> = {
                      'equities': 'equities',
                      'EQUITIES': 'equities',
                      'bonds': 'bonds',
                      'BONDS': 'bonds',
                      'fixedincome': 'bonds',
                      'FIXEDINCOME': 'bonds',
                      'realestate': 'realEstate',
                      'REALESTATE': 'realEstate',
                      'real_estate': 'realEstate',
                      'REAL_ESTATE': 'realEstate',
                      'cash': 'cash',
                      'CASH': 'cash',
                    };
                    // Try both the original assetClass and formattedAssetClass
                    const mappedKey = assetClassMap[path.assetClass] || assetClassMap[path.assetClass.toLowerCase()] || assetClassMap[path.formattedAssetClass];
                    const matchingAllocation = mappedKey && portfolioAllocations ? portfolioAllocations[mappedKey] : undefined;
                    return (
                      <Card
                        key={path.assetClass}
                        className={cn(
                          "hover:shadow-md transition-all cursor-pointer",
                          path.allocation >= 30 && "border-2 border-primary"
                        )}
                        onClick={() => handlePathClick(path.formattedAssetClass)}
                      >
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-semibold text-foreground">
                                    {path.content?.title || path.assetClass}
                                  </h4>
                                  {path.allocation >= 30 && (
                                    <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-xs">
                                      Recommended
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground line-clamp-2">
                                  {path.content?.description || 'Learning path content'}
                                </p>
                                {/* Connection to portfolio */}
                                {matchingAllocation !== undefined && matchingAllocation > 0 && (
                                  <p className="text-xs text-primary mt-1 font-medium">
                                    📊 Your portfolio: {matchingAllocation}% allocation
                                  </p>
                                )}
                              </div>
                              <div className="text-right">
                                <div className="text-lg font-bold text-primary">{path.allocation}%</div>
                                <div className="text-xs text-muted-foreground">Allocation</div>
                              </div>
                            </div>
                          
                          {path.totalSections > 0 && (
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span className="text-muted-foreground">Progress</span>
                                <span className="font-medium">{Math.round(path.progressPercentage)}%</span>
                              </div>
                              <Progress value={path.progressPercentage} className="h-1.5" />
                              <div className="text-xs text-muted-foreground">
                                {path.completedCount} of {path.totalSections} sections
                              </div>
                            </div>
                          )}
                          
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePathClick(path.formattedAssetClass);
                            }}
                          >
                            <BookOpen className="h-3 w-3 mr-2" />
                            {path.progressPercentage > 0 ? 'Continue' : 'Start'} Learning
                            <ChevronRight className="h-3 w-3 ml-2" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LearningPathSection;

