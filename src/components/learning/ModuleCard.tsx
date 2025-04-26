
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Clock, Lock, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModuleCardProps {
  module: {
    id: string;
    title: string;
    description: string;
    duration: number;
    difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
    progress: number;
    isLocked: boolean;
    imageUrl?: string;
    totalLessons?: number;
    completedLessons?: number;
  };
  onStart: () => void;
}

const ModuleCard: React.FC<ModuleCardProps> = ({
  module,
  onStart,
}) => {
  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h${mins > 0 ? ` ${mins}m` : ''}`;
  };
  
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'BEGINNER': return "bg-green-100 text-green-800";
      case 'INTERMEDIATE': return "bg-blue-100 text-blue-800";
      case 'ADVANCED': return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className={cn(
      "h-full overflow-hidden flex flex-col transition-transform duration-200",
      !module.isLocked && "hover:transform hover:scale-[1.02]",
      module.isLocked && "opacity-75"
    )}>
      {/* Module Image */}
      <div
        className="h-40 bg-cover bg-center relative"
        style={{ 
          backgroundImage: module.imageUrl ? `url(${module.imageUrl})` : 'linear-gradient(225deg, #FFE29F 0%, #FFA99F 48%, #FF719A 100%)'
        }}
      >
        {module.isLocked && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Lock className="h-10 w-10 text-white/80" />
          </div>
        )}
        
        <Badge 
          className={cn(
            "absolute top-3 right-3 font-normal",
            getDifficultyColor(module.difficulty)
          )}
        >
          {module.difficulty.charAt(0) + module.difficulty.slice(1).toLowerCase()}
        </Badge>
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="line-clamp-1">{module.title}</CardTitle>
        </div>
        <CardDescription className="line-clamp-2">{module.description}</CardDescription>
      </CardHeader>
      
      <CardContent className="flex-grow space-y-3">
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Clock className="h-3.5 w-3.5 mr-1" />
            <span>{formatDuration(module.duration)}</span>
          </div>
          <div className="flex items-center">
            <BookOpen className="h-3.5 w-3.5 mr-1" />
            <span>{module.totalLessons || 0} lessons</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span className="font-medium">{module.progress}%</span>
          </div>
          <Progress value={module.progress} className="h-2" />
          {module.totalLessons && module.completedLessons !== undefined && (
            <p className="text-xs text-muted-foreground">
              {module.completedLessons} of {module.totalLessons} lessons completed
            </p>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="pt-0">
        <Button 
          className="w-full" 
          disabled={module.isLocked}
          onClick={onStart}
          aria-label={`${module.isLocked ? 'Locked: ' : ''}${
            module.progress === 0 ? 'Start' : module.progress === 100 ? 'Review' : 'Continue'
          } ${module.title}`}
        >
          {module.isLocked ? 'Locked' : 
            module.progress === 0 ? 'Start Learning' : 
            module.progress === 100 ? 'Review Module' : 
            'Continue Learning'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ModuleCard;
