import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QuizSection, QuizResults, QuizToChatTransition } from '@/components/learning/quiz';
import { QuizResult } from '@/lib/api/types/quiz';

// Mock quiz result for demo
const mockQuizResult: QuizResult = {
  score: 75,
  totalQuestions: 10,
  correctAnswers: 7,
  answers: [
    { questionId: '1', isCorrect: true, explanation: 'Correct! This is a fundamental concept.' },
    { questionId: '2', isCorrect: true, explanation: 'Great job! You understand this well.' },
    { questionId: '3', isCorrect: false, explanation: 'This concept requires more study.' },
    { questionId: '4', isCorrect: true, explanation: 'Excellent understanding!' },
    { questionId: '5', isCorrect: true, explanation: 'You\'ve got this concept down.' },
    { questionId: '6', isCorrect: false, explanation: 'Review this topic again.' },
    { questionId: '7', isCorrect: true, explanation: 'Perfect answer!' },
    { questionId: '8', isCorrect: true, explanation: 'Strong knowledge here.' },
    { questionId: '9', isCorrect: false, explanation: 'This is an advanced concept.' },
    { questionId: '10', isCorrect: true, explanation: 'Well done on the final question!' }
  ]
};

export const QuizFlowDemo: React.FC = () => {
  const [currentView, setCurrentView] = useState<'quiz' | 'results' | 'transition'>('quiz');
  const [demoAssetClass] = useState('EQUITIES');
  const [demoResponseGroupId] = useState('demo-123');

  const handleStartChat = (context: any) => {
    console.log('Starting chat with context:', context);
    alert(`Starting AI Chat with context:\nAsset Class: ${context.assetClass}\nScore: ${context.quizScore}%\nPerformance: ${context.performanceLevel}`);
  };

  const handleContinueLearning = () => {
    console.log('Continuing learning');
    alert('Continuing with learning modules...');
  };

  const handleRetakeQuiz = () => {
    setCurrentView('quiz');
  };

  const handleClose = () => {
    setCurrentView('quiz');
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            🎯 Enhanced Quiz Flow Demo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground mb-4">
            This demo showcases the enhanced quiz-to-chat flow with personalized results and smooth transitions.
          </p>
          
          <Tabs value={currentView} onValueChange={(value) => setCurrentView(value as any)} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="quiz">Quiz Interface</TabsTrigger>
              <TabsTrigger value="results">Enhanced Results</TabsTrigger>
              <TabsTrigger value="transition">Chat Transition</TabsTrigger>
            </TabsList>
            
            <TabsContent value="quiz" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quiz Interface</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    This is the enhanced quiz interface. Complete the quiz to see the enhanced results flow.
                  </p>
                  <QuizSection
                    assetClass={demoAssetClass}
                    responseGroupId={demoResponseGroupId}
                    onClose={handleClose}
                    onStartChat={handleStartChat}
                    onContinueLearning={handleContinueLearning}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="results" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Enhanced Results Display</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    View detailed quiz results with personalized next steps and action buttons.
                  </p>
                  <QuizResults
                    result={mockQuizResult}
                    assetClass={demoAssetClass}
                    onNextStep={(action) => {
                      if (action === 'chat') {
                        setCurrentView('transition');
                      } else if (action === 'learn') {
                        handleContinueLearning();
                      } else if (action === 'retake') {
                        setCurrentView('quiz');
                      }
                    }}
                    onChatPrompt={(prompt) => {
                      console.log('Chat prompt clicked:', prompt);
                      alert(`Chat prompt: ${prompt}`);
                    }}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="transition" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quiz to Chat Transition</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Smooth transition to AI chat with personalized context and suggested prompts.
                  </p>
                  <QuizToChatTransition
                    quizResult={mockQuizResult}
                    assetClass={demoAssetClass}
                    onStartChat={handleStartChat}
                    onContinueLearning={handleContinueLearning}
                    onRetakeQuiz={handleRetakeQuiz}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="text-center">
        <Button
          onClick={() => setCurrentView('quiz')}
          variant="outline"
          className="mr-2"
        >
          Reset Demo
        </Button>
        <Button
          onClick={() => window.open('/investment-explorer', '_blank')}
          variant="default"
        >
          View Live Chat
        </Button>
      </div>
    </div>
  );
};

export default QuizFlowDemo; 