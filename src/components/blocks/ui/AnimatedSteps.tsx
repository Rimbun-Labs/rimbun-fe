"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { CheckCircle, Circle, ArrowRight } from "lucide-react";

interface AssessmentStepProps {
  step: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  isActive: boolean;
  isCompleted: boolean;
}

function AssessmentStep({
  step,
  title,
  description,
  icon,
  isActive,
  isCompleted,
}: AssessmentStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: step * 0.1 }}
      className={cn(
        "flex items-start gap-4 p-4 rounded-lg transition-all duration-300",
        isActive && "bg-primary/10 border border-primary/20",
        isCompleted && "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
      )}
    >
      {/* Step Number */}
      <div className="flex-shrink-0">
        {isCompleted ? (
          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
            <CheckCircle className="h-5 w-5 text-white" />
          </div>
        ) : (
          <div
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
              isActive
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            )}
          >
            {step}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <div className="text-2xl">{icon}</div>
          <h3
            className={cn(
              "font-semibold",
              isActive && "text-primary",
              isCompleted && "text-green-700 dark:text-green-300"
            )}
          >
            {title}
          </h3>
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      {/* Arrow */}
      {step < 4 && (
        <div className="flex-shrink-0">
          <ArrowRight
            className={cn(
              "h-4 w-4 transition-colors",
              isCompleted
                ? "text-green-500"
                : isActive
                ? "text-primary"
                : "text-muted-foreground"
            )}
          />
        </div>
      )}
    </motion.div>
  );
}

export const AnimatedSteps = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const progress = useMotionValue(0);
  const progressPercent = useTransform(progress, [0, 3], [0, 100]);

  const steps = [
    {
      title: "Investment Goals",
      description: "Define your financial objectives and timeline",
      icon: "🎯",
    },
    {
      title: "Risk Assessment",
      description: "Understand your comfort level with market volatility",
      icon: "⚖️",
    },
    {
      title: "Knowledge Check",
      description: "Evaluate your investment expertise and experience",
      icon: "📚",
    },
    {
      title: "Personalized Profile",
      description: "Get your custom investment recommendations",
      icon: "📊",
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      progress.set(currentStep + 1);
    } else {
      // Reset to beginning
      setCurrentStep(0);
      progress.set(0);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Assessment Progress</span>
          <span className="text-sm text-muted-foreground">
            Step {currentStep + 1} of {steps.length}
          </span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary"
            style={{ width: progressPercent }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-4">
        {steps.map((step, index) => (
          <AssessmentStep
            key={index}
            step={index + 1}
            title={step.title}
            description={step.description}
            icon={step.icon}
            isActive={index === currentStep}
            isCompleted={index < currentStep}
          />
        ))}
      </div>

      {/* Demo Button */}
      <div className="text-center mt-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleNext}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          {currentStep === steps.length - 1 ? "Restart Demo" : "Next Step"}
        </motion.button>
      </div>
    </div>
  );
}; 