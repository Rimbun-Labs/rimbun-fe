
import { CreateResponseGroupRequest, ResponseGroup } from './types/assessment';

export const createSession = async (data?: CreateResponseGroupRequest): Promise<ResponseGroup> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return {
    id: `response-group-${Date.now()}`,
    userId: data?.userId || "mock-user-id",
    questionnaireType: data?.questionnaireType || "ONBOARDING",
    isCompleted: false,
    metadata: data?.metadata || {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};
