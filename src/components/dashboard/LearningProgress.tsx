
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Trophy, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface LearningProgressProps {
  completedModules: number;
  totalModules: number;
  currentModule?: {
    id: string;
    name: string;
    progress: number;
  };
  achievements: Array<{
    id: string;
    name: string;
    description: string;
    unlocked: boolean;
  }>;
}

const LearningProgress: React.FC<LearningProgressProps> = ({
  completedModules,
  totalModules,
  currentModule,
  achievements
}) => {
  const overallProgress = totalModules > 0 
    ? Math.round((completedModules / totalModules) * 100)
    : 0;
    
  const unlockedAchievements = achievements.filter(a => a.unlocked);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Learning Progress</CardTitle>
            <CardDescription>
              Continue your financial education journey
            </CardDescription>
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link to="/learning" className="flex items-center gap-1">
              <span>View All Modules</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Progress */}
        <div className="space-y-2">
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Overall Learning Progress</span>
            <span className="text-sm font-medium">{overallProgress}%</span>
          </div>
          <Progress value={overallProgress} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{completedModules} of {totalModules} modules completed</span>
            <span>{totalModules - completedModules} remaining</span>
          </div>
        </div>

        {/* Current Module */}
        {currentModule && (
          <div className="bg-secondary/50 p-4 rounded-lg space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <BookOpen className="h-5 w-5 text-primary mr-2" />
                <h3 className="font-medium">Current Module: {currentModule.name}</h3>
              </div>
              <Badge variant="outline" className="bg-primary/10">
                {currentModule.progress}% Complete
              </Badge>
            </div>
            <Progress value={currentModule.progress} className="h-1.5" />
            <div className="flex justify-end">
              <Button asChild size="sm">
                <Link to={`/learning/${currentModule.id}`}>
                  Continue Learning
                </Link>
              </Button>
            </div>
          </div>
        )}

        {/* Achievements */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-medium flex items-center">
              <Trophy className="h-4 w-4 mr-2 text-amber-500" />
              Achievements
            </h3>
            <span className="text-sm text-muted-foreground">
              {unlockedAchievements.length} of {achievements.length} unlocked
            </span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {achievements.slice(0, 4).map((achievement) => (
              <div 
                key={achievement.id} 
                className={cn(
                  "p-3 rounded-lg border flex items-start space-x-3",
                  achievement.unlocked ? "bg-primary/5" : "bg-secondary/50 opacity-60"
                )}
              >
                <div className={cn(
                  "h-10 w-10 rounded-full flex items-center justify-center",
                  achievement.unlocked ? "bg-amber-100 text-amber-600" : "bg-gray-200 text-gray-400"
                )}>
                  <Trophy className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <p className="font-medium leading-none">{achievement.name}</p>
                  <p className="text-xs text-muted-foreground">{achievement.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          {achievements.length > 4 && (
            <div className="flex justify-center mt-2">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/achievements">View All Achievements</Link>
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LearningProgress;
