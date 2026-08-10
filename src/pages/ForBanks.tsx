import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LandingHeader } from "@/components/blocks/header/LandingHeader";
import { Footer } from "@/components/blocks/footer";
import { FloatingShapes } from "@/components/blocks/ui";
import { BankAnalyticsPreview } from "@/components/blocks/analytics-preview";
import { motion } from "framer-motion";
import { ArrowRight, BarChart3, Building2, CheckCircle2, FileText, Shield, Sparkles, Target } from "lucide-react";

const pillars = [
  {
    icon: BarChart3,
    title: "Trajectory",
    description: "Detect early drift in behavior and liquidity momentum before static snapshots show it.",
  },
  {
    icon: Target,
    title: "Context",
    description: "Translate transactions into archetype and indicator narratives RM and risk teams can use.",
  },
  {
    icon: Sparkles,
    title: "Action",
    description: "Generate next-step strategies with clear rationale for outreach, servicing, and triage.",
  },
  {
    icon: FileText,
    title: "Fit",
    description: "Recommend suitable product options with confidence, trade-offs, and supporting evidence.",
  },
];

const capabilitiesToday = [
  "Institutional cohort and health aggregation aligned with partner insight surfaces",
  "Explainability fields where confidence and source metadata exist",
  "Behavior-informed decision-support workflows for RM and product teams",
  "Governance-ready access patterns for regulated review environments",
];

export default function ForBanks() {
  return (
    <div className="min-h-screen relative">
      <LandingHeader />
      <FloatingShapes />

      <section className="pt-28 pb-12 md:pt-36 md:pb-16 relative">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center space-y-7">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm border border-primary/20"
            >
              <Building2 className="h-4 w-4" />
              <span>For Financial Institutions</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-foreground"
            >
              Behavioral risk and growth intelligence for banks
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
            >
              Detect trajectory early, explain customer context, and drive next-best actions for risk, servicing, and
              suitable product-fit — from transaction behavior you already have.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center"
            >
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <a href="mailto:team@rimbun.co">
                  Request a demo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-border">
                <Link to="/for-banks/demo">Preview RM workspace</Link>
              </Button>
            </motion.div>

            <motion.ul
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="pt-6 border-t border-border/40 max-w-2xl mx-auto flex flex-col sm:flex-row flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground"
            >
              <li className="flex items-center gap-2 justify-center sm:justify-start">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                <span>Decision-support, not autonomous approval</span>
              </li>
              <li className="flex items-center gap-2 justify-center sm:justify-start">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                <span>Explainability where confidence exists</span>
              </li>
              <li className="flex items-center gap-2 justify-center sm:justify-start">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                <span>Privacy-first, audit-aware access</span>
              </li>
            </motion.ul>
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20 bg-muted/30">
        <div className="container px-4 md:px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl font-bold text-center mb-4 text-foreground"
          >
            The decision-support stack
          </motion.h2>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-10 text-sm md:text-base">
            One operating layer from signal to action: trajectory, context, strategy, and fit.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 max-w-6xl mx-auto">
            {pillars.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="rounded-xl border border-border bg-background p-5"
              >
                <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3">
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-foreground mb-1.5">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 md:py-18">
        <div className="container px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">See it in workflow context</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Portfolio-level intelligence snapshot here, with lead-level trajectory and action flow in the RM workspace demo.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto"
          >
            <BankAnalyticsPreview />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
          >
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link to="/for-banks/demo">
                Open interactive demo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      <section id="platform" className="py-12 md:py-16 bg-muted/30">
        <div className="container px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground mb-4">
              <Shield className="h-3.5 w-3.5" />
              Deployment-ready for FI environments
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Capabilities in production focus</h2>
            <ul className="space-y-3 text-sm text-muted-foreground text-left max-w-2xl mx-auto">
              {capabilitiesToday.map((label) => (
                <li key={label} className="flex items-start gap-3">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                  <span>{label}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-gradient-to-br from-primary/5 via-background to-primary/5">
        <div className="container px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center space-y-6"
          >
            <h2 className="text-3xl font-bold text-foreground">Ready to evaluate fit for your environment?</h2>
            <p className="text-muted-foreground">
              We align integration scope to your governance requirements and rollout priorities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <a href="mailto:team@rimbun.co">
                  Request a demo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/for-banks/demo">Preview RM workspace</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
