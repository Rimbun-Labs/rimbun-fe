
import { Progress } from "@/components/ui/progress";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  const progress = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="w-full max-w-3xl mx-auto mb-8">
      <div className="flex justify-between mb-2 text-sm">
        <span className="font-medium">Question {currentStep} of {totalSteps}</span>
        <span>{progress}% Complete</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
};

export default ProgressBar;
