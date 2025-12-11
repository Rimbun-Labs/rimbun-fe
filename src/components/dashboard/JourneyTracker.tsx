import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSession } from '@/contexts/SessionContext';
import {
  Stepper,
  StepperItem,
  StepperTrigger,
  StepperIndicator,
  StepperTitle,
  StepperSeparator,
} from '@/components/ui/stepper';
import { BarChart, BookOpen, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

interface JourneyTrackerProps {
  variant?: 'compact' | 'full';
  className?: string;
}

const JourneyTracker: React.FC<JourneyTrackerProps> = ({ variant = 'compact', className }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { session } = useSession();
  
  // Determine current stage based on route - just show which page user is on
  const getCurrentStage = (): number => {
    // Planning stage: financial planning or goals pages
    if (location.pathname.includes('/financial-planning') || location.pathname.includes('/goals')) {
      return 2; // Planning
    }
    // Learning stage: learning pages
    if (location.pathname.includes('/learning') || location.pathname.includes('/learning-path')) {
      return 1; // Learning
    }
    // Assessment stage: dashboard or assessment pages
    return 0; // Assessment (default/dashboard)
  };

  const currentStage = getCurrentStage();

  const steps = [
    {
      step: 0,
      title: 'Assessment',
      icon: BarChart,
      route: session?.id ? `/dashboard/${session.id}` : '/dashboard',
    },
    {
      step: 1,
      title: 'Learning',
      icon: BookOpen,
      route: session?.id ? `/learning-path/${session.id}` : '/learning',
    },
    {
      step: 2,
      title: 'Planning',
      icon: Target,
      route: '/financial-planning',
    },
  ];

  const handleStepClick = (route: string) => {
    navigate(route);
  };

  // Compact variant for header (always visible)
  return (
    <div className={cn("flex items-center gap-1 md:gap-2", className)}>
      <Stepper value={currentStage} orientation="horizontal" className="items-center gap-1 md:gap-2">
        {steps.map((step, index) => (
          <div key={step.step} className="flex items-center">
            <StepperItem step={step.step} completed={false}>
              <StepperTrigger
                onClick={() => handleStepClick(step.route)}
                className={cn(
                  "flex items-center gap-1.5 md:gap-2 p-1.5 md:p-2 rounded-md transition-all",
                  "hover:bg-accent hover:text-accent-foreground",
                  "cursor-pointer group",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                )}
              >
                <StepperIndicator className="size-5 md:size-6 shrink-0" />
                <div className="hidden sm:block">
                  <StepperTitle className="text-xs md:text-sm font-medium group-hover:text-foreground">
                    {step.title}
                  </StepperTitle>
                </div>
              </StepperTrigger>
            </StepperItem>
            {index < steps.length - 1 && (
              <StepperSeparator className="hidden sm:block mx-1" />
            )}
          </div>
        ))}
      </Stepper>
    </div>
  );
};

export default JourneyTracker;
