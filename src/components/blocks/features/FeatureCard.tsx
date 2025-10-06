import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: "blue" | "purple" | "green" | "orange" | "red" | "indigo";
  benefits?: string[];
  details?: string;
  className?: string;
}

const colorClasses = {
  blue: "text-primary bg-primary/10 border border-primary/20",
  purple: "text-primary bg-primary/10 border border-primary/20",
  green: "text-green-600 bg-green-100 border border-green-200 dark:bg-green-900/20 dark:text-green-200 dark:border-green-800",
  orange: "text-amber-600 bg-amber-100 border border-amber-200 dark:bg-amber-900/20 dark:text-amber-200 dark:border-amber-800",
  red: "text-red-600 bg-red-100 border border-red-200 dark:bg-red-900/20 dark:text-red-200 dark:border-red-800",
  indigo: "text-primary bg-primary/10 border border-primary/20"
};

export const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon: Icon,
  color,
  benefits = [],
  details,
  className
}) => {
  return (
    <Card className={cn("h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-border/50", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-start gap-4">
          <div className={cn("p-3 rounded-xl", colorClasses[color])}>
            <Icon className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold mb-2">{title}</CardTitle>
            <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {details && (
          <p className="text-sm text-muted-foreground leading-relaxed">
            {details}
          </p>
        )}
        
        {benefits.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground">Key Benefits:</h4>
            <ul className="space-y-1">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Check className="h-3 w-3 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 