import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Check, ChevronRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChecklistItem {
  id: string;
  label: string;
  description?: string;
  completed: boolean;
  route: string;
  icon?: React.ReactNode;
}

interface OnboardingChecklistProps {
  assessmentComplete: boolean;
  hasSpendingData: boolean;
  hasGoals: boolean;
  hasLearningProgress: boolean;
  hasBankingProducts: boolean;
  sessionId?: string;
  onDismiss?: () => void;
}

export const OnboardingChecklist: React.FC<OnboardingChecklistProps> = ({
  assessmentComplete,
  hasSpendingData,
  hasGoals,
  hasLearningProgress,
  hasBankingProducts,
  sessionId,
  onDismiss,
}) => {
  const navigate = useNavigate();

  // Check if dashboard has been visited
  const hasVisitedDashboard = localStorage.getItem('hasVisitedDashboard') === 'true';

  const checklistItems: ChecklistItem[] = useMemo(() => [
    {
      id: 'assessment',
      label: 'Complete Assessment',
      description: 'Understand your risk profile and investment preferences',
      completed: assessmentComplete,
      route: sessionId ? `/dashboard/${sessionId}` : '/dashboard',
    },
    {
      id: 'dashboard',
      label: 'Explore Your Dashboard',
      description: 'View your investment profile and portfolio insights',
      completed: hasVisitedDashboard && assessmentComplete,
      route: sessionId ? `/dashboard/${sessionId}` : '/dashboard',
    },
    {
      id: 'financial-planning',
      label: 'Track Your Spending',
      description: 'Add spending data to see cash flow projections',
      completed: hasSpendingData,
      route: '/financial-planning?tab=current',
    },
    {
      id: 'goals',
      label: 'Create Your First Goal',
      description: 'Set and track your financial objectives',
      completed: hasGoals,
      route: '/goals',
    },
    {
      id: 'banking',
      label: 'Explore Banking Products',
      description: 'Discover personalized banking recommendations',
      completed: hasBankingProducts,
      route: '/banking-products',
    },
    {
      id: 'learning',
      label: 'Start Learning Path',
      description: 'Begin your personalized investment education',
      completed: hasLearningProgress,
      route: sessionId ? `/learning-path/${sessionId}` : '/learning',
    },
  ], [assessmentComplete, hasVisitedDashboard, hasSpendingData, hasGoals, hasBankingProducts, hasLearningProgress, sessionId]);

  const completedCount = checklistItems.filter(item => item.completed).length;
  const totalCount = checklistItems.length;
  const progressPercentage = (completedCount / totalCount) * 100;

  const handleItemClick = (item: ChecklistItem) => {
    navigate(item.route);
  };

  // Don't show if all items are completed
  if (completedCount === totalCount) {
    return null;
  }

  return (
    <Card className="mb-6 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-xl flex items-center gap-2">
              🎉 Welcome! Let's Get Started
            </CardTitle>
            <CardDescription>
              Complete these steps to unlock the full potential of your wealth planning journey
            </CardDescription>
          </div>
          {onDismiss && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onDismiss}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-semibold">{completedCount}/{totalCount} Complete</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {checklistItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleItemClick(item)}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all",
                "hover:bg-accent hover:text-accent-foreground",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                item.completed ? "opacity-75" : ""
              )}
            >
              <div className={cn(
                "flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center",
                item.completed 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-muted border-2 border-muted-foreground/20"
              )}>
                {item.completed ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-muted-foreground/40" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className={cn(
                  "font-medium text-sm",
                  item.completed ? "line-through text-muted-foreground" : ""
                )}>
                  {item.label}
                </div>
                {item.description && !item.completed && (
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {item.description}
                  </div>
                )}
              </div>
              {!item.completed && (
                <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              )}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default OnboardingChecklist;

