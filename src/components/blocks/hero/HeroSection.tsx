import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Loader2, Sparkles, ArrowRight, TrendingUp, Brain, Target, CheckCircle, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface HeroSectionProps {
  className?: string;
}

const stages = [
  {
    id: 1,
    title: "Learn Through Scenarios",
    description: "Complete our interactive assessment with real-world financial scenarios covering investments, banking, and financial planning.",
    icon: Brain,
    color: "blue" as const
  },
  {
    id: 2,
    title: "Get Personalized Learning",
    description: "Receive a customized curriculum that adapts to your knowledge and goals.",
    icon: TrendingUp,
    color: "green" as const
  },
  {
    id: 3,
    title: "Build Financial Confidence",
    description: "Track your progress and apply knowledge to real financial decisions about investments, banking, and planning.",
    icon: Target,
    color: "purple" as const
  }
];

export const HeroSection = ({ className }: HeroSectionProps) => {
  const [currentStage, setCurrentStage] = useState(0);

  // Auto-advance stages - slowed down for better user experience
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStage((prev) => (prev + 1) % stages.length);
    }, 6000); // Increased from 4000ms to 6000ms for better readability
    return () => clearInterval(interval);
  }, []);

  return (
    <section className={cn("py-20 md:py-28 relative", className)}>
      <div className="container px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Main Content */}
          <div className="flex flex-col justify-center space-y-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-8"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm border border-primary/20 backdrop-blur-sm"
              >
                <Sparkles className="h-4 w-4" />
                <span>Interactive Financial Education</span>
              </motion.div>

              {/* Main Heading */}
              <div className="space-y-6">
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="text-4xl font-bold tracking-tight sm:text-5xl xl:text-6xl/none text-foreground"
                >
                  Build Financial Confidence Through Learning
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="max-w-[600px] text-muted-foreground md:text-xl leading-relaxed"
                >
                  Take our interactive assessment to understand your financial profile, then get personalized recommendations for investments, banking products, and financial planning tailored to your goals.
                </motion.p>
              </div>
            </motion.div>

            {/* Interactive Stages */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="space-y-6"
              id="how-it-works"
            >
              <h3 className="text-lg font-semibold text-foreground">How it works:</h3>
              <div className="space-y-4">
                {stages.map((stage, index) => (
                  <motion.div
                    key={stage.id}
                    className={cn(
                      "flex items-center gap-4 p-5 rounded-lg border transition-all duration-500",
                      currentStage === index
                        ? "bg-primary/5 border-primary/30 shadow-lg shadow-primary/10"
                        : "bg-muted/30 border-border/50"
                    )}
                  >
                    <motion.div
                      className={cn(
                        "p-3 rounded-lg transition-all duration-500",
                        currentStage === index
                          ? "bg-primary/20"
                          : "bg-muted"
                      )}
                    >
                      <stage.icon className={cn(
                        "h-5 w-5 transition-colors duration-500",
                        currentStage === index ? "text-primary" : "text-muted-foreground"
                      )} />
                    </motion.div>
                    <div className="flex-1">
                      <h4 className={cn(
                        "font-medium transition-colors duration-500",
                        currentStage === index ? "text-[#49AEB8]" : "text-foreground"
                      )}>
                        {stage.title}
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {stage.description}
                      </p>
                    </div>
                    <AnimatePresence>
                      {currentStage === index && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          className="p-1 rounded-full bg-primary"
                        >
                          <CheckCircle className="h-4 w-4 text-primary-foreground" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            {/* Button Group */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-col gap-4 min-[400px]:flex-row"
            >
              {/* Primary CTA - Take Your Assessment */}
              <Button 
                asChild 
                size="lg"
                className="relative group overflow-hidden bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Link to="/signup">
                  <span className="relative z-10 flex items-center">
                    Take Your Assessment
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </Button>
              
              {/* Secondary CTA - Sign In */}
              <Button 
                asChild 
                variant="outline" 
                size="lg"
                className="group border-border hover:bg-accent hover:text-accent-foreground focus-visible:ring-accent"
              >
                <Link to="/login">
                  <span className="flex items-center">
                    Already have an account? Sign In
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </Button>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}; 