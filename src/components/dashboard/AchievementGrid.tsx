
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import { Trophy, Award, BookOpen, PieChart, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface AchievementGridProps {
  className?: string;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  category: 'LEARNING' | 'ASSESSMENT' | 'PORTFOLIO';
  progress: number;
  target: number;
  unlocked: boolean;
  unlockedAt?: string;
  icon: keyof typeof CATEGORY_ICONS;
  rewards?: {
    type: string;
    value: string;
  };
}

const CATEGORY_ICONS = {
  trophy: Trophy,
  award: Award,
  book: BookOpen,
  chart: PieChart,
  star: Star
};

const CATEGORY_COLORS = {
  LEARNING: {
    bg: 'bg-blue-100',
    text: 'text-blue-700',
    border: 'border-blue-200',
    progress: 'bg-blue-500'
  },
  ASSESSMENT: {
    bg: 'bg-purple-100',
    text: 'text-purple-700',
    border: 'border-purple-200',
    progress: 'bg-purple-500'
  },
  PORTFOLIO: {
    bg: 'bg-amber-100',
    text: 'text-amber-700',
    border: 'border-amber-200',
    progress: 'bg-amber-500'
  }
};

const ProgressRing: React.FC<{
  progress: number;
  size: number;
  strokeWidth: number;
  color: string;
  showPercentage?: boolean;
}> = ({ progress, size, strokeWidth, color, showPercentage = true }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-muted opacity-20"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.5s ease 0s" }}
        />
      </svg>
      {showPercentage && (
        <div className="absolute inset-0 flex items-center justify-center font-medium text-xs">
          {`${Math.round(progress)}%`}
        </div>
      )}
    </div>
  );
};

const AchievementCard: React.FC<{
  achievement: Achievement;
  onUnlock?: () => void;
  showDetails?: boolean;
}> = ({ achievement, onUnlock, showDetails = false }) => {
  const categoryStyle = CATEGORY_COLORS[achievement.category];
  const IconComponent = CATEGORY_ICONS[achievement.icon];
  
  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-md",
      achievement.unlocked ? "border-primary/20" : "opacity-75"
    )}>
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <div className={cn(
            "rounded-full p-3", 
            categoryStyle.bg,
            categoryStyle.text
          )}>
            <IconComponent className="h-5 w-5" />
          </div>
          
          <div className="flex-1">
            <h3 className="font-medium text-base">{achievement.name}</h3>
            <p className="text-sm text-muted-foreground">{achievement.description}</p>
            
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center">
                <ProgressRing
                  progress={achievement.progress}
                  size={36}
                  strokeWidth={4}
                  color={`var(--${categoryStyle.progress.substring(3)})`}
                />
                
                <div className="ml-3 text-xs">
                  <div className="text-muted-foreground">Progress</div>
                  <div className="font-medium">
                    {achievement.progress}% complete
                  </div>
                </div>
              </div>
              
              {achievement.unlocked && achievement.rewards && (
                <div className="flex items-center bg-amber-100 text-amber-700 px-2 py-1 rounded-full text-xs font-medium">
                  <Star className="h-3 w-3 mr-1" />
                  {achievement.rewards.value}
                </div>
              )}
            </div>
            
            {showDetails && achievement.unlocked && achievement.unlockedAt && (
              <div className="mt-2 text-xs text-muted-foreground">
                Unlocked on {new Date(achievement.unlockedAt).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const AchievementGrid: React.FC<AchievementGridProps> = ({ className }) => {
  // Mock data for achievements
  const { data: achievements, isLoading } = useQuery({
    queryKey: ['achievements'],
    queryFn: () => Promise.resolve([
      {
        id: "ach1",
        name: "Risk Profile Master",
        description: "Complete your risk assessment with high confidence",
        category: "ASSESSMENT" as const,
        progress: 100,
        target: 100,
        unlocked: true,
        unlockedAt: "2024-04-15T14:30:00Z",
        icon: "trophy" as const,
        rewards: {
          type: "badge",
          value: "Gold Badge"
        }
      },
      {
        id: "ach2",
        name: "Learning Champion",
        description: "Complete 5 learning modules",
        category: "LEARNING" as const,
        progress: 40,
        target: 100,
        unlocked: false,
        icon: "book" as const,
      },
      {
        id: "ach3",
        name: "Diversification Expert",
        description: "Create a well-balanced portfolio",
        category: "PORTFOLIO" as const,
        progress: 75,
        target: 100,
        unlocked: false,
        icon: "chart" as const,
      },
      {
        id: "ach4",
        name: "Knowledge Seeker",
        description: "Score above 85% on financial literacy test",
        category: "ASSESSMENT" as const,
        progress: 90,
        target: 100,
        unlocked: true,
        unlockedAt: "2024-04-10T09:15:00Z",
        icon: "award" as const,
        rewards: {
          type: "points",
          value: "+25 pts"
        }
      }
    ])
  });

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Achievements</h2>
        <Button variant="outline" size="sm">View All</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          Array(4).fill(0).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-5">
                <Skeleton className="h-[120px] w-full" />
              </CardContent>
            </Card>
          ))
        ) : (
          achievements?.map(achievement => (
            <AchievementCard 
              key={achievement.id} 
              achievement={achievement}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default AchievementGrid;
