import axios from 'axios';
import { CreateResponseGroupRequest, ResponseGroup } from './types/assessment';
import { config } from './config';
import { userService } from './userService';
import { auth } from '../firebase/config';

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

  // Get the current authenticated user from Firebase
  const user = auth.currentUser;
  
  if (!user) {
    throw new Error('User must be authenticated to create a session');
  }

  try {
    // Get the database user ID from localStorage (set during user registration)
    const databaseUserId = userService.getDatabaseUserId();
    
    if (!databaseUserId) {
      console.error('❌ No database user ID found. User may not be registered in backend.');
      throw new Error('User not registered in backend. Please try logging in again.');
    }

    console.log('🔵 Creating session with database user ID:', databaseUserId);
    console.log('🔵 Firebase user ID:', user.uid);
    
    const response = await axios.post<ResponseGroup>(
      `${config.API_BASE_URL}/user-responses/session`,
      {
        userId: databaseUserId, // Use database user ID, not Firebase user ID
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
    
    console.log('✅ Session created successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Failed to create session:', error);
    throw new Error('Failed to create assessment session');
  }
}