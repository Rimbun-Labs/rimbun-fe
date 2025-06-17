import { apiClient } from './client';
import { Question } from './types/assessment';
import { QuizResult, QuizAttempt, QuizProgressDto, QuizAnswer } from './types/quiz';

// Helper function to normalize asset class to match backend enum
const normalizeAssetClass = (assetClass: string): string => {
  // Convert to uppercase and handle special case for REAL_ESTATE
  const upper = assetClass.toUpperCase();
  return upper === 'REALESTATE' ? 'REAL_ESTATE' : upper;
};

// Transform backend question format to frontend format
const transformQuestion = (backendQuestion: any): Question => {
  return {
    id: backendQuestion.id,
    questionText: backendQuestion.question,
    questionType: 'single_choice',
    options: backendQuestion.options.map((opt: string, index: number) => ({
      id: `opt_${index}`,
      optionLabel: opt
    })),
    correctAnswer: `opt_${backendQuestion.correct}`
  };
};

// Transform frontend answer format to backend format
const transformAnswer = (frontendAnswer: QuizAnswer) => {
  return {
    questionId: frontendAnswer.questionId,
    selectedOption: parseInt(frontendAnswer.selectedAnswer.split('_')[1])
  };
};

export const getQuizQuestions = async (assetClass: string, responseGroupId: string): Promise<Question[]> => {
  try {
    const normalizedAssetClass = normalizeAssetClass(assetClass);
    console.log('Fetching quiz questions:', {
      assetClass: normalizedAssetClass,
      responseGroupId,
      url: `/quiz/${normalizedAssetClass}?responseGroupId=${responseGroupId}`
    });

    const response = await apiClient.get<{ questions: any[]; profile?: string }>(
      `/quiz/${normalizedAssetClass}?responseGroupId=${responseGroupId}`
    );
    
    console.log('Quiz questions response:', response.data);
    
    // Transform backend questions to frontend format
    return response.data.questions.map(transformQuestion);
  } catch (error: any) {
    console.error('Error fetching quiz questions:', {
      error,
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw new Error(error.response?.data?.message || 'Failed to fetch quiz questions. Please try again.');
  }
};

export const submitQuizAttempt = async (
  assetClass: string,
  responseGroupId: string,
  answers: QuizAnswer[]
): Promise<QuizProgressDto> => {
  try {
    const normalizedAssetClass = normalizeAssetClass(assetClass);
    console.log('Submitting quiz attempt:', {
      assetClass: normalizedAssetClass,
      responseGroupId,
      answers: answers.map(transformAnswer)
    });

    const response = await apiClient.post<QuizProgressDto>('/quiz/submit', {
      assetClass: normalizedAssetClass,
      responseGroupId,
      answers: answers.map(transformAnswer),
      completedAt: new Date().toISOString()
    });

    console.log('Quiz submission response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error submitting quiz attempt:', {
      error,
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw new Error(error.response?.data?.message || 'Failed to submit quiz. Please try again.');
  }
};

export const getQuizProgress = async (
  userId: string,
  assetClass: string
): Promise<QuizProgressDto | null> => {
  try {
    const normalizedAssetClass = normalizeAssetClass(assetClass);
    console.log('Fetching quiz progress:', {
      userId,
      assetClass: normalizedAssetClass,
      url: `/quiz/progress?userId=${userId}&assetClass=${normalizedAssetClass}`
    });

    const response = await apiClient.get<QuizProgressDto | null>(
      `/quiz/progress?userId=${userId}&assetClass=${normalizedAssetClass}`
    );

    console.log('Quiz progress response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching quiz progress:', {
      error,
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw new Error(error.response?.data?.message || 'Failed to fetch quiz progress. Please try again.');
  }
};

export const getQuizHistory = async (assetClass: string): Promise<QuizAttempt[]> => {
  try {
    const normalizedAssetClass = normalizeAssetClass(assetClass);
    console.log('Fetching quiz history:', {
      assetClass: normalizedAssetClass,
      url: `/quiz/${normalizedAssetClass}/history`
    });

    const response = await apiClient.get<QuizAttempt[]>(`/quiz/${normalizedAssetClass}/history`);
    
    console.log('Quiz history response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching quiz history:', {
      error,
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw new Error(error.response?.data?.message || 'Failed to fetch quiz history. Please try again.');
  }
};

// For development, we'll use mock data
export const mockQuizQuestions: Question[] = [
  {
    id: 'q1',
    questionText: 'What is the primary purpose of a Cap Rate in real estate investment?',
    questionType: 'single_choice',
    options: [
      { id: 'a1', optionLabel: 'To measure property appreciation' },
      { id: 'a2', optionLabel: 'To calculate annual return on investment' },
      { id: 'a3', optionLabel: 'To determine property taxes' },
      { id: 'a4', optionLabel: 'To assess market demand' }
    ],
    correctAnswer: 'a2'
  },
  {
    id: 'q2',
    questionText: 'Which of the following is NOT typically included in NOI (Net Operating Income)?',
    questionType: 'single_choice',
    options: [
      { id: 'a1', optionLabel: 'Rental income' },
      { id: 'a2', optionLabel: 'Operating expenses' },
      { id: 'a3', optionLabel: 'Mortgage payments' },
      { id: 'a4', optionLabel: 'Property management fees' }
    ],
    correctAnswer: 'a3'
  }
]; 