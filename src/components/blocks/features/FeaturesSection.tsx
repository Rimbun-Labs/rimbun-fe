import { BarChart, LayoutDashboard, BookOpen, Target, Brain, TrendingUp, Shield, CreditCard } from "lucide-react";
import { FeatureCard } from "./FeatureCard";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface FeaturesSectionProps {
  className?: string;
}

const features = [
  {
    title: "Interactive Scenario-Based Assessment",
    description: "Answer real-world financial scenarios, not just questions. Discover your risk tolerance, knowledge gaps, and financial style through practical situations covering investments, banking, and financial planning.",
    icon: Brain,
    color: "blue" as const,
    benefits: [
      "Understand your risk comfort zone through real scenarios",
      "Identify exactly where your financial knowledge stands",
      "Align recommendations with your financial goals",
      "Get insights into your financial personality"
    ],
    details: "Our assessment uses interactive scenarios to understand how you'd react in real financial situations, creating a comprehensive profile of your risk tolerance, knowledge level, and preferences for investments, banking, and financial planning."
  },
  {
    title: "Your Financial Command Center",
    description: "See your risk profile, portfolio recommendations, learning progress, and financial goals all in one place. Get actionable insights tailored to your assessment results.",
    icon: LayoutDashboard,
    color: "purple" as const,
    benefits: [
      "View your personalized portfolio allocation",
      "Track your learning and assessment progress",
      "Monitor progress toward your financial goals",
      "See your financial confidence score"
    ],
    details: "Your dashboard provides real-time insights into your learning progress, portfolio recommendations, banking product matches, and personalized action items to improve your financial knowledge."
  },
  {
    title: "Learning That Adapts to You",
    description: "Skip what you know, focus on what you don't. Your learning path automatically adjusts based on your assessment results and progress, covering equities, bonds, real estate, and cash management.",
    icon: BookOpen,
    color: "green" as const,
    benefits: [
      "Content adapts to your knowledge level",
      "Track progress through interactive modules",
      "Test understanding with scenario-based quizzes",
      "Get personalized explanations and insights"
    ],
    details: "Our learning system adapts to your progress, focusing on areas where you need improvement and skipping content you already know. Learn about asset classes, investment metrics, banking products, and financial planning strategies at your own pace."
  },
  {
    title: "Financial Goal Planning",
    description: "Set retirement, house, education, or wealth goals. Get personalized financial strategies with realistic timelines, monthly contribution calculations, and risk-adjusted projections.",
    icon: Target,
    color: "orange" as const,
    benefits: [
      "Set and organize multiple financial goals",
      "Get personalized financial strategies",
      "Track progress with realistic timelines",
      "Calculate required monthly contributions"
    ],
    details: "Define your financial goals and receive tailored strategies combining investments, banking products, and savings plans with realistic timelines and risk-adjusted returns. See how different contribution amounts and timelines affect your ability to reach your goals."
  },
  {
    title: "Investment Explorer & AI Chat",
    description: "Ask questions about investments, analyze assets, and simulate portfolio scenarios. Get personalized answers based on your risk profile and investment goals.",
    icon: TrendingUp,
    color: "red" as const,
    benefits: [
      "Chat with AI about investment questions",
      "Analyze stocks, ETFs, and bonds",
      "Simulate portfolio growth scenarios",
      "Get personalized recommendations"
    ],
    details: "Use the Investment Explorer to ask questions, analyze specific assets, and run what-if scenarios. All answers are personalized based on your risk profile and investment preferences from your assessment."
  },
  {
    title: "Banking Product Matching",
    description: "Get personalized banking product recommendations based on your financial goals. Compare savings accounts, credit cards, loans, and more to find the best fit for your situation.",
    icon: CreditCard,
    color: "indigo" as const,
    benefits: [
      "Personalized product recommendations",
      "Compare multiple banking products",
      "See match scores and eligibility",
      "Find products aligned with your goals"
    ],
    details: "Based on your assessment and financial goals, get matched with banking products that fit your needs. Compare features, costs, and benefits to make informed decisions."
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { 
    opacity: 0, 
    y: 30,
    scale: 0.95
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    }
  },
};

export const FeaturesSection = ({ className }: FeaturesSectionProps) => {
  return (
    <section id="features" className={cn("py-20 md:py-28 bg-gradient-to-br from-background via-background to-muted/20", className)}>
      <div className="container px-4 md:px-6">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">Your Complete Financial Toolkit</h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            From interactive scenario-based assessment to personalized learning paths, banking product matching, and financial planning tools—everything you need to build financial confidence.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
            >
              <FeatureCard
                {...feature}
                className="h-full"
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div 
          className="text-center mt-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8 border border-primary/20">
            <Shield className="h-12 w-12 mx-auto mb-6 text-primary" />
            <h3 className="text-2xl font-bold mb-4 text-foreground">Your Data, Your Control</h3>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              We only collect what's needed to personalize your learning experience. No selling data. No third-party sharing. Just your education, your way.
            </p>
            <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>No data sold to third parties</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Privacy-first approach</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>No commitments required</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}; 