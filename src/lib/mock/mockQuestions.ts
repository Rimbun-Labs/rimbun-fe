import { Question } from '../api/types/assessment';

export const mockQuestions: Question[] = [
  {
    id: "1f64e867-ed70-4e40-b86a-70df20a2f46c",
    questionText: "How young are you?",
    questionType: "number",
    category: {
      id: "831aa72c-8978-438c-8be2-301e22fbfcfe",
      name: "Getting to Know You",
      description: "Basic information about you to personalize your experience."
    },
    required: true,
    whyWeAsk: "We need to understand your age to tailor investment recommendations to your life stage."
  },
  {
    id: "c0189e87-8c22-4350-aed2-4bd9c4b96cb2",
    questionText: "What's your financial goal?",
    whyWeAsk: "Needed for Age-to-Goal Alignment in Investment Horizon",
    questionType: "multiple_choice",
    category: {
      id: "13d09bf5-323f-4c12-a638-bd569e02c34c",
      name: "Dream Building",
      description: "Set your goals and timelines to bring your financial dreams to life."
    },
    options: [
      { id: "3050281a-b1a0-4ce3-ba92-d19929ea128b", text: "Wealth" },
      { id: "goal-2", text: "Home Purchase" },
      { id: "goal-3", text: "Education" },
      { id: "goal-4", text: "Retirement" }
    ],
    required: true
  },
  {
    id: "eabf99f8-9a79-4cbd-baad-a81f0c48a3c9",
    questionText: "What's your monthly income range?",
    whyWeAsk: "Helps us tailor financial recommendations to your income level",
    questionType: "multiple_choice",
    category: {
      id: "8db9679c-5a65-47ba-bd36-c2503ea5394b",
      name: "Your Financial Picture",
      description: "Understanding your current financial situation."
    },
    options: [
      { id: "income-1", text: "Under $2,000" },
      { id: "edd561be-0f3d-4622-b134-9091a704e29a", text: "$2,000 - $3,999" },
      { id: "income-3", text: "$4,000 - $7,999" },
      { id: "income-4", text: "$8,000+" }
    ],
    required: true
  },
  {
    id: "f616918d-5bce-490a-b4ef-d662b29d3e04",
    questionText: "You're playing a shopping game! You have $1000 to spend. There are two stores: Store A: Everything is 50% off, but items might have small defects; Store B: Fixed prices, but everything is guaranteed perfect. What would you do?",
    whyWeAsk: "This reveals your approach to risk versus quality trade-offs",
    questionType: "multiple_choice",
    category: {
      id: "143b0506-66a2-40a9-b083-f24e1c1983a8",
      name: "Risk Profile X",
      description: "Understanding your approach to risk in financial decisions."
    },
    options: [
      { id: "store-1", text: "Shop only at Store A - I'll take the risk for big discounts" },
      { id: "store-2", text: "Buy most items at Store A, but important ones at Store B" },
      { id: "6d8ea8f7-70fa-404e-ab17-7160ee5a1e4c", text: "Shop only at Store B - I don't want to risk defective items" },
      { id: "store-4", text: "Compare each item individually based on price vs. quality" }
    ],
    required: true
  },
  {
    id: "ca42ddd1-a426-4be2-aef3-cca8fc3acd21",
    questionText: "In a mobile game, you have 1000 game coins. You can: Safe Box: Keep coins safe, earn 10 coins daily; Adventure Mode: Chance to double coins, but might lose some. How would you play?",
    whyWeAsk: "This reveals your balance between guaranteed returns and risk-taking",
    questionType: "multiple_choice",
    category: {
      id: "143b0506-66a2-40a9-b083-f24e1c1983a8",
      name: "Risk Profile X",
      description: "Understanding your approach to risk in financial decisions."
    },
    options: [
      { id: "coins-1", text: "Keep all 1000 coins in Safe Box" },
      { id: "60b56ba3-37cf-4696-883a-63caf1d911df", text: "Keep 800 coins safe, try 200 in Adventure Mode" },
      { id: "coins-3", text: "Split 50/50 between Safe Box and Adventure" },
      { id: "coins-4", text: "Put most coins in Adventure Mode for maximum growth" }
    ],
    required: true
  },
  {
    id: "3171ef1b-47de-4c33-89f7-6782aa7e5b6d",
    questionText: "You just received an unexpected $500! You have these options: A: High-yield savings (safe, lower return); B: Mix of stocks and savings (balanced); C: Growth stocks (higher risk/return); D: Speculative investments (highest risk/return). What's your plan?",
    whyWeAsk: "Reveals your approach to windfall investments",
    questionType: "multiple_choice",
    category: {
      id: "143b0506-66a2-40a9-b083-f24e1c1983a8",
      name: "Risk Profile X",
      description: "Understanding your approach to risk in financial decisions."
    },
    options: [
      { id: "unexpected-1", text: "Put it all in high-yield savings" },
      { id: "2aeba28e-5adf-421c-b031-6a513427235d", text: "Invest 50% in stocks, 50% in savings" },
      { id: "unexpected-3", text: "Put it all in growth stocks" },
      { id: "unexpected-4", text: "Try speculative investments for maximum return" }
    ],
    required: true
  },
  {
    id: "93b983d6-525e-49f5-aa16-f1a1b28f21fb",
    questionText: "You're running a virtual pizza shop! You have $1000 to improve your shop. Which strategy sounds best?",
    whyWeAsk: "Shows how you balance business investments",
    questionType: "multiple_choice",
    category: {
      id: "9f0f8d24-6423-4c25-a1aa-a62671948ffc",
      name: "Financial Knowledge",
      description: "Testing your understanding of key financial concepts."
    },
    options: [
      { id: "pizza-1", text: "Focus on one popular recipe and perfect it" },
      { id: "c30b1d2a-046f-4b00-9a71-22987f6bee66", text: "Split money between different recipes and marketing" },
      { id: "pizza-3", text: "Invest in unique ingredients for premium pizzas" },
      { id: "pizza-4", text: "Save most of it for future upgrades" }
    ],
    required: true
  },
  {
    id: "08756188-dca5-4f43-9840-b5519f8853cc",
    questionText: "You're playing a savings game! You have 100 coins and two banks offer: Safe Bank: Gives 10 bonus coins every month; Growth Bank: Gives extra coins that grow based on your total coins. What would you do?",
    whyWeAsk: "Tests your understanding of compound interest concepts",
    questionType: "multiple_choice",
    category: {
      id: "9f0f8d24-6423-4c25-a1aa-a62671948ffc",
      name: "Financial Knowledge",
      description: "Testing your understanding of key financial concepts."
    },
    options: [
      { id: "bank-1", text: "Put all coins in Safe Bank" },
      { id: "bank-2", text: "Put all coins in Growth Bank" },
      { id: "4cb9f270-ca63-4a97-a304-3c34b538eb62", text: "Try Growth Bank with a small amount first" },
      { id: "bank-4", text: "Split coins equally between both banks" }
    ],
    required: true
  },
  {
    id: "a8fa9984-4de2-44a7-adf4-a12f491357e1",
    questionText: "In your virtual shop game: Last year: Could buy 10 items with 100 coins; This year: Same 100 coins buys only 8 items. What's your best move?",
    whyWeAsk: "Tests your understanding of inflation",
    questionType: "multiple_choice",
    category: {
      id: "9f0f8d24-6423-4c25-a1aa-a62671948ffc",
      name: "Financial Knowledge",
      description: "Testing your understanding of key financial concepts."
    },
    options: [
      { id: "1a04e417-d966-48af-95d6-bf37450047a1", text: "Keep collecting coins as usual" },
      { id: "inflation-2", text: "Find ways to collect more coins" },
      { id: "inflation-3", text: "Use coins quickly before prices rise more" },
      { id: "inflation-4", text: "Find investments that grow faster than prices" }
    ],
    required: true
  },
  {
    id: "3e7e34b6-7b21-4efe-bd94-8e96efe166e6",
    questionText: "In 'Rainy Day Game', a storm's coming: A) Save all coins (safe); B) Spend half on an umbrella (balanced); C) Buy a fancy coat (risky); D) Ignore the storm (opportunistic). What's your plan?",
    whyWeAsk: "Shows your approach to preparing for financial downturns",
    questionType: "multiple_choice",
    category: {
      id: "9f0f8d24-6423-4c25-a1aa-a62671948ffc",
      name: "Financial Knowledge",
      description: "Testing your understanding of key financial concepts."
    },
    options: [
      { id: "storm-1", text: "Save all coins" },
      { id: "storm-2", text: "Spend half on an umbrella" },
      { id: "ed2b5bfd-1f9f-4cc5-8051-3e400b93cc5a", text: "Buy a fancy coat" },
      { id: "storm-4", text: "Ignore the storm" }
    ],
    required: true
  },
  {
    id: "ff23184a-0cc5-45ea-935f-ca0596b26aa7",
    questionText: "In a collection game, you have 1000 coins to buy: Popular items (prices change a lot); Common items (stable prices); New items (unknown value). How would you spend your coins?",
    whyWeAsk: "Shows your approach to market volatility",
    questionType: "multiple_choice",
    category: {
      id: "9f0f8d24-6423-4c25-a1aa-a62671948ffc",
      name: "Financial Knowledge",
      description: "Testing your understanding of key financial concepts."
    },
    options: [
      { id: "3f52e40c-23a7-4d34-9179-4d99d69f16b0", text: "Focus on popular items for quick gains" },
      { id: "collection-2", text: "Stick with common items for stability" },
      { id: "collection-3", text: "Try new items with growth potential" },
      { id: "collection-4", text: "Diversify across all three types" }
    ],
    required: true
  },
  {
    id: "ec2add40-850a-4b7e-99e8-6e0be74295f0",
    questionText: "Your virtual pet business can: Upgrade current services (safe, small growth); Add new services (some risk, more growth); Partner with others (shared risk/reward); Try trending services (high risk/reward). What's your strategy?",
    whyWeAsk: "Reveals your approach to business growth strategies",
    questionType: "multiple_choice",
    category: {
      id: "9f0f8d24-6423-4c25-a1aa-a62671948ffc",
      name: "Financial Knowledge",
      description: "Testing your understanding of key financial concepts."
    },
    options: [
      { id: "pet-1", text: "Focus on upgrading current services" },
      { id: "57bf9d9c-91bb-4af1-a1d2-e2cfa31aabc2", text: "Balance upgrades with new services, test partnerships" },
      { id: "pet-3", text: "Mainly add new services and test trends" },
      { id: "pet-4", text: "Focus on trending services for rapid growth" }
    ],
    required: true
  },
  {
    id: "0f9ede45-1da1-4c0b-8221-fcad4ff9008d",
    questionText: "You want the latest smartphone ($1000). You have these options: Save monthly and buy in cash; Buy now with a store installment plan; Use a credit card. What would you do?",
    whyWeAsk: "Reveals your approach to consumer debt",
    questionType: "multiple_choice",
    category: {
      id: "615fd25f-d013-44d7-9288-d611eecc80d8",
      name: "Leverage Aptitude",
      description: "Understanding your approach to using debt and leverage."
    },
    options: [
      { id: "phone-1", text: "Save until I can pay in full" },
      { id: "e6a543ae-d150-47ce-a980-29f1b0d13211", text: "Save most of it, use small installment for remainder" },
      { id: "phone-3", text: "Use interest-free installment plan" },
      { id: "phone-4", text: "Use credit card and pay over time" }
    ],
    required: true
  },
  {
    id: "910ee924-6393-432f-ac7e-ae4f1c089228",
    questionText: "In 'Home Renovation Game', you want to upgrade your house value! You have these options: Option A: Save monthly and renovate in parts; Option B: Take a home improvement loan; Option C: Use credit cards with 0% intro rate; Option D: Mix savings with a small loan. What's your renovation strategy?",
    whyWeAsk: "Shows how you approach leverage for assets",
    questionType: "multiple_choice",
    category: {
      id: "615fd25f-d013-44d7-9288-d611eecc80d8",
      name: "Leverage Aptitude",
      description: "Understanding your approach to using debt and leverage."
    },
    options: [
      { id: "reno-1", text: "Save and renovate in parts" },
      { id: "reno-2", text: "Take a home improvement loan" },
      { id: "3bef2e29-1069-48d7-97f1-8f99abf7ebc5", text: "Use 0% credit cards and pay within promo period" },
      { id: "reno-4", text: "Mix savings with a small loan" }
    ],
    required: true
  },
  {
    id: "c0086dd1-d5b3-4bab-856f-7f3b98c9d678",
    questionText: "In 'Four Seasons Shop', each season affects your products differently: Summer: Ice cream sells great; Winter: Hot drinks are popular; Spring/Fall: Mixed sales. How do you stock your shop?",
    whyWeAsk: "Shows how you adapt to market cycles",
    questionType: "multiple_choice",
    category: {
      id: "8a51645d-797d-4572-92f9-3809805395eb",
      name: "Market Understanding",
      description: "Assess your market knowledge and decision-making approach."
    },
    options: [
      { id: "seasons-1", text: "Focus only on the current season" },
      { id: "c87daf13-c879-4051-9a63-382126439ba0", text: "Focus on current season but keep some variety" },
      { id: "seasons-3", text: "Equal mix all year round" },
      { id: "seasons-4", text: "Stock up before each seasonal change" }
    ],
    required: true
  },
  {
    id: "7f321574-e764-4b75-bc19-3628be12f699",
    questionText: "In 'Sports Manager', you're building a team portfolio: A: Star players (expensive, high impact); B: Young talents (potential growth); C: Experienced players (stable performance); D: Mix of all. What's your strategy?",
    whyWeAsk: "This reveals your approach to portfolio management!",
    questionType: "multiple_choice",
    category: {
      id: "8a51645d-797d-4572-92f9-3809805395eb",
      name: "Market Understanding",
      description: "Assess your market knowledge and decision-making approach."
    },
    options: [
      { id: "26a9a2b7-34d6-4526-8ec1-1ed447f7e691", text: "Invest heavily in star players" },
      { id: "team-2", text: "Focus on young talents with potential" },
      { id: "team-3", text: "Mostly experienced players for stability" },
      { id: "team-4", text: "Mix of all types for balance" }
    ],
    required: true
  },
  {
    id: "60a4bc81-e9df-4df7-b136-daae9e1c0ed1",
    questionText: "In 'Farm Stand', it's planting season: A) Sell crops now (quick cash); B) Wait for harvest (bigger profit); C) Sell half now, half later (balanced); D) Try a trendy crop (risky). What's your choice?",
    whyWeAsk: "This shows how you time your decisions!",
    questionType: "multiple_choice",
    category: {
      id: "8a51645d-797d-4572-92f9-3809805395eb",
      name: "Market Understanding",
      description: "Assess your market knowledge and decision-making approach."
    },
    options: [
      { id: "farm-1", text: "Sell crops now for quick cash" },
      { id: "farm-2", text: "Wait for harvest for bigger profit" },
      { id: "e98aeea0-3cf8-41ea-80b0-dbf63fe1796f", text: "Sell half now, half later" },
      { id: "farm-4", text: "Try a trendy crop" }
    ],
    required: true
  },
  {
    id: "8313fce4-9965-4db8-a6ad-faa2536aaeeb",
    questionText: "How much have you saved so far?",
    whyWeAsk: "Needed for Savings-to-Income Ratio in Risk Capacity",
    questionType: "number",
    category: {
      id: "8db9679c-5a65-47ba-bd36-c2503ea5394b",
      name: "Your Financial Picture",
      description: "Understanding your current financial situation."
    },
    required: true,
    placeholder: "Enter amount in dollars"
  }
];
