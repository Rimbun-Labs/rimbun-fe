import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LandingHeader } from "@/components/blocks/header/LandingHeader";
import { Footer } from "@/components/blocks/footer";
import { FloatingShapes } from "@/components/blocks/ui";
import { DashboardPreview } from "@/components/blocks/dashboard-preview";
import { BankAnalyticsPreview } from "@/components/blocks/analytics-preview";
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
    title: "Capture intent signals earlier",
    description:
      "Surface transaction and behavior patterns that indicate changing customer intent before requests are submitted.",
  },
  {
    icon: Target,
    title: "Move from raw data to explainable signals",
    description:
      "Normalize fragmented financial events into confidence-scored insights your teams can review and act on.",
  },
  {
    icon: CreditCard,
    title: "Activate partner-ready outputs",
    description:
      "Deliver APIs and snapshots that help partners trigger timely journeys and contextual product experiences.",
  },
  {
    icon: Building2,
    title: "Built for regulated environments",
    description:
      "Designed for Financial Institutions and their customers with privacy-first data handling and transparent confidence metadata.",
  },
];

const platformFeatures = [
  { icon: LayoutDashboard, label: "Ingest -> Normalize -> Signal -> Action workflow" },
  { icon: Target, label: "Signals: spend rhythm, travel momentum, merchant shifts" },
  { icon: CreditCard, label: "Partner outputs: APIs, snapshots, confidence metadata" },
  { icon: BookOpen, label: "Secondary learning layer for user enablement" },
  { icon: LineChart, label: "Operational dashboard with traceable signal history" },
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
              <span>For Financial Institutions</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-foreground"
            >
              Turn transaction activity into actionable financial intelligence
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
            >
              Convert customer financial behavior into explainable intent signals for teams, apps, and partner workflows. Signals indicate likely needs with confidence scores to support timely human-reviewed decisions.
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
                <Link to="/for-banks#platform">View outputs</Link>
              </Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-10 pt-10 border-t border-border/40 max-w-2xl mx-auto"
            >
              <ul className="flex flex-col sm:flex-row flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
                <li className="flex items-center gap-2 justify-center sm:justify-start">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                  <span>Signals inform decisions—not advice</span>
                </li>
                <li className="flex items-center gap-2 justify-center sm:justify-start">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                  <span>Confidence metadata on outputs</span>
                </li>
                <li className="flex items-center gap-2 justify-center sm:justify-start">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                  <span>Privacy-first by design</span>
                </li>
              </ul>
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
            Why Financial Institutions use Rimbun
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

      {/* Analytics for your team */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl font-bold text-foreground mb-3">
              Signals your teams can trust
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Partner teams get a dedicated analytics view for signal quality, cohort movement, and confidence distribution across customer segments.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto mb-10"
          >
            <BankAnalyticsPreview />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <a href="mailto:team@rimbun.co">
                Request a demo
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/for-banks#platform">View outputs</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Platform / Product — what your customers see */}
      <section id="platform" className="py-16 md:py-24 bg-muted/30">
        <div className="container px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">Outputs for partners and apps</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Deliver intelligence as API-ready outputs and dashboard snapshots with confidence metadata so product, risk, and servicing teams share one view.
            </p>
            <p className="text-sm text-muted-foreground/90 max-w-2xl mx-auto mt-4">
              Example end-user experience—signals and partner outputs power experiences like this. Synthetic preview only.
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
            <h3 className="font-semibold text-foreground mb-4 text-center">Signal and output capabilities</h3>
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
              Ready to operationalize financial intelligence?
            </h2>
            <p className="text-muted-foreground">
              Discuss integration options and see how confidence-scored intent signals can support partner and product workflows.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <a href="mailto:team@rimbun.co">
                  Request a demo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/for-banks#platform">View outputs</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
