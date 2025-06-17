import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface RecommendationCardProps {
  title: string;
  description: string;
  priority: "High" | "Medium" | "Low";
  category: string;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({
  title,
  description,
  priority,
  category,
}) => {
  const getPriorityColor = () => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200";
      case "Low":
        return "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  return (
    <Card className="h-full hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          <Badge className={cn(getPriorityColor(), "font-medium")}>{priority}</Badge>
        </div>
        <CardDescription className="text-muted-foreground dark:text-[hsl(var(--card-description))]">
          {category}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground dark:text-[hsl(var(--card-description))]">
          {description}
        </p>
      </CardContent>
    </Card>
  );
};

export default RecommendationCard;
