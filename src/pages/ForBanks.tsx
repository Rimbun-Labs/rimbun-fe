import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LandingHeader } from "@/components/blocks/header/LandingHeader";
import { Footer } from "@/components/blocks/footer";
import { FloatingShapes } from "@/components/blocks/ui";
import { DashboardPreview } from "@/components/blocks/dashboard-preview";
import { motion } from "framer-motion";
import {
  Building2,
  Users,
  Target,
  ArrowRight,
  CheckCircle2,
  LayoutDashboard,
  BookOpen,
  CreditCard,
  LineChart,
} from "lucide-react";
import { cn } from "@/lib/utils";

const bankBenefits = [
  {
    icon: Users,
    title: "Increase engagement",
    description:
      "Personalized learning paths and scenario-based assessment keep your customers engaged and coming back.",
  },
  {
    icon: Target,
    title: "Improve financial literacy at scale",
    description:
      "Help customers understand investments, banking products, and planning—with content that adapts to their level.",
  },
  {
    icon: CreditCard,
    title: "Match customers to your products",
    description:
      "Goal-based recommendations and product matching surface the right offers at the right time.",
  },
  {
    icon: Building2,
    title: "Built for financial institutions",
    description:
      "Designed for banks and their customers. Deploy as white-label or co-branded to strengthen your brand.",
  },
];

const platformFeatures = [
  { icon: LayoutDashboard, label: "AI-driven assessment & personalized learning paths" },
  { icon: Target, label: "Financial goal tracking and projections" },
  { icon: CreditCard, label: "Banking product matching and comparison" },
  { icon: BookOpen, label: "Investment education and explorer" },
  { icon: LineChart, label: "Dashboard and progress tracking" },
];

export default function ForBanks() {
  return (
    <div className="min-h-screen relative">
      <LandingHeader />
      <FloatingShapes />

      {/* Hero */}
      <section className="pt-28 pb-16 md:pt-36 md:pb-24 relative">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm border border-primary/20"
            >
              <Building2 className="h-4 w-4" />
              <span>For banks & financial institutions</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-foreground"
            >
              Power your customers&apos; financial education
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
            >
              Deliver personalized, scenario-based financial education and goal-based insights at scale. Help your customers build confidence and make better decisions—while deepening engagement with your brand and products.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <a href="mailto:team@rimbun.co">
                  Request a demo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-border">
                <Link to="/contact">Contact us</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container px-4 md:px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center mb-12 text-foreground"
          >
            Why banks choose Rimbun
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {bankBenefits.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-4 p-6 rounded-xl border border-border bg-background"
              >
                <div className="shrink-0 p-3 rounded-lg bg-primary/10 text-primary">
                  <item.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform / Product */}
      <section id="platform" className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">See the platform</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Your customers get a personalized dashboard, learning paths, goal tracking, and product recommendations—all powered by our assessment and AI-driven engine.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto"
          >
            <DashboardPreview />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 max-w-2xl mx-auto"
          >
            <h3 className="font-semibold text-foreground mb-4 text-center">Platform capabilities</h3>
            <ul className="space-y-3">
              {platformFeatures.map((f) => (
                <li
                  key={f.label}
                  className="flex items-center gap-3 text-sm text-muted-foreground"
                >
                  <CheckCircle2 className={cn("h-4 w-4 shrink-0 text-primary")} />
                  <span>{f.label}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-primary/5 via-background to-primary/5">
        <div className="container px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center space-y-6"
          >
            <h2 className="text-3xl font-bold text-foreground">
              Ready to bring financial education to your customers?
            </h2>
            <p className="text-muted-foreground">
              Get in touch for a demo or to discuss how Rimbun can work for your institution.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <a href="mailto:team@rimbun.co">
                  Request a demo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/contact">Contact us</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
