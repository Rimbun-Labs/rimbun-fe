
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";

interface ModuleCardProps {
  id: string;
  title: string;
  description: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  imageUrl: string;
}

const ModuleCard: React.FC<ModuleCardProps> = ({
  id,
  title,
  description,
  progress,
  totalLessons,
  completedLessons,
  imageUrl,
}) => {
  return (
    <Card className="h-full overflow-hidden flex flex-col">
      <div
        className="h-40 bg-cover bg-center"
        style={{ backgroundImage: `url(${imageUrl})` }}
      ></div>
      <CardHeader className="pb-2">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {completedLessons} of {totalLessons} lessons completed
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link to={`/learning/${id}`}>
            {progress === 0 ? "Start Learning" : progress === 100 ? "Review Module" : "Continue Learning"}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ModuleCard;
