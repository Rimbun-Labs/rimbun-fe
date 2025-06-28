import { BarChart, LayoutDashboard, BookOpen, Target, Brain, TrendingUp, Shield, Users } from "lucide-react";
import { FeatureCard } from "./FeatureCard";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface FeaturesSectionProps {
  className?: string;
}

const features = [
  {
    title: "AI-Powered Assessment",
    description: "Get your personalized investment profile in just 10-15 minutes with our intelligent questionnaire.",
    icon: Brain,
    color: "blue" as const,
    benefits: [
      "Risk tolerance analysis",
      "Knowledge level assessment", 
      "Goal alignment",
      "Personality insights"
    ],
    details: "Our AI analyzes your responses to understand your investment personality, financial goals, and risk preferences to create a comprehensive profile."
  },
  {
    title: "Personalized Dashboard",
    description: "Visualize your progress and track your investment journey with interactive charts and insights.",
    icon: LayoutDashboard,
    color: "purple" as const,
    benefits: [
      "Portfolio allocation",
      "Performance tracking",
      "Goal monitoring",
      "Confidence metrics"
    ],
    details: "Your dashboard provides real-time insights into your learning progress, portfolio recommendations, and personalized action items."
  },
  {
    title: "Adaptive Learning Paths",
    description: "Learn at your own pace with content customized to your knowledge gaps and financial goals.",
    icon: BookOpen,
    color: "green" as const,
    benefits: [
      "Adaptive curriculum",
      "Progress tracking",
      "Interactive quizzes",
      "Expert insights"
    ],
    details: "Our learning system adapts to your progress, focusing on areas where you need improvement and skipping content you already know."
  },
  {
    title: "Goal Planning Tools",
    description: "Set financial goals and get personalized strategies to achieve them with confidence.",
    icon: Target,
    color: "orange" as const,
    benefits: [
      "Goal setting",
      "Strategy planning",
      "Progress tracking",
      "Milestone celebrations"
    ],
    details: "Define your financial goals and receive tailored investment strategies with realistic timelines and risk-adjusted returns."
  },
  {
    title: "Market Insights",
    description: "Stay informed with AI-generated market analysis and investment opportunities.",
    icon: TrendingUp,
    color: "red" as const,
    benefits: [
      "Market analysis",
      "Opportunity alerts",
      "Risk assessment",
      "Trend insights"
    ],
    details: "Get personalized market insights and investment opportunities based on your risk profile and investment preferences."
  },
  {
    title: "Community & Support",
    description: "Connect with other investors and get expert guidance when you need it most.",
    icon: Users,
    color: "indigo" as const,
    benefits: [
      "Peer learning",
      "Expert Q&A",
      "Discussion forums",
      "Mentorship programs"
    ],
    details: "Join a community of like-minded investors, ask questions to experts, and learn from others' experiences."
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
    <section className={cn("py-16 md:py-24 bg-gradient-to-br from-background via-background to-muted/20", className)}>
      <div className="container px-4 md:px-6">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need to Succeed</h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            Our comprehensive platform combines AI-powered assessment, personalized learning, and expert insights to help you build confidence and achieve your financial goals.
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
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8 border border-primary/20">
            <Shield className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h3 className="text-2xl font-bold mb-2">Your Privacy Matters</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              We respect your privacy and only collect the information needed to personalize your learning experience. Your data is never shared with third parties.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>No sensitive data collected</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Privacy focused</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}; 