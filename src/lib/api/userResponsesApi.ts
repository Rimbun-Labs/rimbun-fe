
import { Question, QuestionType, SaveUserResponseRequest } from './types/assessment';

const API_BASE_URL = 'http://localhost:3001/api/v1';

// UUID validation regex
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const isValidUUID = (uuid: string): boolean => {
  return UUID_REGEX.test(uuid);
};

const validateRequest = (request: SaveUserResponseRequest): void => {
  console.log('Validating request:', {
    responseGroupId: request.responseGroupId,
    questionId: request.questionId,
    answer: request.answer,
    isResponseGroupIdValid: isValidUUID(request.responseGroupId),
    isQuestionIdValid: isValidUUID(request.questionId),
    isAnswerString: typeof request.answer === 'string'
  });

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

const formatAnswerForApi = (value: any, questionType: QuestionType): string => {
  console.log('Formatting answer:', {
    originalValue: value,
    questionType,
    valueType: typeof value
  });

  if (value === null || value === undefined) return '';

  // Handle case where value is an object with a value property
  if (value && typeof value === 'object' && 'value' in value) {
    value = value.value;
  }

  let formattedAnswer: string;
  switch (questionType) {
    case 'multiple_choice':
    case 'select':
      // If the value is already an option ID, return it as is
      if (typeof value === 'string' && isValidUUID(value)) {
        formattedAnswer = value;
      }
      // If the value is an object with an id property, return the id
      else if (value && typeof value === 'object' && 'id' in value) {
        formattedAnswer = value.id;
      }
      else {
        formattedAnswer = String(value);
      }
      break;

    case 'number':
      formattedAnswer = value.toString();
      break;

    case 'boolean':
      formattedAnswer = value ? 'true' : 'false';
      break;

    case 'single_text':
    default:
      formattedAnswer = String(value);
  }

  console.log('Formatted answer:', {
    originalValue: value,
    formattedAnswer,
    questionType
  });

  return formattedAnswer;
};

const submitAnswer = async (response: SaveUserResponseRequest): Promise<void> => {
  console.log('Submitting answer to API:', {
    request: response,
    endpoint: `${API_BASE_URL}/user-responses/answer`
  });
  
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

    const res = await fetch(`${API_BASE_URL}/user-responses/answer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(response),
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error('API Error Response:', {
        status: res.status,
        statusText: res.statusText,
        errorData: errorData
      });
      throw new Error(errorData.message || 'Failed to submit answer');
    }

    console.log('Answer submitted successfully:', response);
  } catch (error) {
    console.error('Error submitting answer:', error);
    throw error;
  }
};

export const userResponsesApi = {
  submitAnswer,
  formatAnswerForApi,
  isValidUUID,
}; 
