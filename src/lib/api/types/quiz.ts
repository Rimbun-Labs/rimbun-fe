import { Question } from './assessment';

export interface QuizResult {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  answers?: {
    questionId: string;
    isCorrect: boolean;
    explanation?: string;
  }[];
}

export interface QuizAttempt {
  id: string;
  assetClass: string;
  result: QuizResult;
  createdAt: string;
}

export interface QuizState {
  currentQuestionIndex: number;
  answers: Record<string, string>;
  isComplete: boolean;
  result?: QuizResult;
}

export interface QuizContextType {
  questions: Question[];
  state: QuizState;
  isLoading: boolean;
  error: Error | null;
  startQuiz: () => void;
  submitAnswer: (questionId: string, answer: string) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  completeQuiz: () => void;
  resetQuiz: () => void;
} 