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
import MetricLearningSection from '@/components/learning/metrics/MetricLearningSection';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { ArrowLeftIcon, ShareIcon } from 'lucide-react';
import MetricOverviewSection from '@/components/learning/metrics/MetricOverviewSection';
import GuidedMetricLearning from '@/components/learning/metrics/GuidedMetricLearning';

interface MetricLearningSectionProps {
  assetClass: string;
  onBack: () => void;
  onComplete: () => void;
}

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
    const savedProgress = localStorage.getItem(`learning-path-${assetClass}`);
    console.log('Loading saved progress:', savedProgress);
    if (savedProgress) {
      try {
        const { completedSections: savedCompleted, lastViewedSection } = JSON.parse(savedProgress);
        console.log('Parsed saved progress:', { savedCompleted, lastViewedSection });
        setCompletedSections(savedCompleted);
        if (lastViewedSection !== undefined) {
          setExpandedSections([lastViewedSection]);
        }
      } catch (error) {
        console.error('Error parsing saved progress:', error);
      }
    }
  }, [assetClass]); // Only run on mount and when assetClass changes

  // Save progress when it changes
  useEffect(() => {
    const saveProgress = () => {
      console.log('Saving progress:', {
        completedSections,
        lastViewedSection: expandedSections[0]
      });
      localStorage.setItem(`learning-path-${assetClass}`, JSON.stringify({
        completedSections,
        lastViewedSection: expandedSections[0]
      }));
    };

    // Only save if we have actual changes
    if (completedSections.length > 0 || expandedSections.length > 0) {
      saveProgress();
    }

    window.addEventListener('beforeunload', saveProgress);
    return () => window.removeEventListener('beforeunload', saveProgress);
  }, [assetClass, completedSections, expandedSections]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const currentIndex = expandedSections[0];
        const nextIndex = e.key === 'ArrowDown' 
          ? Math.min(currentIndex + 1, totalSections - 1)
          : Math.max(currentIndex - 1, 0);
        
        setExpandedSections([nextIndex]);
        document.getElementById(`section-${nextIndex}`)?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'center'
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [expandedSections, totalSections]);
  
  const toggleSection = (index: number) => {
    console.log('Toggle section called for index:', index);
    console.log('Current expanded sections:', expandedSections);
    setExpandedSections(prev => {
      const newSections = prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index];
      console.log('New expanded sections:', newSections);
      return newSections;
    });
  };

  const toggleSectionCompletion = (index: number) => {
    console.log('Toggling completion for section:', index);
    console.log('Current completed sections:', completedSections);
    
    setCompletedSections(prev => {
      const newCompleted = prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index];
      
      console.log('New completed sections:', newCompleted);
      console.log('Total sections:', totalSections);
      
      if (!prev.includes(index)) {
        setLastCompletedSection(index);
        toast.success("Section completed! 🎉", {
          description: "Great job! Keep up the good work.",
        });

        // Check if all sections for this asset class are completed
        if (newCompleted.length === totalSections) {
          console.log('All sections completed!');
          setShowCompletionMessage(true);
          toast.success("Asset Class Completed! 🎉", {
            description: "Ready to learn about the key metrics for this asset class?",
          });
        }
      } else {
        // If uncompleting a section, hide the completion message
        setShowCompletionMessage(false);
      }
      
      return newCompleted;
    });
  };

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

  const handleCompleteMetric = (metricName: string) => {
    if (!completedMetrics.includes(metricName)) {
      const newCompletedMetrics = [...completedMetrics, metricName];
      setCompletedMetrics(newCompletedMetrics);
      
      // Check if all metrics for current asset class are completed
      const allMetricsCompleted = content.keyMetrics.every(metric => 
        newCompletedMetrics.includes(metric)
      );

      if (allMetricsCompleted) {
        // Find next recommended asset class
        const nextAssetClass = Object.entries(recommendations?.adjustedAllocations || {})
          .filter(([assetClass, allocation]) => 
            allocation > 0 && 
            assetClass.toLowerCase() !== assetClass?.toLowerCase()
          )
          .sort((a, b) => b[1] - a[1])[0];

        if (nextAssetClass) {
          toast.success("Congratulations! 🎉", {
            description: `You've completed ${assetClass}! Moving on to ${nextAssetClass[0].toLowerCase()}...`,
          });
          // Navigate to next asset class
          navigate(`/learning-path/${sessionId}/${nextAssetClass[0].toLowerCase()}`);
        } else {
          toast.success("Congratulations! 🎉", {
            description: "You've completed all recommended asset classes!",
          });
          // Navigate to learning library
          navigate(`/learning-path/${sessionId}`);
        }
      } else {
        toast.success("Metric completed! 🎉", {
          description: "Great job understanding this metric!",
        });
      }
    }
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
        return 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100';
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
          <p className="text-slate-700 leading-relaxed">
            {paragraphs[0]}
          </p>
        </div>

        {/* Key Points */}
        {keyPoints.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-amber-500" />
              Key Points & Examples
            </h4>
            <ul className="space-y-2">
              {keyPoints.map((point, index) => (
                <li key={index} className="text-sm text-slate-600 flex items-start gap-2">
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
            <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <Trophy className="h-4 w-4 text-emerald-500" />
              Practical Tips
            </h4>
            <ul className="space-y-2">
              {practicalTips.map((tip, index) => (
                <li key={index} className="text-sm text-slate-600 flex items-start gap-2">
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

  // Add function to handle returning to asset classes
  const handleBackToAssetClasses = () => {
    navigate(`/learning-path/${sessionId}`);
  };

  // Add console log to track completion state
  useEffect(() => {
    console.log('Completion state:', {
      completedSections,
      totalSections,
      showCompletionMessage,
      progressPercentage
    });
  }, [completedSections, totalSections, showCompletionMessage, progressPercentage]);

  // Add effect to check completion on mount
  useEffect(() => {
    if (completedSections.length === totalSections) {
      console.log('All sections already completed on mount');
      setShowCompletionMessage(true);
    }
  }, [completedSections.length, totalSections]);

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackToAssetClasses}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Back to Learning Paths
              </button>
              {showMetrics && (
                <div className="flex items-center text-gray-500">
                  <span className="mx-2">/</span>
                  <span className="font-medium">Learning Metrics</span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={shareProgress}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <ShareIcon className="h-4 w-4 mr-2" />
                Share Progress
              </button>
            </div>
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
                metrics={content.keyMetrics.reduce((acc, metric) => {
                  const recommendedMetric = recommendations?.recommendedMetrics[assetClass]?.[metric];
                  const metricInfo = metricContent[metric];
                  const category = metricInfo ? Object.keys(metricInfo)[0] as MetricCategory : 'Growth';
                  
                  return {
                    ...acc,
                    [metric]: {
                      name: metric,
                      category,
                      weight: recommendedMetric?.weight || 1,
                      priority: recommendedMetric?.priority || 'Secondary'
                    }
                  };
                }, {})}
                assetClass={assetClass || ''}
                onBack={handleBackToOverview}
                onComplete={() => {
                  // Check if all metrics are completed
                  const allMetricsCompleted = content.keyMetrics.every(metric => 
                    completedMetrics.includes(metric)
                  );

                  if (allMetricsCompleted) {
                    // Find next recommended asset class
                    const allocations = recommendations?.recommendedMetrics || {};
                    const nextAssetClass = Object.entries(allocations)
                      .filter(([class_, metrics]) => 
                        class_ !== assetClass && 
                        Object.keys(metrics).length > 0
                      )
                      .sort((a, b) => 
                        Object.keys(b[1]).length - Object.keys(a[1]).length
                      )[0]?.[0];

                    if (nextAssetClass) {
                      toast.success("Great job! 🎉", {
                        description: `You've completed all metrics for ${assetClass}. Let's move on to ${nextAssetClass}!`,
                      });
                      navigate(`/learning/${nextAssetClass}`);
                    } else {
                      toast.success("Congratulations! 🎉", {
                        description: "You've completed all recommended metrics!",
                      });
                      navigate('/learning');
                    }
                  } else {
                    handleCompleteMetric(selectedMetric);
                  }
                }}
              />
            </div>
          ) : (
            <MetricOverviewSection
              metrics={content.keyMetrics.reduce((acc, metric) => {
                const recommendedMetric = recommendations?.recommendedMetrics[assetClass]?.[metric];
                const metricInfo = metricContent[metric];
                const category = metricInfo ? Object.keys(metricInfo)[0] as MetricCategory : 'Growth';
                
                return {
                  ...acc,
                  [metric]: {
                    name: metric,
                    category,
                    weight: recommendedMetric?.weight || 1,
                    priority: recommendedMetric?.priority || 'Secondary'
                  }
                };
              }, {})}
              assetClass={assetClass || ''}
              onSelectMetric={handleSelectMetric}
              completedMetrics={completedMetrics}
            />
          )
        ) : (
          <>
            {/* Asset Class Learning Content */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <Card className="border-slate-200">
                <CardHeader className="bg-gradient-to-b from-white to-slate-50/50">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-3xl bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                          {content.title}
                        </CardTitle>
                        <CardDescription className="text-lg mt-2 text-slate-600">
                          {content.description}
                        </CardDescription>
                      </div>
                    </div>
                    
                    {/* Progress Overview */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-slate-700">Overall Progress</span>
                        <span className="text-sm font-medium text-slate-700">{progressPercentage}%</span>
                      </div>
                      <Progress 
                        value={progressPercentage} 
                        className="h-2 bg-slate-100 [&>div]:bg-gradient-to-r [&>div]:from-emerald-500 [&>div]:to-emerald-600" 
                      />
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>{completedCount} of {totalSections} sections completed</span>
                        <span>{totalSections - completedCount} remaining</span>
                      </div>
                    </div>

                    {/* Completion Message and Start Metrics Button */}
                    {showCompletionMessage && (
                      <div className="mt-4 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <h3 className="font-medium text-emerald-900">Asset Class Completed! 🎉</h3>
                            <p className="text-sm text-emerald-700">
                              {getCompletionMessage().description}
                            </p>
                          </div>
                          <Button
                            onClick={handleStartMetrics}
                            className="bg-emerald-600 hover:bg-emerald-700"
                          >
                            Learn Key Metrics
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex gap-6">
                    {/* Table of Contents */}
                    <div className="w-64 shrink-0 hidden md:block">
                      <div className="sticky top-4 space-y-2">
                        <h3 className="font-medium mb-2 text-slate-700">Sections</h3>
                        {content.sections.map((section, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              setExpandedSections([index]);
                              document.getElementById(`section-${index}`)?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className={cn(
                              "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                              "hover:bg-slate-100",
                              expandedSections.includes(index) && "bg-slate-100",
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
                              className="p-4 bg-white rounded-lg border border-slate-200 cursor-pointer"
                              onClick={(e) => {
                                console.log('Section header clicked:', index);
                                e.preventDefault();
                                e.stopPropagation();
                                toggleSection(index);
                              }}
                            >
                              <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                  <h3 className="font-medium text-slate-900">{section.title}</h3>
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
                                      <Badge variant="secondary" className="text-xs bg-slate-100 text-slate-700">
                                        {section.relatedMetrics.length} metrics
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={(e) => {
                                      console.log('Bookmark button clicked:', index);
                                      e.preventDefault();
                                      e.stopPropagation();
                                      toggleBookmark(index);
                                    }}
                                    className={cn(
                                      "p-1 rounded-full hover:bg-slate-100 transition-colors",
                                      bookmarkedSections.includes(index) ? "text-amber-500" : "text-slate-400"
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
                                      console.log('Completion button clicked:', index);
                                      e.preventDefault();
                                      e.stopPropagation();
                                      toggleSectionCompletion(index);
                                    }}
                                    className={cn(
                                      "p-1 rounded-full hover:bg-slate-100 transition-colors",
                                      completedSections.includes(index) ? "text-emerald-600" : "text-slate-400"
                                    )}
                                  >
                                    {completedSections.includes(index) ? (
                                      <CheckCircle2 className="h-5 w-5" />
                                    ) : (
                                      <Circle className="h-5 w-5" />
                                    )}
                                  </button>
                                  {expandedSections.includes(index) ? (
                                    <ChevronUp className="h-5 w-5 text-slate-400" />
                                  ) : (
                                    <ChevronDown className="h-5 w-5 text-slate-400" />
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
                                  <div className="p-4 space-y-4 bg-white rounded-lg border border-slate-200">
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
                                            : "bg-slate-900 hover:bg-slate-800"
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

            {/* Completion Message */}
            {showCompletionMessage && (
              <div className="mt-8 bg-white shadow rounded-lg overflow-hidden">
                <div className="px-6 py-8">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 mb-4">
                      <Trophy className="h-8 w-8 text-emerald-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {getCompletionMessage().title}
                    </h3>
                    <p className="text-lg text-gray-600 mb-4">
                      {getCompletionMessage().subtitle}
                    </p>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                      {getCompletionMessage().description}
                    </p>
                  </div>

                  {/* Learning Library Section */}
                  <div className="mt-8">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h4 className="text-xl font-semibold text-gray-900">
                          Learning Library
                        </h4>
                        <p className="text-gray-600 mt-1">
                          {getCompletionMessage().nextSteps}
                        </p>
                      </div>
                      <Button
                        onClick={() => navigate(`/learning`)}
                        className="bg-primary hover:bg-primary/90"
                      >
                        Explore Library
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>

                    {/* Non-recommended paths section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {getNonRecommendedPaths().map((path) => (
                        <Card key={path.id} className="hover:shadow-lg transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="space-y-2">
                                <h4 className="font-semibold">{path.title}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {path.description}
                                </p>
                                <div className="flex items-center gap-2">
                                  <Badge
                                    variant="outline"
                                    className={cn(
                                      "text-xs",
                                      getDifficultyColor(path.difficulty)
                                    )}
                                  >
                                    {path.difficulty}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">
                                    {path.sections.length} sections
                                  </span>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigate(`/learning-path/${sessionId}/${path.id}`)}
                              >
                                Start Learning
                                <ChevronRight className="ml-2 h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-center space-x-4 mt-8">
                    <Button
                      onClick={() => setShowMetrics(true)}
                      className="bg-primary hover:bg-primary/90"
                    >
                      Learn Key Metrics
                    </Button>
                    <Button
                      onClick={handleBackToAssetClasses}
                      variant="outline"
                    >
                      Back to Learning Paths
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Mobile Navigation Drawer */}
      <Sheet open={showMobileNav} onOpenChange={setShowMobileNav}>
        <SheetContent side="left" className="w-64 p-0 bg-white">
          <div className="p-4 border-b border-slate-200">
            <h3 className="font-medium text-slate-900">Sections</h3>
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
                    "hover:bg-slate-100",
                    expandedSections.includes(index) && "bg-slate-100",
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
    </div>
  );
};

export default LearningPathDetail; 