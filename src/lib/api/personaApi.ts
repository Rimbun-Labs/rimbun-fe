import { apiClient } from './client';

// Persona Preview (for gallery view)
export interface PersonaPreview {
  id: string;
  slug: string;
  name: string;
  age: number;
  title: string;
  description: string;
  preview: {
    income: string;
    savings: string;
    goals: string[];
    riskLevel: string;
    knowledgeLevel: string;
  };
}

// Persona Life Context
export interface PersonaLifeContext {
  familyStatus: 'single' | 'married' | 'married_with_children' | 'living_with_parents' | 'divorced' | 'widowed';
  livingSituation: 'renting' | 'owns_home' | 'living_with_family' | 'student_housing' | 'mortgage';
  educationLevel: 'high_school' | 'diploma' | 'bachelor' | 'postgraduate' | 'professional_certification';
  lifeStage: 'student' | 'early_career' | 'mid_career' | 'senior' | 'retired';
  dependents: number; // Number of people they financially support
  city?: string; // Optional: e.g., "Bandar Seri Begawan", "Kuala Belait"
}

// Persona Career
export interface PersonaCareer {
  jobTitle: string; // e.g., "Junior Analyst", "Marketing Manager"
  industry: string; // e.g., "Finance", "Education", "Government"
  yearsOfExperience: number;
  careerStage: 'entry' | 'mid' | 'senior' | 'executive' | 'entrepreneur' | 'retired';
  careerGoals?: string[]; // Optional: e.g., ["Advance to manager", "Start own business"]
  workStyle?: string; // Optional: e.g., "Full-time", "Part-time", "Self-employed"
}

// Persona Lifestyle
export interface PersonaLifestyle {
  hobbies: string[]; // e.g., ["Reading", "Gaming", "Travel"]
  interests: string[]; // e.g., ["Technology", "Finance", "Sports"]
  values: string[]; // e.g., ["Family first", "Financial security"]
  lifestyleType: 'minimalist' | 'moderate' | 'active' | 'luxury' | 'balanced';
  spendingPriorities: string[]; // e.g., ["Savings", "Family", "Education"]
  dailyLife?: string; // Optional: Brief description of typical day/week
  motivations?: string[]; // Optional: What drives their financial decisions
  futureAspirations?: string[]; // Optional: Long-term life goals
}

// Persona Detail (full information)
export interface PersonaDetail {
  id: string;
  slug: string;
  name: string;
  age: number;
  title: string;
  description: string;
  story: {
    background: string;
    goals: string[];
    challenges: string[];
    dailyLife?: string; // Optional
    motivations?: string[]; // Optional
    futureAspirations?: string[]; // Optional
  };
  lifeContext: PersonaLifeContext; // NEW - Required
  career: PersonaCareer; // NEW - Required
  lifestyle: PersonaLifestyle; // NEW - Required
  financialProfile: {
    monthlyIncome: number; // Backend sends number (BND amount)
    totalSavings: number; // Backend sends number (BND amount)
    monthlyExpenses: number; // Backend sends number (BND amount)
    debt?: number; // Optional debt amount
    riskProfile?: number; // Risk tolerance score (0-100)
    riskLevel: string; // Risk level description (e.g., "Moderate")
    knowledgeLevel: string; // Knowledge level description (e.g., "Beginner")
    decisionStyle?: string; // Optional decision style
    employment?: string; // Optional employment info
    location?: string; // Optional location
  };
  goals: Array<{
    id: string;
    name: string;
    type: string;
    targetAmount: number;
    currentAmount: number;
    monthlyContribution: number;
    investmentHorizon: number; // In years
    targetYear: number; // Target year (e.g., 2029)
    progress: number; // Progress percentage (0-100)
    description: string; // Enhanced: 30-50 words
    priority: number; // Priority level (1-5, where 1 is highest priority)
  }>;
  bankingProducts: Array<{
    id: string;
    productName: string;
    productType: string;
    bankName: string;
    description: string;
    keyFeatures: string[];
    alignedGoals?: string[];
    shariahCompliant?: boolean;
    interestRate?: number;
    minimumBalance?: number;
    annualFee?: number;
    score?: number;
  }>;
  investmentPortfolio: {
    allocations: {
      equities: number;
      bonds: number;
      cash: number;
      realEstate: number;
    };
    strategy: string;
    expectedReturn: string;
    riskLevel: string;
  };
  educationalContent: Array<{
    id: string;
    title: string;
    type: string;
    description: string;
    estimatedTime: string;
  }>;
  howTheyWorkTogether: string;
}

// API Response types
interface PersonasListResponse {
  data: {
    personas: PersonaPreview[];
    total: number;
  };
  meta?: {
    timestamp: number;
    version: string;
  };
}

interface PersonaDetailResponse {
  data: {
    persona: PersonaDetail;
  };
  meta?: {
    timestamp: number;
    version: string;
  };
}

// Persona API client
export const personaApi = {
  /**
   * Get all personas (gallery view)
   */
  async getAllPersonas(): Promise<PersonaPreview[]> {
    try {
      const response = await apiClient.get<PersonasListResponse>('/personas');
      return response.data.data.personas;
    } catch (error) {
      console.error('Failed to fetch personas:', error);
      throw new Error('Failed to fetch personas');
    }
  },

  /**
   * Get persona by slug
   */
  async getPersonaBySlug(slug: string): Promise<PersonaDetail> {
    try {
      const response = await apiClient.get<PersonaDetailResponse>(`/personas/${slug}`);
      return response.data.data.persona;
    } catch (error) {
      console.error(`Failed to fetch persona ${slug}:`, error);
      throw new Error(`Failed to fetch persona: ${slug}`);
    }
  },
};

