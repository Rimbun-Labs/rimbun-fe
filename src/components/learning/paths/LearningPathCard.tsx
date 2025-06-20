import React, { useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate, useParams } from 'react-router-dom';
import { LearningPathContent } from '@/lib/api/types/learningPaths';
import { 
  ChevronRight, 
  BookOpen, 
  Clock, 
  Bookmark,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface LearningPathCardProps {
  assetClass: string;
  content: LearningPathContent | undefined;
  allocation: number;
}

const LearningPathCard: React.FC<LearningPathCardProps> = ({ assetClass, content, allocation }) => {
  const navigate = useNavigate();
  const { sessionId } = useParams<{ sessionId: string }>();
  const [isBookmarked, setIsBookmarked] = React.useState(false);
  const [completedSections, setCompletedSections] = React.useState<number[]>([]);

  useEffect(() => {
    // Load saved progress from localStorage
    const savedProgress = localStorage.getItem(`learning-path-${sessionId}-${assetClass.toLowerCase()}`);
    if (savedProgress) {
      try {
        const { completedSections: savedCompleted } = JSON.parse(savedProgress);
        setCompletedSections(savedCompleted);
      } catch (error) {
        console.error('Error parsing saved progress:', error);
      }
    }
  }, [assetClass, sessionId]);

  const handleClick = () => {
    navigate(`/learning-path/${sessionId}/${assetClass.toLowerCase()}`);
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
  };

  if (!content) {
    return (
      <Card 
        className="hover:shadow-lg transition-all duration-200 cursor-pointer h-full"
        onClick={handleClick}
      >
        <CardContent className="p-6">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <div className="space-y-1">
                <h3 className="text-xl font-semibold text-foreground">{assetClass}</h3>
                <p className="text-sm text-muted-foreground">No detailed information available</p>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-lg font-semibold text-emerald-600">{allocation}%</span>
                <span className="text-xs text-muted-foreground">Allocation</span>
              </div>
            </div>
            <div className="mt-auto">
              <Button 
                variant="ghost" 
                size="sm" 
                className="group w-full justify-end"
              >
                Start Learning
                <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalSections = content.sections.length;
  const completedCount = completedSections.length;
  const progressPercentage = Math.round((completedCount / totalSections) * 100);

  return (
    <Card 
      className={cn(
        "hover:shadow-lg transition-all duration-200 cursor-pointer h-full",
        "group relative overflow-hidden",
        allocation >= 30 && "border-2 border-emerald-500"
      )}
      onClick={handleClick}
    >
      {/* Visual indicator for allocation */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500"
        style={{ height: `${allocation}%` }}
      />

      {/* Quick actions */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8"
          onClick={handleBookmark}
        >
          <Bookmark className={cn(
            "h-4 w-4",
            isBookmarked ? "fill-emerald-500 text-emerald-500" : "text-slate-400"
          )} />
        </Button>
      </div>

      <CardContent className="p-6">
        <div className="flex flex-col h-full">
          {/* Header with title and allocation */}
          <div className="flex items-start justify-between mb-6">
            <div className="space-y-2 max-w-[70%]">
              <div className="flex items-center gap-2">
                <h3 className="text-2xl font-semibold text-foreground">{content.title}</h3>
                {allocation >= 30 && (
                  <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Recommended
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {content.description}
              </p>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-2xl font-semibold text-emerald-600 dark:text-emerald-400">{allocation}%</span>
              <span className="text-xs text-muted-foreground">Allocation</span>
            </div>
          </div>

          {/* Section preview */}
          <div className="mt-4 space-y-2">
            <div className="flex items-center text-sm text-muted-foreground mb-2">
              <BookOpen className="h-4 w-4 mr-2" />
              <span>What you'll learn:</span>
            </div>
            <ul className="space-y-1.5">
              {content.sections.slice(0, 3).map((section, index) => (
                <li key={index} className="flex items-start text-sm">
                  <CheckCircle2 className="h-4 w-4 mr-2 mt-0.5 text-emerald-500" />
                  <span className="text-muted-foreground">{section.title}</span>
                </li>
              ))}
              {content.sections.length > 3 && (
                <li className="text-sm text-muted-foreground">
                  +{content.sections.length - 3} more sections
                </li>
              )}
            </ul>
          </div>

          {/* Progress indicator */}
          <div className="mt-6">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Overall Progress</span>
              <span className="font-medium text-foreground">{progressPercentage}%</span>
            </div>
            <Progress 
              value={progressPercentage} 
              className="h-2 bg-slate-100 [&>div]:bg-gradient-to-r [&>div]:from-emerald-500 [&>div]:to-emerald-600" 
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>{completedCount} of {totalSections} sections completed</span>
              <span>{totalSections - completedCount} remaining</span>
            </div>
          </div>

          {/* Action button */}
          <div className="mt-6">
            <Button 
              variant="default" 
              size="sm" 
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Start
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LearningPathCard; 