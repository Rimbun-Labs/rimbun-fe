
import apiClient from './client';
import { toast } from '@/components/ui/use-toast';

export interface Question {
  id: string;
  questionText: string;
  questionType: 'multiple_choice' | 'number' | 'boolean';
  category: {
    id: string;
    name: string;
    description: string;
  };
  options?: Array<{
    id: string;
    text: string;
  }>;
}

export interface UserAnswer {
  questionId: string;
  answer: string | string[] | number | boolean;
}

export interface SessionResponse {
  id: string;
  created: string;
  status: 'in_progress' | 'completed';
}

export interface AssessmentResult {
  riskProfile: number;
  knowledgeLevel: number;
  leverageAptitude: number;
  decisionStyleScore: number;
  personalityScore: number;
  finalScore: number;
  profile: string;
}

// Fetch all assessment questions
export const fetchQuestions = async (): Promise<Question[]> => {
  try {
    const response = await apiClient.get('/api/v1/questionnaire/questions');
    return response.data;
  } catch (error) {
    console.error('Error fetching questions:', error);
    toast({
      title: "Error",
      description: "Failed to load assessment questions. Please try again.",
      variant: "destructive",
    });
    throw error;
  }
};

// Create a new assessment session
export const createSession = async (): Promise<SessionResponse> => {
  try {
    const response = await apiClient.post('/api/v1/user-responses/session');
    return response.data;
  } catch (error) {
    console.error('Error creating session:', error);
    toast({
      title: "Error",
      description: "Failed to start assessment session. Please try again.",
      variant: "destructive",
    });
    throw error;
  }
};

// Submit an answer for a question
export const submitAnswer = async (
  sessionId: string,
  answer: UserAnswer
): Promise<void> => {
  try {
    await apiClient.post('/api/v1/user-responses/answer', {
      sessionId,
      ...answer,
    });
  } catch (error) {
    console.error('Error submitting answer:', error);
    toast({
      title: "Error",
      description: "Failed to submit your answer. Please try again.",
      variant: "destructive",
    });
    throw error;
  }
};

// Get assessment results for a completed session
export const getAssessmentResults = async (
  sessionId: string
): Promise<AssessmentResult> => {
  try {
    const response = await apiClient.get(`/api/v1/assessment/response-group/${sessionId}/score`);
    return response.data;
  } catch (error) {
    console.error('Error fetching assessment results:', error);
    toast({
      title: "Error",
      description: "Failed to load your assessment results. Please try again.",
      variant: "destructive",
    });
    throw error;
  }
};

// Get all answers for a session
export const getSessionAnswers = async (
  sessionId: string
): Promise<UserAnswer[]> => {
  try {
    const response = await apiClient.get(`/api/v1/assessment/response-group/${sessionId}/answers`);
    return response.data;
  } catch (error) {
    console.error('Error fetching session answers:', error);
    toast({
      title: "Error",
      description: "Failed to load your previous answers. Please try again.",
      variant: "destructive",
    });
    throw error;
  }
};
