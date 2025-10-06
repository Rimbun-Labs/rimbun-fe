import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, BarChart, Shield } from "lucide-react";
import { ResponseGroup } from "@/lib/api/types/assessment";
import { cn } from "@/lib/utils";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface ProfileCardProps {
  session?: ResponseGroup | null;
  isLoading?: boolean;
}

export const ProfileCard = ({ session, isLoading }: ProfileCardProps) => {
  const isCompleted = session?.isCompleted;
  const metadata = session?.metadata;

  return (
    <div className="relative w-full h-80 md:h-96">
      {/* Background Gradient */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl opacity-20 blur-2xl"></div>
      
      {/* Card Content */}
      <div className="relative w-full h-full bg-background rounded-xl shadow-lg overflow-hidden p-6 flex flex-col justify-between border border-border">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            <div>
              <h3 className="text-2xl font-bold text-foreground">
                {isCompleted ? "Your Investment Profile" : "Investment Profile Preview"}
              </h3>
              <p className="text-muted-foreground mt-3">
                {isCompleted 
                  ? "Your personalized investment insights:"
                  : "Take the assessment to discover your:"}
              </p>
              
              <ul className="mt-6 space-y-4">
                <li className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-full border border-primary/20">
                    <Shield className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-foreground">
                    {isCompleted 
                      ? `Risk Profile: ${metadata?.riskProfile || 'N/A'}`
                      : 'Risk Tolerance'}
                  </span>
                </li>
                
                <li className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-full border border-primary/20">
                    <BookOpen className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-foreground">
                    {isCompleted 
                      ? `Knowledge Level: ${metadata?.knowledgeLevel || 'N/A'}`
                      : 'Investment Knowledge'}
                  </span>
                </li>
                
                <li className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-full border border-green-200 dark:bg-green-900/20 dark:border-green-800">
                    <BarChart className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="text-foreground">
                    {isCompleted 
                      ? `Investment Horizon: ${metadata?.investmentHorizon || 'N/A'}`
                      : 'Financial Goals Alignment'}
                  </span>
                </li>
              </ul>
            </div>

            <Button 
              asChild 
              className={cn(
                "mt-8 w-full",
                isCompleted ? "bg-primary hover:bg-primary/90 text-primary-foreground" : "bg-primary hover:bg-primary/90 text-primary-foreground"
              )}
            >
              <Link to={isCompleted ? `/dashboard/${session.id}` : "/assessment"}>
                {isCompleted ? "View Full Profile" : "Get Started"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </>
        )}
      </div>
    </div>
  );
}; 