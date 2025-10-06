import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ArrowRight, CheckCircle, Users, Award, Shield } from "lucide-react";
import { motion } from "framer-motion";

interface CTASectionProps {
  className?: string;
}

const benefits = [
  {
    icon: Award,
    title: "Personalized Learning",
    description: "Educational content tailored to your goals and knowledge level"
  },
  {
    icon: Shield,
    title: "Interactive Scenarios",
    description: "Learn investment concepts through real-world examples"
  },
  {
    icon: Users,
    title: "Progress Tracking",
    description: "Monitor your learning journey and goal progress"
  }
];

export const CTASection = ({ className }: CTASectionProps) => {
  return (
    <section className={cn("py-20 md:py-28 bg-gradient-to-br from-primary/5 via-background to-primary/5", className)}>
      <div className="container px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Main Content */}
          <motion.div 
            className="text-center space-y-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {/* Header */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl lg:text-5xl text-foreground">
                Ready to Build Your Investment Confidence?
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl leading-relaxed">
                Join thousands of learners who are developing the knowledge and skills to make informed investment decisions through personalized education.
              </p>
            </div>

            {/* Benefits Grid */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center space-y-4"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary">
                    <benefit.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-foreground">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* Stats */}
            <motion.div 
              className="flex flex-wrap justify-center gap-12 mt-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">10,000+</div>
                <div className="text-sm text-muted-foreground">Active Learners</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">98%</div>
                <div className="text-sm text-muted-foreground">Satisfaction Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">15,000+</div>
                <div className="text-sm text-muted-foreground">Assessments Completed</div>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center mt-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <Button 
                asChild 
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Link to="/signup">
                  <span className="flex items-center">
                    Start Your Learning Journey
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </Button>
              
              <Button 
                asChild 
                variant="outline" 
                size="lg"
                className="border-border hover:bg-muted hover:text-foreground"
              >
                <Link to="/login">
                  <span className="flex items-center">
                    Sign In to Continue
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </Button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div 
              className="pt-10 border-t border-border"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <p className="text-sm text-muted-foreground mb-6">
                Trusted by investors worldwide
              </p>
              <div className="flex flex-wrap justify-center items-center gap-8 text-muted-foreground">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <span className="text-sm">No credit card required</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <span className="text-sm">Free assessment</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <span className="text-sm">Cancel anytime</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};