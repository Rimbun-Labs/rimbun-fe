import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle2, 
  XCircle, 
  MessageSquare, 
  RotateCcw, 
  BookOpen,
  TrendingUp,
  Lightbulb,
  ArrowRight,
  Trophy,
  Target
} from 'lucide-react';
import { QuizResult } from '@/lib/api/types/quiz';

interface QuizResultsProps {
  result: QuizResult;
  assetClass: string;
  onNextStep: (action: 'chat' | 'retake' | 'learn') => void;
  onChatPrompt?: (prompt: string) => void;
}

export const QuizResults: React.FC<QuizResultsProps> = ({ 
  result, 
  assetClass, 
  onNextStep,
  onChatPrompt 
}) => {
  const score = result.score || 0;
  const totalQuestions = result.totalQuestions || 0;
  const correctAnswers = result.correctAnswers || 0;
  
  // Determine performance level and messaging
  const getPerformanceLevel = () => {
    if (score >= 90) return { level: 'Excellent', color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200', icon: Trophy };
    if (score >= 80) return { level: 'Great', color: 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground', icon: TrendingUp };
    if (score >= 70) return { level: 'Good', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-200', icon: Target };
    if (score >= 60) return { level: 'Fair', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-200', icon: Lightbulb };
    return { level: 'Needs Improvement', color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200', icon: BookOpen };
  };

  const performance = getPerformanceLevel();
  const PerformanceIcon = performance.icon;

  // Generate next steps based on performance
  const getNextSteps = () => {
    if (score >= 80) {
      return {
        message: "Great job! You have a solid understanding of this topic.",
        primaryAction: 'chat' as const,
        secondaryAction: 'learn' as const,
        chatPrompts: [
          "How can I apply this knowledge to real investments?",
          "What are the next advanced concepts I should learn?",
          "Can you suggest some practical strategies based on my knowledge?"
        ]
      };
    } else if (score >= 60) {
      return {
        message: "Good effort! Let's strengthen your understanding.",
        primaryAction: 'learn' as const,
        secondaryAction: 'chat' as const,
        chatPrompts: [
          "Can you explain the concepts I missed in simpler terms?",
          "What resources would help me improve my understanding?",
          "How can I practice these concepts?"
        ]
      };
    } else {
      return {
        message: "Let's focus on building a strong foundation.",
        primaryAction: 'learn' as const,
        secondaryAction: 'retake' as const,
        chatPrompts: [
          "I'm struggling with this topic. Can you help me understand the basics?",
          "What are the fundamental concepts I should focus on first?",
          "Can you recommend some beginner-friendly resources?"
        ]
      };
    }
  };

  const nextSteps = getNextSteps();

  const handleChatPrompt = (prompt: string) => {
    if (onChatPrompt) {
      onChatPrompt(prompt);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Score Overview */}
      <Card className="border-2 border-primary/20 shadow-lg">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-center mb-4">
            <div className={`p-3 rounded-full ${performance.color} mr-3`}>
              <PerformanceIcon className="h-8 w-8" />
            </div>
            <div>
              <CardTitle className="text-2xl mb-1">{performance.level}</CardTitle>
              <Badge variant="secondary" className="text-sm">
                {assetClass.replace('_', ' ')} Quiz
              </Badge>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="text-4xl font-bold text-primary">{score}%</div>
            <Progress value={score} className="h-3" />
            <div className="text-sm text-muted-foreground">
              {correctAnswers} of {totalQuestions} questions correct
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Detailed Results */}
      {result.answers && result.answers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Question Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {result.answers.map((answer, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50">
                  {answer.isCorrect ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">Question {index + 1}</span>
                      <Badge variant={answer.isCorrect ? "default" : "destructive"}>
                        {answer.isCorrect ? "Correct" : "Incorrect"}
                      </Badge>
                    </div>
                    {answer.explanation && (
                      <p className="text-sm text-muted-foreground">{answer.explanation}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Next Steps */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            Next Steps
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">{nextSteps.message}</p>
          
          {/* Primary Action */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={() => onNextStep(nextSteps.primaryAction)}
              className="flex-1 h-12 text-base"
              size="lg"
            >
              {nextSteps.primaryAction === 'chat' && (
                <>
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Start AI Chat
                </>
              )}
              {nextSteps.primaryAction === 'learn' && (
                <>
                  <BookOpen className="h-5 w-5 mr-2" />
                  Continue Learning
                </>
              )}
              {nextSteps.primaryAction === 'retake' && (
                <>
                  <RotateCcw className="h-5 w-5 mr-2" />
                  Retake Quiz
                </>
              )}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>

            {/* Secondary Action */}
            <Button 
              onClick={() => onNextStep(nextSteps.secondaryAction)}
              variant="outline"
              className="flex-1 h-12 text-base"
              size="lg"
            >
              {nextSteps.secondaryAction === 'chat' && (
                <>
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Ask AI Questions
                </>
              )}
              {nextSteps.secondaryAction === 'learn' && (
                <>
                  <BookOpen className="h-5 w-5 mr-2" />
                  Explore Topics
                </>
              )}
              {nextSteps.secondaryAction === 'retake' && (
                <>
                  <RotateCcw className="h-5 w-5 mr-2" />
                  Try Again
                </>
              )}
            </Button>
          </div>

          {/* Suggested Chat Prompts */}
          {nextSteps.chatPrompts && nextSteps.chatPrompts.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-muted-foreground">
                Suggested questions for AI chat:
              </h4>
              <div className="flex flex-wrap gap-2">
                {nextSteps.chatPrompts.map((prompt, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    onClick={() => handleChatPrompt(prompt)}
                    className="text-xs h-8 px-3 border border-dashed border-muted-foreground/30 hover:border-primary/50"
                  >
                    {prompt}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizResults; 