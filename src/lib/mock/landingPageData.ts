export const landingPageData = {
  scenarios: {
    conservative: {
      initial: 50000,
      monthly: 500,
      years: 15,
      projected: 1200000,
      description: "Lower risk, steady growth approach"
    },
    aggressive: {
      initial: 50000,
      monthly: 500,
      years: 12,
      projected: 1800000,
      description: "Higher risk, potential for greater returns"
    }
  },
  
  features: {
    assessment: {
      title: "AI-Powered Assessment",
      description: "Get your personalized investment profile in minutes",
      icon: "🎯",
      benefits: ["Risk tolerance analysis", "Knowledge level assessment", "Goal alignment", "Personality insights"]
    },
    dashboard: {
      title: "Interactive Dashboard", 
      description: "Visualize your portfolio and track your progress",
      icon: "📊",
      benefits: ["Portfolio allocation", "Performance tracking", "Goal monitoring", "Confidence metrics"]
    },
    learning: {
      title: "Personalized Learning",
      description: "Learn at your own pace with customized content",
      icon: "📚",
      benefits: ["Adaptive curriculum", "Progress tracking", "Interactive quizzes", "Expert insights"]
    }
  }
}; 