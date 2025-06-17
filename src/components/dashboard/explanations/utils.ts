import { ExplanationData } from './types';

export const getRiskStyleExplanation = (
  riskProfile: number,
  riskCapacity: number
): ExplanationData => {
  if (riskProfile >= 80) {
    return {
      title: "Dynamic Risk Management",
      description: "Your portfolio is designed to actively manage risk while pursuing growth. It uses a combination of growth assets and strategic hedges to navigate market changes. This approach aims to capture opportunities while maintaining essential stability.",
      keyPoints: [
        "Growth assets drive returns while hedges provide protection",
        "Risk management is built into the asset mix",
        "Portfolio adapts to changing market conditions",
        "Strategic use of each asset class"
      ]
    };
  } else if (riskProfile >= 60) {
    return {
      title: "Balanced Risk Approach",
      description: "Your portfolio takes a measured approach to risk. It combines growth opportunities with stability to create a resilient mix. This balanced strategy aims to protect your capital while still pursuing meaningful returns.",
      keyPoints: [
        "Growth and stability work together",
        "Risk is spread across different opportunities",
        "Portfolio maintains essential protection",
        "Strategic allocation for your goals"
      ]
    };
  } else {
    return {
      title: "Conservative Risk Strategy",
      description: "Your portfolio prioritizes stability and protection. It uses a higher allocation to defensive assets while still maintaining some growth potential. This approach focuses on preserving capital while generating steady returns.",
      keyPoints: [
        "Defensive assets provide core stability",
        "Growth is pursued cautiously",
        "Capital preservation is prioritized",
        "Steady returns are the focus"
      ]
    };
  }
};

export const getKnowledgeLevelExplanation = (score: number): ExplanationData => {
  if (score >= 80) {
    return {
      title: "Advanced Knowledge",
      description: "You have a comprehensive understanding of investment concepts and market dynamics. You're comfortable with complex investment strategies and detailed analysis.",
      keyPoints: [
        "Deep understanding of market mechanics",
        "Comfortable with complex strategies",
        "Able to analyze detailed metrics",
        "Experience with various asset classes"
      ]
    };
  } else if (score >= 60) {
    return {
      title: "Intermediate Knowledge",
      description: "You have a solid foundation in investment concepts and understand the basics of portfolio management. You're comfortable with common investment strategies.",
      keyPoints: [
        "Understanding of basic investment principles",
        "Familiar with major asset classes",
        "Knowledge of risk management",
        "Growing investment experience"
      ]
    };
  } else {
    return {
      title: "Building Knowledge",
      description: "You're developing your understanding of investment concepts. Your learning path focuses on building a strong foundation in investment basics.",
      keyPoints: [
        "Learning core investment concepts",
        "Understanding basic asset classes",
        "Developing risk awareness",
        "Building investment confidence"
      ]
    };
  }
};

export const getDecisionStyleExplanation = (score: number): ExplanationData => {
  if (score >= 80) {
    return {
      title: "Analytical Decision Maker",
      description: "You make investment decisions based on thorough analysis and research. You're comfortable with data-driven approaches and detailed evaluation.",
      keyPoints: [
        "Data-driven decision making",
        "Comprehensive research process",
        "Systematic evaluation",
        "Long-term strategic thinking"
      ]
    };
  } else if (score >= 60) {
    return {
      title: "Balanced Decision Maker",
      description: "You combine analysis with intuition in your investment decisions. You consider both data and market sentiment in your approach.",
      keyPoints: [
        "Mix of analysis and intuition",
        "Consideration of multiple factors",
        "Balanced evaluation process",
        "Adaptable decision making"
      ]
    };
  } else {
    return {
      title: "Intuitive Decision Maker",
      description: "You rely more on intuition and market sentiment in your investment decisions. You prefer simpler, more straightforward approaches.",
      keyPoints: [
        "Intuitive decision making",
        "Focus on market sentiment",
        "Simpler evaluation process",
        "Quick decision making"
      ]
    };
  }
};

export const getAllocationStrategyExplanation = (
  diversificationScore: number,
  riskProfile: number
): ExplanationData => {
  if (diversificationScore >= 80) {
    return {
      title: "Strategic Asset Mix",
      description: "Your portfolio combines different assets in a way that balances growth and stability. Equities drive long-term growth, bonds provide steady income, real estate offers inflation protection, and cash keeps you flexible. Together, they create a resilient portfolio that can weather market changes while pursuing your goals.",
      keyPoints: [
        "Equities power growth while bonds provide stability",
        "Real estate adds inflation protection and income",
        "Cash reserves offer flexibility and safety",
        "Assets work together to manage risk and returns"
      ]
    };
  } else if (diversificationScore >= 60) {
    return {
      title: "Balanced Growth Approach",
      description: "Your portfolio focuses on growth while maintaining some stability. The mix of assets is designed to capture market opportunities while protecting against significant losses. Each asset plays a specific role in your overall strategy.",
      keyPoints: [
        "Growth assets drive returns while stable assets provide balance",
        "Each asset class serves a specific purpose in your plan",
        "Mix helps manage risk while pursuing growth",
        "Allocation adapts to your investment timeline"
      ]
    };
  } else {
    return {
      title: "Focused Investment Strategy",
      description: "Your portfolio emphasizes specific assets that align with your goals and risk tolerance. This focused approach aims to maximize returns in your preferred areas while maintaining essential stability. The allocation reflects your confidence in these key areas.",
      keyPoints: [
        "Concentrated in assets that match your goals",
        "Strategic focus on your preferred areas",
        "Maintains core stability where needed",
        "Optimized for your specific objectives"
      ]
    };
  }
};

export const getPortfolioInteractionExplanation = (
  riskAdjustedVolatility: number,
  riskProfile: number
): ExplanationData => {
  if (riskAdjustedVolatility >= 80) {
    return {
      title: "Synergistic Portfolio",
      description: "Your assets work together like a well-oiled machine. When one asset class faces challenges, others can help balance the impact. This creates a smoother investment journey while still capturing growth opportunities.",
      keyPoints: [
        "Assets complement each other during market changes",
        "Growth and stability work in harmony",
        "Risk is spread across different opportunities",
        "Portfolio adapts to changing conditions"
      ]
    };
  } else if (riskAdjustedVolatility >= 60) {
    return {
      title: "Coordinated Growth",
      description: "Your portfolio's assets are chosen to work together effectively. They provide different benefits at different times, helping to manage overall risk while pursuing your investment goals.",
      keyPoints: [
        "Assets provide different benefits when needed",
        "Growth and stability are well-coordinated",
        "Risk management is built into the mix",
        "Portfolio responds to market conditions"
      ]
    };
  } else {
    return {
      title: "Targeted Performance",
      description: "Your portfolio focuses on specific opportunities that you believe in. While this approach may have more ups and downs, it's designed to capture the growth potential you're seeking.",
      keyPoints: [
        "Focused on key growth opportunities",
        "Strategic use of each asset class",
        "Clear performance objectives",
        "Adapts to your investment style"
      ]
    };
  }
};

export const getPortfolioDiversificationExplanation = (
  diversificationScore: number,
  riskProfile: number
): ExplanationData => {
  if (diversificationScore >= 80) {
    return {
      title: "Comprehensive Diversification",
      description: "Your portfolio achieves strong diversification through a strategic mix of assets. Each asset class plays a specific role: equities drive growth, bonds provide stability, real estate offers inflation protection, and cash maintains flexibility. This combination helps manage risk while pursuing your goals.",
      keyPoints: [
        "Each asset serves a specific purpose",
        "Risk is spread across different opportunities",
        "Portfolio adapts to market changes",
        "Assets work together effectively"
      ]
    };
  } else if (diversificationScore >= 60) {
    return {
      title: "Strategic Asset Mix",
      description: "Your portfolio uses a focused mix of assets to achieve your goals. While not fully diversified, each chosen asset plays an important role in your strategy. This approach balances growth potential with essential stability.",
      keyPoints: [
        "Assets chosen for specific benefits",
        "Strategic balance of growth and stability",
        "Focused on key opportunities",
        "Maintains essential protection"
      ]
    };
  } else {
    return {
      title: "Targeted Investment Approach",
      description: "Your portfolio focuses on specific assets that align with your goals. While this approach may have more concentrated risk, it's designed to capture the opportunities you believe in. Essential stability is maintained where needed.",
      keyPoints: [
        "Focused on preferred opportunities",
        "Strategic use of each asset",
        "Clear investment objectives",
        "Maintains core stability"
      ]
    };
  }
}; 