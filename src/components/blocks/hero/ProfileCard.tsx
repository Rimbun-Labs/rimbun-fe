import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, BarChart, Shield, Loader2 } from "lucide-react";
import { ResponseGroup } from "@/lib/api/types/assessment";
import { cn } from "@/lib/utils";

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
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl opacity-20 blur-2xl"></div>
      
      {/* Card Content */}
      <div className="relative w-full h-full bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden p-6 flex flex-col justify-between">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div>
              <h3 className="text-2xl font-bold">
                {isCompleted ? "Your Investment Profile" : "Investment Profile Preview"}
              </h3>
              <p className="text-muted-foreground mt-2">
                {isCompleted 
                  ? "Your personalized investment insights:"
                  : "Take the assessment to discover your:"}
              </p>
              
              <ul className="mt-4 space-y-3">
                <li className="flex items-center gap-2">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-1 rounded-full">
                    <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span>
                    {isCompleted 
                      ? `Risk Profile: ${metadata?.riskProfile || 'N/A'}`
                      : 'Risk Tolerance'}
                  </span>
                </li>
                
                <li className="flex items-center gap-2">
                  <div className="bg-purple-100 dark:bg-purple-900/30 p-1 rounded-full">
                    <BookOpen className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <span>
                    {isCompleted 
                      ? `Knowledge Level: ${metadata?.knowledgeLevel || 'N/A'}`
                      : 'Investment Knowledge'}
                  </span>
                </li>
                
                <li className="flex items-center gap-2">
                  <div className="bg-green-100 dark:bg-green-900/30 p-1 rounded-full">
                    <BarChart className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <span>
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
                "mt-6 w-full",
                isCompleted && "bg-primary/90 hover:bg-primary"
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