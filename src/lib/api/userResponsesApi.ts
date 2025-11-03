import { Question, QuestionType, SaveUserResponseRequest, UserSession } from './types/assessment';
import { apiClient } from './client';
import { config } from './config';

// UUID validation regex
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const isValidUUID = (uuid: string): boolean => {
  return UUID_REGEX.test(uuid);
};

const validateRequest = (request: SaveUserResponseRequest): void => {
  if (!isValidUUID(request.responseGroupId)) {
    throw new Error('Invalid responseGroupId: Must be a valid UUID');
  }
  if (!isValidUUID(request.questionId)) {
    throw new Error('Invalid questionId: Must be a valid UUID');
  }
  if (typeof request.answer !== 'string') {
    throw new Error('Answer must be a string');
  }
};

const formatAnswerForApi = (value: any, questionType: QuestionType, question?: Question): string => {
  if (value === null || value === undefined) return '';

  // Handle case where value is an object with a value property
  if (value && typeof value === 'object' && 'value' in value) {
    value = value.value;
  }

  let formattedAnswer: string;
  switch (questionType) {
    case 'multiple_choice':
    case 'select':
      // Convert option label to option ID if question data is available
      if (question?.options) {
        const selectedOption = question.options.find(opt => opt.optionLabel === value);
        formattedAnswer = selectedOption?.id || String(value);
      } else {
        formattedAnswer = String(value);
      }
      break;

    case 'number':
      formattedAnswer = value.toString();
      break;

    case 'boolean':
      // Ensure boolean values are sent as strings
      formattedAnswer = value ? 'true' : 'false';
      break;

    case 'single_text':
    default:
      formattedAnswer = String(value);
  }

  return formattedAnswer;
};

const submitAnswer = async (response: SaveUserResponseRequest): Promise<void> => {
  try {
    // Validate the request before sending
    validateRequest(response);

    // Ensure the answer is a string and not wrapped in an object
    if (typeof response.answer === 'object' && response.answer !== null) {
      const answerObj = response.answer as any;
      if ('value' in answerObj) {
        response.answer = String(answerObj.value);
      } else {
        response.answer = JSON.stringify(answerObj);
      }
    }

    // Always ensure answer is a string
    if (typeof response.answer !== 'string') {
      response.answer = String(response.answer || '');
    }

    // Use apiClient instead of fetch to include Authorization header
    await apiClient.post('/user-responses/answer', response);
  } catch (error: any) {
    console.error('Error submitting answer:', error);
    if (error.response) {
      const errorData = error.response.data;
      console.error('API Error Response:', {
        status: error.response.status,
        statusText: error.response.statusText,
        errorData: errorData
      });
      throw new Error(errorData?.message || 'Failed to submit answer');
    }
    throw error;
  }
};

export const getUserSessions = async (userId: string): Promise<UserSession[]> => {
  try {
    const response = await apiClient.get<UserSession[]>(
      `/user-responses/user/${userId}/sessions`
    );
    return response.data;
  } catch (error) {
    console.error('Failed to fetch user sessions:', error);
    if (error.response) {
      console.error('Error response:', {
        status: error.response.status,
        data: error.response.data
      });
    }
    throw new Error('Failed to fetch user sessions');
  }
};

export const userResponsesApi = {
  submitAnswer,
  formatAnswerForApi,
  isValidUUID,
  getUserSessions,
}; 
