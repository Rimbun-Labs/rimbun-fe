
import { Question } from '../api/assessmentApi';

export const mockQuestions: Question[] = [
  {
    id: "c0189e87-8c22-4350-aed2-4bd9c4b96cb2",
    questionText: "What's your financial goal?",
    whyWeAsk: "Needed for Age-to-Goal Alignment in Investment Horizon",
    questionType: "multiple_choice",
    category: {
      id: "dream-building",
      name: "Dream Building",
      description: "Set your goals and timelines to bring your financial dreams to life."
    },
    options: [
      { id: "goal-1", text: "Retirement" },
      { id: "goal-2", text: "Home Purchase" },
      { id: "goal-3", text: "Education" },
      { id: "goal-4", text: "Wealth Building" }
    ],
    required: true
  },
  {
    id: "d2945e87-1a22-4790-bed2-4bd9c4b96cb3",
    questionText: "How much have you saved so far?",
    whyWeAsk: "Needed for Savings-to-Income Ratio in Risk Capacity",
    questionType: "number",
    category: {
      id: "dream-building",
      name: "Dream Building",
      description: "Set your goals and timelines to bring your financial dreams to life."
    },
    required: true,
    placeholder: "Enter amount in dollars"
  },
  {
    id: "e3456f87-2b33-4890-ced2-4bd9c4b96cb4",
    questionText: "In 'Farm Stand', it's planting season: A) Sell crops now (quick cash); B) Wait for harvest (bigger profit); C) Sell half now, half later (balanced); D) Try a trendy crop (risky). What's your choice?",
    whyWeAsk: "This shows how you time your decisions!",
    questionType: "multiple_choice",
    category: {
      id: "market-understanding",
      name: "Market Understanding",
      description: "Assess your market knowledge and decision-making approach"
    },
    options: [
      { id: "farm-1", text: "A) Sell crops now (quick cash)" },
      { id: "farm-2", text: "B) Wait for harvest (bigger profit)" },
      { id: "farm-3", text: "C) Sell half now, half later (balanced)" },
      { id: "farm-4", text: "D) Try a trendy crop (risky)" }
    ],
    required: true
  },
  {
    id: "f4567g87-3c44-4990-ded2-4bd9c4b96cb5",
    questionText: "In 'Sports Manager', you're building a team portfolio: A: Star players (expensive, high impact); B: Young talents (potential growth); C: Experienced players (stable performance); D: Mix of all. What's your strategy?",
    whyWeAsk: "This reveals your approach to portfolio management!",
    questionType: "multiple_choice",
    category: {
      id: "market-understanding",
      name: "Market Understanding",
      description: "Assess your market knowledge and decision-making approach"
    },
    options: [
      { id: "team-1", text: "A) Star players (expensive, high impact)" },
      { id: "team-2", text: "B) Young talents (potential growth)" },
      { id: "team-3", text: "C) Experienced players (stable performance)" },
      { id: "team-4", text: "D) Mix of all" }
    ],
    required: true
  },
  {
    id: "g5678h87-4d55-5090-eed2-4bd9c4b96cb6",
    questionText: "In 'Four Seasons Shop', each season affects your products differently: Summer: Ice cream sells great; Winter: Hot drinks are popular; Spring/Fall: Mixed sales. How do you stock your shop?",
    whyWeAsk: "This shows how you adapt to changing market conditions!",
    questionType: "multiple_choice",
    category: {
      id: "market-understanding",
      name: "Market Understanding",
      description: "Assess your market knowledge and decision-making approach"
    },
    options: [
      { id: "season-1", text: "Focus on seasonal bestsellers" },
      { id: "season-2", text: "Keep a balanced inventory year-round" },
      { id: "season-3", text: "Stock up before peak seasons" },
      { id: "season-4", text: "Experiment with trending items" }
    ],
    required: true
  },
  {
    id: "h6789i87-5e66-6190-fed2-4bd9c4b96cb7",
    questionText: "Are you a spontaneous shopper?",
    whyWeAsk: "Hey, no judgment here! We all have our moments. This just helps us suggest strategies that work with your natural spending style.",
    questionType: "boolean",
    category: {
      id: "money-style",
      name: "Money Style",
      description: "Understanding your personal approach to managing money"
    },
    required: true
  }
];

