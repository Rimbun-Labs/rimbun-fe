
import { AssessmentResult, Question } from '../api/assessmentApi';

export const mockQuestions: Question[] = [
  {
    id: "q1",
    questionText: "What is your primary investment goal?",
    questionType: "multiple_choice",
    category: {
      id: "cat1",
      name: "Investment Goals",
      description: "Understanding your financial objectives"
    },
    options: [
      { id: "q1-opt1", text: "Capital preservation" },
      { id: "q1-opt2", text: "Income generation" },
      { id: "q1-opt3", text: "Balanced growth" },
      { id: "q1-opt4", text: "Aggressive growth" },
      { id: "q1-opt5", text: "Speculation" }
    ]
  },
  {
    id: "q2",
    questionText: "How long do you plan to invest your money before you need it?",
    questionType: "multiple_choice",
    category: {
      id: "cat2",
      name: "Time Horizon",
      description: "Understanding your investment timeframe"
    },
    options: [
      { id: "q2-opt1", text: "Less than 1 year" },
      { id: "q2-opt2", text: "1-3 years" },
      { id: "q2-opt3", text: "3-5 years" },
      { id: "q2-opt4", text: "5-10 years" },
      { id: "q2-opt5", text: "More than 10 years" }
    ]
  },
  {
    id: "q3",
    questionText: "How would you react if your investment portfolio lost 20% of its value in a month?",
    questionType: "multiple_choice",
    category: {
      id: "cat3",
      name: "Risk Tolerance",
      description: "Understanding how you handle financial volatility"
    },
    options: [
      { id: "q3-opt1", text: "Sell everything and move to cash" },
      { id: "q3-opt2", text: "Sell some investments to reduce risk" },
      { id: "q3-opt3", text: "Do nothing and wait for recovery" },
      { id: "q3-opt4", text: "Buy more while prices are lower" },
      { id: "q3-opt5", text: "Significantly increase investment amount" }
    ]
  },
  {
    id: "q4",
    questionText: "How much investing experience do you have?",
    questionType: "multiple_choice",
    category: {
      id: "cat4",
      name: "Investment Experience",
      description: "Understanding your familiarity with financial markets"
    },
    options: [
      { id: "q4-opt1", text: "None" },
      { id: "q4-opt2", text: "Limited" },
      { id: "q4-opt3", text: "Moderate" },
      { id: "q4-opt4", text: "Experienced" },
      { id: "q4-opt5", text: "Very experienced" }
    ]
  },
  {
    id: "q5",
    questionText: "What percentage of your monthly income can you save for investing?",
    questionType: "number",
    category: {
      id: "cat5",
      name: "Financial Capacity",
      description: "Understanding your ability to invest"
    }
  }
];

export const mockAssessmentResult: AssessmentResult = {
  riskProfile: 7.2,
  knowledgeLevel: 6.5,
  leverageAptitude: 5.8,
  decisionStyleScore: 8.1,
  personalityScore: 7.5,
  finalScore: 7.0,
  profile: "Growth-oriented investor"
};

export const mockPortfolioAllocation = [
  { name: "Stocks", value: 60 },
  { name: "Bonds", value: 25 },
  { name: "Cash", value: 10 },
  { name: "Alternatives", value: 5 }
];

export const mockLearningModules = [
  {
    id: "module1",
    title: "Investment Basics",
    description: "Learn fundamental concepts about investing",
    progress: 100,
    totalLessons: 5,
    completedLessons: 5,
    imageUrl: "https://images.unsplash.com/photo-1591696205602-2f950c417cb9?auto=format&fit=crop&q=80&w=1000"
  },
  {
    id: "module2",
    title: "Stock Market Fundamentals",
    description: "Understanding how stocks work",
    progress: 60,
    totalLessons: 10,
    completedLessons: 6,
    imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=1000"
  },
  {
    id: "module3",
    title: "Fixed Income Securities",
    description: "Learn about bonds and other fixed income investments",
    progress: 20,
    totalLessons: 5,
    completedLessons: 1,
    imageUrl: "https://images.unsplash.com/photo-1579621970590-9d624316904b?auto=format&fit=crop&q=80&w=1000"
  },
  {
    id: "module4",
    title: "Portfolio Diversification",
    description: "Strategies for building a balanced portfolio",
    progress: 0,
    totalLessons: 4,
    completedLessons: 0,
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1000"
  }
];

export const mockRecommendations = [
  {
    id: "rec1",
    title: "Increase Your Emergency Fund",
    description: "We recommend building up 3-6 months of living expenses in a high-yield savings account.",
    priority: "High",
    category: "Financial Planning"
  },
  {
    id: "rec2",
    title: "Consider Index Funds",
    description: "Based on your profile, low-cost index funds would be a good fit for your investment style.",
    priority: "Medium",
    category: "Investment Strategy"
  },
  {
    id: "rec3",
    title: "Learn About ETFs",
    description: "Complete our ETF learning module to understand this investment vehicle that aligns with your goals.",
    priority: "Medium",
    category: "Education"
  }
];
