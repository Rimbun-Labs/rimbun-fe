export const landingPageData = {
  testimonials: [
    {
      name: "Sarah Chen",
      role: "Software Engineer",
      content: "Investlearn helped me understand my risk tolerance and build a portfolio I'm confident in. The personalized approach made all the difference.",
      avatar: "/avatars/sarah.jpg",
      rating: 5
    },
    {
      name: "Michael Rodriguez",
      role: "Marketing Manager", 
      content: "I was intimidated by investing before finding Investlearn. The assessment helped me understand my goals and the learning modules are perfect for my schedule.",
      avatar: "/avatars/michael.jpg",
      rating: 5
    },
    {
      name: "Emily Watson",
      role: "Teacher",
      content: "As someone with limited financial knowledge, Investlearn made investing accessible. The step-by-step guidance and personalized recommendations are invaluable.",
      avatar: "/avatars/emily.jpg",
      rating: 5
    }
  ],
  
  statistics: {
    users: "10,000+",
    assessments: "15,000+",
    satisfaction: "98%",
    averageScore: "7.2/10"
  },
  
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