import axios from 'axios';
import { CreateResponseGroupRequest, ResponseGroup } from './types/assessment';
import { config } from './config';
import { supabase } from '../supabase/client';

const createMockSession = async (data?: CreateResponseGroupRequest): Promise<ResponseGroup> => {
  await new Promise(resolve => setTimeout(resolve, 500)); // Add delay to simulate network
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
  if (config.isMock) {
    return createMockSession(data);
  }

  // Get the current authenticated user from Supabase
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError) {
    console.error('Error getting authenticated user:', userError);
    throw new Error('Failed to get authenticated user');
  }
  
  if (!user) {
    throw new Error('User must be authenticated to create a session');
  }

  try {
    console.log('Creating session with authenticated user ID:', user.id);
    
    const response = await axios.post<ResponseGroup>(
      `${config.API_BASE_URL}/user-responses/session`,
      {
        userId: data?.userId || user.id, // Use the authenticated user's ID instead of hardcoded one
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
    
    console.log('Session created successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to create session:', error);
    throw new Error('Failed to create assessment session');
  }
};