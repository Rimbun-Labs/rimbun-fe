import axios from 'axios';
import { CreateResponseGroupRequest, ResponseGroup } from './types/assessment';

const API_BASE_URL = 'http://localhost:3001/api/v1';

const isMockEnvironment = () => {
  const host = window.location.hostname;
  return host.includes('lovable') || host.includes('preview');
};

const createMockSession = async (data?: CreateResponseGroupRequest): Promise<ResponseGroup> => {
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

export const createSession = async (data?: CreateResponseGroupRequest): Promise<ResponseGroup> => {
  if (isMockEnvironment()) {
    return createMockSession(data);
  }

  try {
    const response = await axios.post<ResponseGroup>(
      `${API_BASE_URL}/user-responses/session`,
      {
        userId: data?.userId || "175041a5-5b00-40d7-993b-300f03b2b479", // Default user ID if not provided
        questionnaireType: data?.questionnaireType || "ONBOARDING",
        description: "Investment Profile Assessment Session"
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Failed to create session:', error);
    throw new Error('Failed to create assessment session');
  }
};
