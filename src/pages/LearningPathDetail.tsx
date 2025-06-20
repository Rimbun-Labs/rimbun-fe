import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { learningPathsContent } from '@/lib/api/types/learningPaths';
import { metricContent } from '@/lib/api/types/metricContent';
import { MetricCategory } from '@/lib/api/types/metrics';
import { 
  ArrowLeft, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight, 
  CheckCircle2, 
  Circle,
  BookOpen,
  Clock,
  Lightbulb,
  Share2,
  Bookmark,
  BookmarkCheck,
  Trophy,
  Sparkles,
  Menu,
  ChevronRight
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useQuery } from '@tanstack/react-query';
import { getRecommendations } from '@/lib/api/recommendationApi';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { ArrowLeftIcon, ShareIcon } from 'lucide-react';
import MetricOverviewSection from '@/components/learning/metrics/MetricOverviewSection';
import GuidedMetricLearning from '@/components/learning/metrics/GuidedMetricLearning';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import QuizSection from '@/components/learning/quiz/QuizSection';

const LearningPathDetail: React.FC = () => {
  const { sessionId, assetClass } = useParams<{ sessionId: string; assetClass: string }>();
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<number[]>([]);
  const [showMetrics, setShowMetrics] = useState(false);
  const [completedSections, setCompletedSections] = useState<number[]>([]);
  const [bookmarkedSections, setBookmarkedSections] = useState<number[]>([]);
  const [lastCompletedSection, setLastCompletedSection] = useState<number | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [showCompletionMessage, setShowCompletionMessage] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const [completedMetrics, setCompletedMetrics] = useState<string[]>([]);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showFinalActions, setShowFinalActions] = useState(false);
  const [isFullyCompleted, setIsFullyCompleted] = useState(false);
  
  const { data: recommendations } = useQuery({
    queryKey: ['recommendations', sessionId],
    queryFn: () => getRecommendations(sessionId || ''),
    enabled: !!sessionId
  });

  // Auto-expand first section on load
  useEffect(() => {
    if (expandedSections.length === 0) {
      setExpandedSections([0]);
    }
  }, []);

  // Handle completion celebration
  useEffect(() => {
    if (lastCompletedSection !== null) {
      setShowCelebration(true);
      const timer = setTimeout(() => setShowCelebration(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [lastCompletedSection]);

  // Early return if asset class is invalid
  if (!assetClass || !learningPathsContent[assetClass]) {
    return (
      <div className="text-center p-6">
        <p>Learning path not found</p>
        <Button onClick={() => navigate(`/learning-path/${sessionId}`)} className="mt-4">
          Back to Learning Paths
        </Button>
      </div>
    );
  }

  const content = learningPathsContent[assetClass];
  const totalSections = content.sections.length;
  const completedCount = completedSections.length;
  const progressPercentage = Math.round((completedCount / totalSections) * 100);

  // Load saved progress on mount
  useEffect(() => {
    const savedProgress = localStorage.getItem(`learning-path-${sessionId}-${assetClass}`);
    if (savedProgress) {
      try {
        const { completedSections: savedCompleted, lastViewedSection } = JSON.parse(savedProgress);
        setCompletedSections(savedCompleted);
        if (lastViewedSection !== undefined) {
          setExpandedSections([lastViewedSection]);
        }
      } catch (error) {
        toast.error("Error loading saved progress");
      }
    }
  }, [assetClass, sessionId]);

  // Save progress when it changes
  useEffect(() => {
    const saveProgress = () => {
      localStorage.setItem(`learning-path-${sessionId}-${assetClass}`, JSON.stringify({
        completedSections,
        lastViewedSection: expandedSections[0]
      }));
    };

    if (completedSections.length > 0 || expandedSections.length > 0) {
      saveProgress();
    }

    window.addEventListener('beforeunload', saveProgress);
    return () => window.removeEventListener('beforeunload', saveProgress);
  }, [assetClass, sessionId, completedSections, expandedSections]);
  
  const toggleSection = (index: number) => {
    setExpandedSections(prev => {
      const newSections = prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index];
      return newSections;
    });
  };

  const toggleSectionCompletion = (index: number) => {
    setCompletedSections(prev => {
      const newCompleted = prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index];
      
      if (!prev.includes(index)) {
        setLastCompletedSection(index);
        toast.success("Section completed! 🎉", {
          description: "Great job! Keep up the good work.",
        });

        if (newCompleted.length === totalSections) {
          setShowCompletionMessage(true);
          toast.success("Asset Class Completed! 🎉", {
            description: "Ready to learn about the key metrics for this asset class?",
          });
        }
      } else {
        if (newCompleted.length < totalSections) {
          setShowCompletionMessage(false);
        }
      }
      
      return newCompleted;
    });
  };

  // Add effect to check completion on mount and when sections change
  useEffect(() => {
    if (completedSections.length === totalSections && totalSections > 0) {
      setShowCompletionMessage(true);
    } else {
      setShowCompletionMessage(false);
    }
  }, [completedSections.length, totalSections]);

  const toggleBookmark = (index: number) => {
    setBookmarkedSections(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
    toast.info(
      bookmarkedSections.includes(index) 
        ? "Section removed from bookmarks" 
        : "Section bookmarked for later"
    );
  };

  const shareProgress = () => {
    const shareText = `I've completed ${completedCount} of ${totalSections} sections in the ${content.title} learning path! 🚀`;
    if (navigator.share) {
      navigator.share({
        title: 'My Learning Progress',
        text: shareText,
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success("Progress copied to clipboard!");
    }
  };

  const handleStartMetrics = () => {
    setShowMetrics(true);
    setSelectedMetric(null); // Reset selected metric when starting metrics
  };

  const handleSelectMetric = (metricName: string) => {
    setSelectedMetric(metricName);
  };

  const handleBackToOverview = () => {
    setSelectedMetric(null);
  };

  // Add state persistence for metrics with validation
  useEffect(() => {
    // Only proceed if we have valid recommendations (meaning assessment is completed)
    if (!recommendations?.recommendedMetrics[assetClass]) {
      console.log('No recommendations found for asset class - new user or invalid session:', {
        sessionId,
        assetClass,
        hasRecommendations: !!recommendations,
        recommendedMetrics: recommendations?.recommendedMetrics[assetClass]
      });
      // Clear any existing progress for this session
      localStorage.removeItem(`metrics-progress-${sessionId}-${assetClass}`);
      setCompletedMetrics([]);
      setShowFinalActions(false);
      return;
    }

    // Only load saved progress if we have valid recommendations
    const savedProgress = localStorage.getItem(`metrics-progress-${sessionId}-${assetClass}`);
    if (savedProgress) {
      try {
        const { completedMetrics: savedMetrics, showFinalActions: savedFinalActions } = JSON.parse(savedProgress);
        // Verify the saved metrics match the recommended metrics
        const recommendedMetrics = Object.keys(recommendations.recommendedMetrics[assetClass]);
        const validMetrics = savedMetrics.filter(metric => recommendedMetrics.includes(metric));
        
        console.log('Validating saved metrics progress:', {
          savedMetrics,
          recommendedMetrics,
          validMetrics,
          isValid: validMetrics.length === savedMetrics.length
        });

        setCompletedMetrics(validMetrics);
        setShowFinalActions(savedFinalActions && validMetrics.length === recommendedMetrics.length);
      } catch (error) {
        console.error('Error loading metrics progress:', error);
        // Clear invalid progress
        localStorage.removeItem(`metrics-progress-${sessionId}-${assetClass}`);
        setCompletedMetrics([]);
        setShowFinalActions(false);
      }
    }
  }, [assetClass, sessionId, recommendations]);

  // Update handleMetricComplete to prevent duplicates and validate metrics
  const handleMetricComplete = (metric: string) => {
    console.log('Attempting to complete metric:', metric);
    setCompletedMetrics(prev => {
      // Only add if not already completed
      if (prev.includes(metric)) {
        console.log('Metric already completed:', metric);
        return prev;
      }

      // Verify this is a valid metric for this asset class
      const metricsForThisAssetClass = recommendations?.recommendedMetrics[assetClass] || {};
      const availableMetrics = Object.keys(metricsForThisAssetClass);
      
      console.log('Validating metric:', {
        metric,
        assetClass,
        availableMetrics,
        hasRecommendations: !!recommendations,
        recommendationsData: recommendations?.recommendedMetrics[assetClass]
      });

      if (!(metric in metricsForThisAssetClass)) {
        console.error('Invalid metric for asset class:', { 
          metric, 
          assetClass, 
          availableMetrics,
          recommendationsData: recommendations?.recommendedMetrics[assetClass]
        });
        return prev;
      }
      
      const newCompleted = [...prev, metric];
      console.log('Updated completed metrics:', {
        newCompleted,
        totalCompleted: newCompleted.length,
        totalAvailable: availableMetrics.length
      });
      
      // Check if all metrics for current asset class are completed
      const allMetricsCompleted = availableMetrics.every(m => newCompleted.includes(m));
      
      console.log('Metrics completion check:', {
        metric,
        availableMetrics,
        newCompleted,
        allMetricsCompleted,
        assetClassCompleted: completedSections.length === totalSections
      });
      
      // Only show final actions if asset class learning is also completed
      const assetClassCompleted = completedSections.length === totalSections;
      const shouldShowFinalActions = allMetricsCompleted && assetClassCompleted;
      
      setShowFinalActions(shouldShowFinalActions);
      return newCompleted;
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100';
      case 'intermediate':
        return 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100';
      case 'advanced':
        return 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100';
      default:
        return 'bg-muted text-muted-foreground border-border hover:bg-muted/80';
    }
  };

  const getMetricColor = (metric: string) => {
    const colors = [
      'bg-blue-50 text-blue-700 border-blue-200',
      'bg-purple-50 text-purple-700 border-purple-200',
      'bg-cyan-50 text-cyan-700 border-cyan-200',
      'bg-indigo-50 text-indigo-700 border-indigo-200',
    ];
    return colors[metric.length % colors.length];
  };

  const renderSectionContent = (content: string) => {
    // Split content into paragraphs
    const paragraphs = content.split('. ').filter(p => p.trim());
    
    // Extract key points (sentences with metrics, examples, or important concepts)
    const keyPoints = paragraphs.filter(p => 
      p.includes('`') || 
      p.toLowerCase().includes('for example') ||
      p.toLowerCase().includes('like') ||
      /\d+%/.test(p)
    );

    // Extract practical tips (sentences with actionable advice)
    const practicalTips = paragraphs.filter(p => 
      p.toLowerCase().includes('try') ||
      p.toLowerCase().includes('learn') ||
      p.toLowerCase().includes('use')
    );

    return (
      <div className="space-y-6">
        {/* Overview */}
        <div className="prose prose-slate max-w-none">
          <p className="text-foreground leading-relaxed">
            {paragraphs[0]}
          </p>
        </div>

        {/* Key Points */}
        {keyPoints.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-amber-500" />
              Key Points & Examples
            </h4>
            <ul className="space-y-2">
              {keyPoints.map((point, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-amber-500 mt-1">•</span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Practical Tips */}
        {practicalTips.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Trophy className="h-4 w-4 text-emerald-500" />
              Practical Tips
            </h4>
            <ul className="space-y-2">
              {practicalTips.map((tip, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-emerald-500 mt-1">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Interactive Prompt */}
        {content.toLowerCase().includes('try a prompt') && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-sm text-blue-700">
              {content.split('Try a prompt')[1].split('.')[0]}
            </p>
          </div>
        )}
      </div>
    );
  };

  // Add function to handle returning to learning paths list
  const handleBackToLearningPaths = () => {
    navigate(`/learning-path/${sessionId}`);
  };

  // Add function to handle returning to asset classes (for metrics view)
  const handleBackToAssetClasses = () => {
    // Hide metrics view and return to asset class learning
    setShowQuiz(false);
    setSelectedMetric(null);
    setShowMetrics(false);
  };

  const handleGoToInvestmentExplorer = () => {
    // Save current state before navigating
    localStorage.setItem(`metrics-progress-${sessionId}-${assetClass}`, JSON.stringify({
      completedMetrics,
      showFinalActions
    }));
    navigate(`/investment-explorer/${sessionId}`, { replace: true });
  };

  const handleSectionClick = (index: number) => {
    setExpandedSections([index]);
    document.getElementById(`section-${index}`)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleBookmarkClick = (index: number) => {
    toggleBookmark(index);
  };

  const handleCompletionClick = (index: number) => {
    toggleSectionCompletion(index);
  };

  const getCompletionMessage = () => {
    const baseMessage = {
      title: "Congratulations! 🎉",
      subtitle: "You've completed your recommended learning path!",
      description: "",
      nextSteps: "Ready to expand your investment knowledge? Explore other asset classes in our learning library."
    };

    switch (assetClass) {
      case 'equities':
        return {
          ...baseMessage,
          description: "You now have a solid understanding of equities and their key metrics. This knowledge will help you analyze stocks and make better investment decisions."
        };
      case 'realestate':
        return {
          ...baseMessage,
          description: "You've mastered the fundamentals of real estate investing and its key metrics. You're now equipped to evaluate properties and REITs effectively."
        };
      case 'fixedincome':
        return {
          ...baseMessage,
          description: "You've completed the Fixed Income learning path! You now understand bonds and fixed income securities, along with their key metrics."
        };
      case 'crypto':
        return {
          ...baseMessage,
          description: "You've completed the Crypto learning path! You now have a strong foundation in cryptocurrency investing and blockchain technology."
        };
      default:
        return {
          ...baseMessage,
          description: "You've completed this learning path! You now have a solid understanding of the key metrics that will help you make better investment decisions."
        };
    }
  };

  const getNonRecommendedPaths = () => {
    if (!recommendations) return [];
    
    // Get all available paths
    const allPaths = Object.keys(learningPathsContent);
    
    // Get recommended paths (those with non-zero allocation)
    const recommendedPaths = Object.entries(recommendations.adjustedAllocations)
      .filter(([_, allocation]) => allocation > 0)
      .map(([path]) => path.toLowerCase());
    
    // Get non-recommended paths
    return allPaths
      .filter(path => !recommendedPaths.includes(path))
      .map(path => ({
        id: path,
        ...learningPathsContent[path],
        difficulty: learningPathsContent[path].sections[0].difficulty
      }));
  };

  // Update effect to check completion for current asset class only
  useEffect(() => {
    if (!recommendations?.recommendedMetrics[assetClass]) {
      console.log('No recommendations found for asset class:', assetClass);
      return;
    }
    
    // Check completion for current asset class only
    const assetClassCompleted = completedSections.length === totalSections;
    const metricsForThisAssetClass = recommendations.recommendedMetrics[assetClass] || {};
    const allMetricsForAssetClass = Object.keys(metricsForThisAssetClass);
    
    // Check if ALL metrics for this asset class are completed
    const metricsCompleted = allMetricsForAssetClass.every(metric => 
      completedMetrics.includes(metric)
    );
    
    console.log('Completion Status:', {
      assetClass,
      assetClassCompleted,
      totalSections,
      completedSectionsCount: completedSections.length,
      allMetricsForAssetClass,
      completedMetrics,
      metricsCompleted,
      isFullyCompleted: assetClassCompleted && metricsCompleted
    });
    
    // Update states based on current asset class completion
    setIsFullyCompleted(assetClassCompleted && metricsCompleted);
    setShowFinalActions(assetClassCompleted && metricsCompleted);
  }, [completedSections, completedMetrics, totalSections, recommendations, assetClass]);

  // Save metrics progress when it changes
  useEffect(() => {
    if (!recommendations?.recommendedMetrics[assetClass]) {
      return; // Don't save if we don't have valid recommendations
    }

    if (completedMetrics.length > 0 || showFinalActions) {
      const metricsToSave = completedMetrics.filter(metric => 
        recommendations.recommendedMetrics[assetClass][metric]
      );
      
      localStorage.setItem(`metrics-progress-${sessionId}-${assetClass}`, JSON.stringify({
        completedMetrics: metricsToSave,
        showFinalActions: showFinalActions && 
          metricsToSave.length === Object.keys(recommendations.recommendedMetrics[assetClass]).length
      }));
    }
  }, [completedMetrics, showFinalActions, assetClass, sessionId, recommendations]);

  const handleStartQuiz = () => {
    if (!recommendations?.recommendedMetrics[assetClass]) {
      console.error('Cannot start quiz - no valid recommendations');
      return;
    }

    // Save current state before showing quiz
    const metricsToSave = completedMetrics.filter(metric => 
      recommendations.recommendedMetrics[assetClass][metric]
    );
    
    localStorage.setItem(`metrics-progress-${sessionId}-${assetClass}`, JSON.stringify({
      completedMetrics: metricsToSave,
      showFinalActions: showFinalActions && 
        metricsToSave.length === Object.keys(recommendations.recommendedMetrics[assetClass]).length
    }));
    setShowQuiz(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <div className="sticky top-0 z-50 bg-background border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="space-y-4">
          <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={showMetrics ? handleBackToAssetClasses : handleBackToLearningPaths}
                className="inline-flex items-center text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {showMetrics ? "Back to Asset Classes" : "Back to Learning Paths"}
              </Button>
              
            <div className="flex items-center space-x-4">
                {showCompletionMessage && !showMetrics && (
              <Button
                    onClick={handleStartMetrics}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    Learn Key Metrics
                    <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
                )}
              </div>
            </div>

            {/* What's Next section - only show when current asset class is fully completed */}
            {isFullyCompleted && (
              <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-2xl p-8 border border-emerald-200">
                    <div className="space-y-6">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-emerald-100 rounded-xl">
                          <Trophy className="h-6 w-6 text-emerald-600" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-foreground">What's Next?</h2>
                          <p className="text-muted-foreground">Continue your learning journey</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Investment Explorer */}
                        <Card className="border-border hover:border-emerald-200 transition-colors">
                          <CardContent className="p-6">
                            <div className="space-y-4">
                              <div className="p-2 bg-blue-50 rounded-lg w-fit">
                                <Sparkles className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-foreground">Investment Explorer</h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                  Explore real investment opportunities using your new knowledge
                                </p>
                              </div>
                              <Button
                                onClick={handleGoToInvestmentExplorer}
                                className="w-full bg-blue-600 hover:bg-blue-700"
                              >
                                Start Exploring
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>

                        {/* More Learning Paths */}
                        <Card className="border-border hover:border-emerald-200 transition-colors">
                          <CardContent className="p-6">
                            <div className="space-y-4">
                              <div className="p-2 bg-purple-50 rounded-lg w-fit">
                                <BookOpen className="h-5 w-5 text-purple-600" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-foreground">More Learning Paths</h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                  Explore other asset classes and expand your investment knowledge
                                </p>
                              </div>
                              <Button
                                onClick={() => navigate(`/learning-path/${sessionId}`)}
                                className="w-full bg-purple-600 hover:bg-purple-700"
                              >
                                View Learning Paths
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Back to Learning Paths */}
                        <Card className="border-border hover:border-emerald-200 transition-colors">
                          <CardContent className="p-6">
                            <div className="space-y-4">
                              <div className="p-2 bg-muted rounded-lg w-fit">
                                <ArrowLeft className="h-5 w-5 text-muted-foreground" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-foreground">Back to Learning Paths</h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                  Return to your learning dashboard
                                </p>
                              </div>
                              <Button
                                onClick={handleBackToLearningPaths}
                                className="w-full"
                              >
                                Go Back
                                <ArrowLeft className="ml-2 h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showMetrics ? (
          selectedMetric ? (
            <div className="space-y-4">
              <Button
                variant="outline"
                onClick={handleBackToOverview}
                className="mb-4"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Overview
              </Button>
              <GuidedMetricLearning
                metrics={{
                  [selectedMetric]: {
                    name: selectedMetric,
                    category: metricContent[selectedMetric]?.category || 'Growth',
                    weight: recommendations?.recommendedMetrics[assetClass]?.[selectedMetric]?.weight || 1,
                    description: recommendations?.recommendedMetrics[assetClass]?.[selectedMetric]?.description || '',
                    content: metricContent[selectedMetric]?.content
                  }
                }}
                assetClass={assetClass || ''}
                onBack={handleBackToOverview}
                onComplete={() => {
                  handleMetricComplete(selectedMetric);
                  handleBackToOverview();
                }}
                sessionId={sessionId}
              />
            </div>
          ) : (
            <div className="space-y-8">
              <MetricOverviewSection
                metrics={Object.entries(recommendations?.recommendedMetrics[assetClass] || {}).reduce((acc, [metric, recommendedMetric]) => {
                  const metricInfo = metricContent[metric];
                  const category = metricInfo?.category || 'Growth';
                  
                  return {
                    ...acc,
                    [metric]: {
                      name: metric,
                      category,
                      weight: recommendedMetric.weight,
                      description: recommendedMetric.description,
                      content: metricInfo?.content
                    }
                  };
                }, {})}
                assetClass={assetClass || ''}
                onSelectMetric={handleSelectMetric}
                completedMetrics={completedMetrics}
              />
            </div>
          )
        ) : (
          <>
            {/* Asset Class Learning Content */}
            <div className="bg-background shadow rounded-lg overflow-hidden">
              <Card className="border-border">
                <CardHeader className="bg-gradient-to-b from-background to-muted/50">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-3xl bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                          {content.title}
                        </CardTitle>
                        <CardDescription className="text-lg mt-2 text-muted-foreground">
                          {content.description}
                        </CardDescription>
                      </div>
                    </div>
                    
                    {/* Progress Overview */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-foreground">Overall Progress</span>
                        <span className="text-sm font-medium text-foreground">{progressPercentage}%</span>
                      </div>
                      <Progress 
                        value={progressPercentage} 
                        className="h-2 bg-muted [&>div]:bg-gradient-to-r [&>div]:from-emerald-500 [&>div]:to-emerald-600" 
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{completedCount} of {totalSections} sections completed</span>
                        <span>{totalSections - completedCount} remaining</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex gap-6">
                    {/* Table of Contents */}
                    <div className="w-64 shrink-0 hidden md:block">
                      <div className="sticky top-4 space-y-2">
                        <h3 className="font-medium mb-2 text-foreground">Sections</h3>
                        {content.sections.map((section, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              setExpandedSections([index]);
                              document.getElementById(`section-${index}`)?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className={cn(
                              "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                              "hover:bg-muted",
                              expandedSections.includes(index) && "bg-muted",
                              completedSections.includes(index) && "text-emerald-600"
                            )}
                          >
                            <div className="flex items-center gap-2">
                              {completedSections.includes(index) ? (
                                <CheckCircle2 className="h-4 w-4" />
                              ) : (
                                <Circle className="h-4 w-4" />
                              )}
                              <span className="truncate">{section.title}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                      <ScrollArea className="h-[400px] pr-4">
                        {content.sections.map((section, index) => (
                          <motion.div
                            key={index}
                            id={`section-${index}`}
                            className="mb-4"
                          >
                            <div 
                              className="p-4 bg-background rounded-lg border border-border cursor-pointer"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                toggleSection(index);
                              }}
                            >
                              <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                  <h3 className="font-medium text-foreground">{section.title}</h3>
                                  <div className="flex items-center gap-2">
                                    <Badge
                                      variant="outline"
                                      className={cn(
                                        "text-xs",
                                        getDifficultyColor(section.difficulty)
                                      )}
                                    >
                                      {section.difficulty}
                                    </Badge>
                                    {section.relatedMetrics && (
                                      <Badge variant="secondary" className="text-xs bg-muted text-foreground">
                                        {section.relatedMetrics.length} metrics
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      toggleBookmark(index);
                                    }}
                                    className={cn(
                                      "p-1 rounded-full hover:bg-muted transition-colors",
                                      bookmarkedSections.includes(index) ? "text-amber-500" : "text-muted-foreground"
                                    )}
                                  >
                                    {bookmarkedSections.includes(index) ? (
                                      <BookmarkCheck className="h-5 w-5" />
                                    ) : (
                                      <Bookmark className="h-5 w-5" />
                                    )}
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      toggleSectionCompletion(index);
                                    }}
                                    className={cn(
                                      "p-1 rounded-full hover:bg-muted transition-colors",
                                      completedSections.includes(index) ? "text-emerald-600" : "text-muted-foreground"
                                    )}
                                  >
                                    {completedSections.includes(index) ? (
                                      <CheckCircle2 className="h-5 w-5" />
                                    ) : (
                                      <Circle className="h-5 w-5" />
                                    )}
                                  </button>
                                  {expandedSections.includes(index) ? (
                                    <ChevronUp className="h-5 w-5 text-muted-foreground" />
                                  ) : (
                                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                                  )}
                                </div>
                              </div>
                            </div>

                            <AnimatePresence>
                              {expandedSections.includes(index) && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="overflow-hidden"
                                >
                                  <div className="p-4 space-y-4 bg-background rounded-lg border border-border">
                                    {renderSectionContent(section.content)}
                                    
                                    <div className="flex justify-end">
                                      <Button
                                        onClick={(e) => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          toggleSectionCompletion(index);
                                        }}
                                        className={cn(
                                          "gap-2",
                                          completedSections.includes(index)
                                            ? "bg-emerald-600 hover:bg-emerald-700"
                                            : "bg-foreground hover:bg-foreground/90"
                                        )}
                                      >
                                        {completedSections.includes(index) ? (
                                          <>
                                            <CheckCircle2 className="h-4 w-4" />
                                            Completed
                                          </>
                                        ) : (
                                          <>
                                            <Circle className="h-4 w-4" />
                                            Mark as Complete
                                          </>
                                        )}
                                      </Button>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        ))}
                      </ScrollArea>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>

      {/* Mobile Navigation Drawer */}
      <Sheet open={showMobileNav} onOpenChange={setShowMobileNav}>
        <SheetContent side="left" className="w-64 p-0 bg-white">
          <div className="p-4 border-b border-border">
            <h3 className="font-medium text-foreground">Sections</h3>
          </div>
          <ScrollArea className="h-[calc(100vh-4rem)]">
            <div className="p-2 space-y-1">
              {content.sections.map((section, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setExpandedSections([index]);
                    setShowMobileNav(false);
                    document.getElementById(`section-${index}`)?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                    "hover:bg-muted",
                    expandedSections.includes(index) && "bg-muted",
                    completedSections.includes(index) && "text-emerald-600"
                  )}
                >
                  <div className="flex items-center gap-2">
                    {completedSections.includes(index) ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <Circle className="h-4 w-4" />
                    )}
                    <span className="truncate">{section.title}</span>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Celebration Animation */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className="text-6xl bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent">
              🎉
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quiz Dialog */}
      <Dialog open={showQuiz} onOpenChange={setShowQuiz}>
        <DialogContent className="max-w-2xl">
          <QuizSection
            assetClass={assetClass || ''}
            responseGroupId={sessionId || ''}
            onClose={() => setShowQuiz(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LearningPathDetail; 