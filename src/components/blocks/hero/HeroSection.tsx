import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ProfileCard } from "./ProfileCard";
import { useSession } from "@/contexts/SessionContext";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface HeroSectionProps {
  className?: string;
}

export const HeroSection = ({ className }: HeroSectionProps) => {
  const { session, isLoading } = useSession();
  const { user } = useAuth();

  return (
    <section className={cn("py-16 md:py-24", className)}>
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          {/* Left Column - Text Content */}
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Understand Your Financial Profile
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Discover your investment personality and get personalized recommendations for financial growth.
              </p>
            </div>
            
            {/* Button Group */}
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              {user ? (
                // Authenticated user - show assessment or dashboard
                <Button 
                  asChild 
                  size="lg"
                  disabled={isLoading}
                  className="relative"
                >
                  <Link to={session?.isCompleted ? "/dashboard" : "/assessment"}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Loading...
                      </>
                    ) : session?.isCompleted ? (
                      "View Dashboard"
                    ) : (
                      "Take Assessment"
                    )}
                  </Link>
                </Button>
              ) : (
                // Unauthenticated user - show sign up
                <Button 
                  asChild 
                  size="lg"
                  className="relative"
                >
                  <Link to="/signup">
                    Get Started - Sign Up
                  </Link>
                </Button>
              )}
              
              <Button 
                asChild 
                variant="outline" 
                size="lg"
                disabled={isLoading}
              >
                <Link to={user ? "/learning" : "/login"}>
                  {user ? "Explore Learning" : "Already have an account? Sign In"}
                </Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            {session?.isCompleted && (
              <div className="pt-4">
                <p className="text-sm text-muted-foreground">
                  Last assessment completed: {new Date(session.updatedAt).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>

          {/* Right Column - Profile Card */}
          <div className="flex items-center justify-center">
            <ProfileCard session={session} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </section>
  );
}; 