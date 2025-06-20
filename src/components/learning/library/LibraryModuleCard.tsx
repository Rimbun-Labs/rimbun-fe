import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronRight, 
  BookOpen, 
  Clock
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { MetricCategory } from '@/lib/api/types/metrics';

interface LibraryModuleCardProps {
  module: {
    id: string;
    title: string;
    description: string;
    duration: number;
    difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
    imageUrl: string;
    metrics?: Array<{
      name: string;
      category: MetricCategory;
    }>;
  };
  onStart: () => void;
}

const LibraryModuleCard: React.FC<LibraryModuleCardProps> = ({ module, onStart }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'intermediate':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'advanced':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getCategoryColor = (category: MetricCategory) => {
    switch (category) {
      case 'Growth':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Risk':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Income':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Value':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Technical':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
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
            <div className="absolute top-2 right-2">
              <Badge variant="outline" className={getDifficultyColor(module.difficulty)}>
                {module.difficulty}
              </Badge>
            </div>
          </div>

          {/* Title and Description */}
          <div className="space-y-2 mb-4">
            <h3 className="text-xl font-semibold text-foreground">{module.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{module.description}</p>
          </div>

          {/* Duration */}
          <div className="flex items-center text-sm text-muted-foreground mb-4">
            <Clock className="h-4 w-4 mr-2" />
            <span>{module.duration} mins</span>
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
                    className={getCategoryColor(metric.category)}
                  >
                    {metric.name}
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
              variant="default"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Start Learning
              <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LibraryModuleCard; 