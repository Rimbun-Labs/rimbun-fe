import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare, 
  Sparkles, 
  ArrowRight, 
  Lightbulb,
  TrendingUp,
  BookOpen,
  CheckCircle,
  Brain
} from 'lucide-react';
import { QuizResult } from '@/lib/api/types/quiz';

interface QuizToChatTransitionProps {
  quizResult: QuizResult;
  assetClass: string;
  onStartChat: (context: ChatContext) => void;
  onContinueLearning: () => void;
  onRetakeQuiz: () => void;
}

interface ChatContext {
  assetClass: string;
  quizScore: number;
  performanceLevel: string;
  suggestedPrompts: string[];
  learningGaps?: string[];
}

export const QuizToChatTransition: React.FC<QuizToChatTransitionProps> = ({
  quizResult,
  assetClass,
  onStartChat,
  onContinueLearning,
  onRetakeQuiz
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showTransition, setShowTransition] = useState(false);

  const score = quizResult.score || 0;
  const totalQuestions = quizResult.totalQuestions || 0;
  const correctAnswers = quizResult.correctAnswers || 0;

  // Determine performance level
  const getPerformanceLevel = () => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Great';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Fair';
    return 'Needs Improvement';
  };

  const performanceLevel = getPerformanceLevel();

  // Generate chat context based on quiz results
  const generateChatContext = (): ChatContext => {
    const basePrompts = [
      "How can I apply this knowledge to real investments?",
      "What are the next concepts I should learn?",
      "Can you suggest some practical strategies?"
    ];

    let specificPrompts = basePrompts;
    let learningGaps: string[] = [];

    if (score < 70) {
      specificPrompts = [
        "I'm struggling with this topic. Can you explain the basics?",
        "What are the fundamental concepts I should focus on?",
        "Can you recommend some beginner-friendly resources?"
      ];
      
      // Identify learning gaps based on incorrect answers
      if (quizResult.answers) {
        learningGaps = quizResult.answers
          .filter(answer => !answer.isCorrect)
          .map((answer, index) => `Question ${index + 1} concept`);
      }
    } else if (score >= 80) {
      specificPrompts = [
        "How can I apply this knowledge to real investments?",
        "What are the next advanced concepts I should learn?",
        "Can you suggest some practical strategies based on my knowledge?"
      ];
    }

    return {
      assetClass,
      quizScore: score,
      performanceLevel,
      suggestedPrompts: specificPrompts,
      learningGaps
    };
  };

  const chatContext = generateChatContext();

  // Auto-advance through transition steps
  useEffect(() => {
    if (showTransition) {
      const timer = setTimeout(() => {
        if (currentStep < 2) {
          setCurrentStep(prev => prev + 1);
        }
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [currentStep, showTransition]);

  const handleStartChat = () => {
    onStartChat(chatContext);
  };

  const transitionSteps = [
    {
      title: "Analyzing Your Results",
      description: "Understanding your performance patterns and knowledge gaps",
      icon: Brain,
      color: "text-primary"
    },
    {
      title: "Preparing Chat Context",
      description: "Setting up personalized learning recommendations",
      icon: MessageSquare,
      color: "text-primary"
    },
    {
      title: "Ready for AI Chat",
      description: "Your personalized learning assistant is ready",
      icon: Sparkles,
      color: "text-primary"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Transition Steps */}
      <Card className="border-2 border-primary/20 shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-xl">
            <Sparkles className="h-6 w-6 text-primary" />
            Preparing Your Learning Experience
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transitionSteps.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ 
                    opacity: isActive || isCompleted ? 1 : 0.5,
                    x: 0
                  }}
                  transition={{ duration: 0.5 }}
                  className={`flex items-center space-x-4 p-4 rounded-lg transition-all ${
                    isActive ? 'bg-primary/10 border border-primary/20' : 
                    isCompleted ? 'bg-green-100 border border-green-200 dark:bg-green-900/20 dark:border-green-800' : 
                    'bg-muted/30'
                  }`}
                >
                  <div className={`p-2 rounded-full ${
                    isCompleted ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400' :
                    isActive ? 'bg-primary/20 text-primary' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    <StepIcon className={`h-5 w-5 ${step.color}`} />
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-medium ${
                      isActive ? 'text-primary' : 
                      isCompleted ? 'text-green-700 dark:text-green-200' : 
                      'text-muted-foreground'
                    }`}>
                      {step.title}
                    </h4>
                    <p className={`text-sm ${
                      isActive ? 'text-primary/80' : 
                      isCompleted ? 'text-green-600 dark:text-green-400' : 
                      'text-muted-foreground'
                    }`}>
                      {step.description}
                    </p>
                  </div>
                  {isCompleted && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Action Panel */}
      <AnimatePresence>
        {currentStep >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Ready to Continue Learning?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Start Chat Button */}
                  <Button
                    onClick={handleStartChat}
                    className="h-16 text-base bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                    size="lg"
                  >
                    <MessageSquare className="h-5 w-5 mr-2" />
                    Start AI Chat
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>

                  {/* Continue Learning Button */}
                  <Button
                    onClick={onContinueLearning}
                    variant="outline"
                    className="h-16 text-base"
                    size="lg"
                  >
                    <BookOpen className="h-5 w-5 mr-2" />
                    Continue Learning
                  </Button>

                  {/* Retake Quiz Button */}
                  <Button
                    onClick={onRetakeQuiz}
                    variant="outline"
                    className="h-16 text-base"
                    size="lg"
                  >
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Retake Quiz
                  </Button>
                </div>

                {/* Context Summary */}
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-medium mb-2 text-sm text-muted-foreground">
                    Your AI Chat Context:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{assetClass.replace('_', ' ')}</Badge>
                    <Badge variant="secondary">{performanceLevel} Performance</Badge>
                    <Badge variant="secondary">{score}% Score</Badge>
                    {chatContext.learningGaps && chatContext.learningGaps.length > 0 && (
                      <Badge variant="destructive">
                        {chatContext.learningGaps.length} Areas to Improve
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuizToChatTransition; 