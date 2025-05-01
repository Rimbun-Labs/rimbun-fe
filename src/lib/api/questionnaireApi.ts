import axios from 'axios';
import { Question } from './types/assessment';
import { mockQuestions } from '../mock/mockQuestions';

const API_BASE_URL = 'http://localhost:3001/api/v1';

const isMockEnvironment = () => {
  const host = window.location.hostname;
  return host.includes('lovable') || host.includes('preview');
};

// Helper function to sort questions by category order
const sortQuestionsByCategory = (questions: Question[]): Question[] => {
  // Define the preferred category order
  const categoryOrder = [
    "Getting to Know You",
    "Dream Building",
    "Your Financial Picture",
    "Risk Profile X",
    "Financial Knowledge",
    "Leverage Aptitude",
    "Market Understanding"
  ];

  // Create a map for quick category index lookup
  const categoryOrderMap = new Map(
    categoryOrder.map((category, index) => [category, index])
  );

  return [...questions].sort((a, b) => {
    const categoryA = categoryOrderMap.get(a.category.name) ?? Number.MAX_VALUE;
    const categoryB = categoryOrderMap.get(b.category.name) ?? Number.MAX_VALUE;
    
    if (categoryA === categoryB) {
      // If in the same category, maintain the original order
      return questions.indexOf(a) - questions.indexOf(b);
    }
    
    return categoryA - categoryB;
  });
};

export const getQuestions = async (): Promise<Question[]> => {
  if (isMockEnvironment()) {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    return sortQuestionsByCategory(mockQuestions);
  }

  try {
    const response = await axios.get<Question[]>(
      `${API_BASE_URL}/questionnaire/questions`,
      {
        headers: {
          'Accept': 'application/json'
        }
      }
    );
    
    return sortQuestionsByCategory(response.data);
  } catch (error) {
    console.error('Failed to fetch questions:', error);
    throw new Error('Failed to fetch assessment questions');
  }
}; 