import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ChevronRight, 
  BookOpen, 
  Clock, 
  Trophy,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { MetricCategory } from '@/lib/api/types/metrics';

interface ModuleCardProps {
  module: {
    id: string;
    title: string;
    description: string;
    duration: number;
    difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
    progress: number;
    isLocked: boolean;
    imageUrl: string;
    totalLessons: number;
    completedLessons: number;
    metrics?: Array<{
      name: string;
      category: MetricCategory;
      isRecommended: boolean;
    }>;
    isRecommended?: boolean;
  };
  onStart: () => void;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ module, onStart }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-200 dark:border-green-800';
      case 'intermediate':
        return 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-200 dark:border-amber-800';
      case 'advanced':
        return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-200 dark:border-red-800';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getCategoryColor = (category: MetricCategory) => {
    switch (category) {
      case 'Growth':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'Risk':
        return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-200 dark:border-red-800';
      case 'Income':
        return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-200 dark:border-green-800';
      case 'Value':
        return 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-200 dark:border-purple-800';
      case 'Technical':
        return 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-200 dark:border-amber-800';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-200 dark:border-green-800';
      case 'in-progress':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'locked':
        return 'bg-muted text-muted-foreground border-border';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex flex-col h-full">
          {/* Header with image and badges */}
          <div className="relative h-40 mb-4 rounded-lg overflow-hidden">
            <img 
              src={module.imageUrl} 
              alt={module.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 right-2 flex gap-2">
              {module.isRecommended && (
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Recommended
                </Badge>
              )}
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                {module.difficulty}
              </Badge>
            </div>
          </div>

          {/* Title and Description */}
          <div className="space-y-2 mb-4">
            <h3 className="text-xl font-semibold text-foreground">{module.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{module.description}</p>
          </div>

          {/* Progress */}
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{module.progress}%</span>
            </div>
            <Progress value={module.progress} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{module.completedLessons} of {module.totalLessons} lessons</span>
              <span>{module.duration} mins</span>
            </div>
          </div>

          {/* Metrics Preview */}
          {module.metrics && module.metrics.length > 0 && (
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-muted-foreground">
                <BookOpen className="h-4 w-4 mr-2" />
                <span>Key Metrics:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {module.metrics.slice(0, 3).map((metric, index) => (
                  <Badge 
                    key={index}
                    variant="outline"
                    className={cn(
                      getCategoryColor(metric.category),
                      metric.isRecommended && "border-primary/30"
                    )}
                  >
                    {metric.name}
                    {metric.isRecommended && (
                      <Sparkles className="h-3 w-3 ml-1 text-primary" />
                    )}
                  </Badge>
                ))}
                {module.metrics.length > 3 && (
                  <Badge variant="outline" className="bg-muted text-muted-foreground">
                    +{module.metrics.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Action Button */}
          <div className="mt-auto">
            <Button 
              onClick={onStart}
              className="w-full group"
              variant={module.progress > 0 ? "outline" : "default"}
            >
              {module.progress === 100 ? (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Review
                </>
              ) : module.progress > 0 ? (
                <>
                  <Trophy className="h-4 w-4 mr-2" />
                  Continue
                </>
              ) : (
                <>
                  <BookOpen className="h-4 w-4 mr-2" />
                  Start Learning
                </>
              )}
              <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModuleCard;
