import { BarChart, LayoutDashboard, BookOpen } from "lucide-react";
import { FeatureCard } from "./FeatureCard";
import { cn } from "@/lib/utils";

interface FeaturesSectionProps {
  className?: string;
}

const features = [
  {
    title: "1. Complete Assessment",
    description: "Answer questions about your financial goals, risk tolerance, and investment knowledge.",
    icon: BarChart,
    color: "blue" as const
  },
  {
    title: "2. Get Insights",
    description: "Receive your personalized investment profile and tailored recommendations.",
    icon: LayoutDashboard,
    color: "purple" as const
  },
  {
    title: "3. Learn & Improve",
    description: "Access educational modules customized to your knowledge gaps and financial goals.",
    icon: BookOpen,
    color: "green" as const
  }
];

export const FeaturesSection = ({ className }: FeaturesSectionProps) => {
  return (
    <section className={cn("py-12 md:py-16 bg-secondary/30", className)}>
      <div className="container px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold">How Investlearn Works</h2>
          <p className="text-muted-foreground mt-2">
            A journey to financial knowledge and confidence
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              {...feature}
              className={cn(
                index === features.length - 1 && "sm:col-span-2 lg:col-span-1"
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}; 