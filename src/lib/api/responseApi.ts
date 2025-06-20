import { 
  SubmitAnswerRequest, 
  UserResponse, 
  SaveUserResponsesBulkRequest,
  QuestionsWithAnswersResponse
} from './types/assessment';
import { mockQuestions } from '../mock/mockData';

export const submitAnswer = async (data: SubmitAnswerRequest): Promise<UserResponse> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return {
    id: `response-${Date.now()}-${Math.random()}`,
    userId: "mock-user-id",
    questionId: data.questionId,
    responseGroupId: data.responseGroupId,
    optionId: data.answer.selectedOption?.id,
    answerText: data.answer.value,
    answerNumber: data.answer.answerNumber,
    answerBoolean: data.answer.answerBoolean,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

export const saveUserResponsesBulk = async (data: SaveUserResponsesBulkRequest): Promise<UserResponse[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return data.responses.map(response => ({
    id: `response-${Date.now()}-${Math.random()}`,
    userId: "mock-user-id",
    questionId: response.questionId,
    responseGroupId: data.responseGroupId,
    optionId: response.answer.selectedOption?.id,
    answerText: response.answer.value,
    answerNumber: response.answer.answerNumber,
    answerBoolean: response.answer.answerBoolean,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }));
};

export const getQuestionsWithAnswers = async (responseGroupId: string): Promise<QuestionsWithAnswersResponse> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return {
    responseGroupId,
    questionsWithAnswers: mockQuestions.map(q => ({
      id: q.id,
      questionText: q.questionText,
      whyWeAsk: q.whyWeAsk,
      questionType: q.questionType,
      category: {
        id: q.category.id,
        name: q.category.name,
        description: q.category.description
      },
      options: q.options,
      visibilityRules: q.visibilityRules,
      required: q.required,
      placeholder: q.placeholder,
      sliderConfig: q.sliderConfig,
      answer: {
        id: `answer-${q.id}`,
        value: q.questionType === "number" ? "1000" : undefined,
        selectedOption: q.questionType === "multiple_choice" && q.options?.length > 0
          ? { id: q.options[0].id, text: q.options[0].optionLabel }
          : undefined
      },
      optionMetadata: q.questionType === "multiple_choice"
        ? {
            points: 70,
            profileType: 70,
            decisionStyle: 75,
            confidenceScore: 85
          }
        : undefined
    }))
  };
};
