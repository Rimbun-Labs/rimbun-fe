import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useSession } from "@/contexts/SessionContext";
import { cn } from "@/lib/utils";
import { ArrowRight, Loader2 } from "lucide-react";

interface CTASectionProps {
  className?: string;
}

export const CTASection = ({ className }: CTASectionProps) => {
  const { session, isLoading } = useSession();
  const isCompleted = session?.isCompleted;

  return (
    <section className={cn("py-16 md:py-24", className)}>
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          {/* Content */}
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
              {isCompleted 
                ? "Ready to continue your investment journey?"
                : "Ready to understand your investment style?"}
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              {isCompleted
                ? "Explore your personalized learning paths and track your progress."
                : "Take the financial profile assessment and get personalized insights today."}
            </p>
          </div>

          {/* Button Group */}
          <div className="flex flex-col gap-2 min-[400px]:flex-row">
            <Button 
              asChild 
              size="lg"
              disabled={isLoading}
              className="relative"
            >
              <Link to={isCompleted ? "/dashboard" : "/assessment"}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : isCompleted ? (
                  <>
                    View Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  <>
                    Start Assessment
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Link>
            </Button>

            <Button 
              asChild 
              variant="outline" 
              size="lg"
              disabled={isLoading}
            >
              <Link to={isCompleted ? "/learning" : "/dashboard"}>
                {isCompleted ? "Continue Learning" : "View Demo Dashboard"}
              </Link>
            </Button>
          </div>

          {/* Additional Info */}
          {isCompleted && (
            <div className="pt-4">
              <p className="text-sm text-muted-foreground">
                Last updated: {new Date(session.updatedAt).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}; 