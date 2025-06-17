import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: "blue" | "purple" | "green";
  className?: string;
}

const colorStyles = {
  blue: {
    border: "bg-blue-500",
    icon: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-100 dark:bg-blue-900/30"
  },
  purple: {
    border: "bg-purple-500",
    icon: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-100 dark:bg-purple-900/30"
  },
  green: {
    border: "bg-green-500",
    icon: "text-green-600 dark:text-green-400",
    bg: "bg-green-100 dark:bg-green-900/30"
  }
};

export const FeatureCard = ({ 
  title, 
  description, 
  icon: Icon, 
  color,
  className 
}: FeatureCardProps) => {
  const styles = colorStyles[color];

  return (
    <Card className={cn("relative overflow-hidden group hover:shadow-lg transition-all duration-200", className)}>
      {/* Colored border */}
      <div className={cn("absolute top-0 left-0 w-1 h-full", styles.border)}></div>
      
      <CardContent className="p-6">
        {/* Icon */}
        <div className={cn(
          "mb-4 w-10 h-10 rounded-full flex items-center justify-center transition-transform duration-200 group-hover:scale-110",
          styles.bg
        )}>
          <Icon className={cn("h-5 w-5", styles.icon)} />
        </div>

        {/* Content */}
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-muted-foreground">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}; 