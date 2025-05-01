import { Question } from './types/assessment';

interface UserResponse {
  responseGroupId: string;
  questionId: string;
  answer: string;
}
const API_BASE_URL = 'http://localhost:3001/api/v1';

const submitAnswer = async (response: UserResponse): Promise<void> => {
  console.log("submitanswer", response)
  try {
    const res = await fetch(`${API_BASE_URL}/user-responses/answer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(response),
    });

    if (!res.ok) {
      throw new Error(`Failed to submit answer: ${res.statusText}`);
    }
  } catch (error) {
    console.error('Error submitting answer:', error);
    throw error;
  }
};

// Helper function to format answer value to string based on question type
const formatAnswerValue = (value: any, question: Question): string => {
  if (!value) return '';

  if (question.questionType === 'number') {
    return value.toString();
  }

  if (question.questionType === 'select') {
    // If the value is already an option ID, return it as is
    if (typeof value === 'string') {
      const isValidOption = question.options?.some(option => option.id === value);
      if (isValidOption) return value;
    }
    
    // If the value is an option label, find and return its ID
    const selectedOption = question.options?.find(option => option.optionLabel === value);
    if (selectedOption) {
      return selectedOption.id;
    }
    
    // If no match found, return empty string
    return '';
  }

  // For multiple_choice and boolean, return as is since they should already be strings
  return value.toString();
};

export const userResponsesApi = {
  submitAnswer,
  formatAnswerValue,
}; 