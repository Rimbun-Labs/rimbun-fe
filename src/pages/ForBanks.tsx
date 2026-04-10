import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LandingHeader } from "@/components/blocks/header/LandingHeader";
import { Footer } from "@/components/blocks/footer";
import { FloatingShapes } from "@/components/blocks/ui";
import { BankAnalyticsPreview } from "@/components/blocks/analytics-preview";
import { motion } from "framer-motion";
import {
  Building2,
  ArrowRight,
  CheckCircle2,
  LayoutDashboard,
  BookOpen,
  CreditCard,
  LineChart,
  Shield,
  BarChart3,
  FileText,
  Plug,
  Upload,
  Sparkles,
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";

/** What the product supports today (backend-aligned positioning). */
const shippedToday = [
  {
    icon: BarChart3,
    title: "Cohort & health intelligence",
    description:
      "Aggregated partner view from institutional insights: risk distribution, financial health (including behavioral spending when data exists), engagement, and customer segments.",
  },
  {
    icon: Sparkles,
    title: "Explainable outputs",
    description:
      "Structured confidence and provenance where the product exposes it—assessments, document and statement extraction, and behavior-informed inferences—so teams see transparent scores, not black-box labels.",
  },
  {
    icon: Shield,
    title: "Governance-ready access",
    description:
      "API and access patterns suited to reviews in regulated environments: clarity on who retrieved what and when—supporting partner trust without overclaiming human review of every model output.",
  },
  {
    icon: FileText,
    title: "Product intelligence workflows",
    description:
      "Document-aware product context and fit-style matching to support institutional workflows and informed conversations—not execution or personalized advice as a product.",
  },
];

const dataPaths = [
  {
    icon: Upload,
    title: "Statement ingestion",
    description:
      "Upload statements to derive spending categories, burn rate, buckets, and optional fee or account summaries—grounded in documents you control.",
  },
  {
    icon: Plug,
    title: "Open banking connections",
    description:
      "Integration readiness for bank-linked flows. End-to-end live transaction processing depends on your deployment, consents, and data agreements—we label capabilities honestly.",
  },
];

const roadmapItems = [
  "Richer intent taxonomy (e.g. spend rhythm, travel momentum, merchant shifts)",
  "Deeper journey hooks and partner webhooks where agreements allow",
  "Expanded signal-specific operational analytics for partner teams",
];

const capabilitiesToday = [
  "Institutional aggregation aligned with partner insights APIs",
  "Explainable fields where confidence and source metadata exist",
  "Assessments, learning loops, chat engagement, and recommendations as a controlled enablement layer",
  "Product and servicing teams share dashboard and API-oriented views",
];

const capabilitiesRoadmap = [
  "Full intent-to-action automation across channels (design partner scope)",
  "Signal review queues and SLAs where you operationalize them",
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
              Cohort intelligence and explainable outputs for Financial Institutions
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-muted-foreground max-w-2xl mx-auto space-y-3"
            >
              <p>
                Aggregate customer intelligence for partner teams—risk, financial health, engagement, and
                segments—with transparent scoring and provenance where the platform exposes it.
              </p>
              <p className="text-base">
                Intent-style signals and deeper journey automation are on the roadmap; we partner with
                institutions to prioritize what ships next.
              </p>
            </motion.div>
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
                <Link to="/for-banks#platform">View capabilities</Link>
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
                  <span>Insights inform decisions—not personalized advice</span>
                </li>
                <li className="flex items-center gap-2 justify-center sm:justify-start">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                  <span>Explainability where confidence exists</span>
                </li>
                <li className="flex items-center gap-2 justify-center sm:justify-start">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                  <span>Privacy-first · audit-aware access</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What runs today */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container px-4 md:px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center mb-4 text-foreground"
          >
            Built on what we run today
          </motion.h2>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12 text-sm md:text-base">
            A credible core for regulated buyers: aggregation, explainability where exposed, governance posture,
            and product context—not a promise that every future signal is live in production on day one.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {shippedToday.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
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

      {/* Data paths */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6 max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center mb-4 text-foreground"
          >
            Data paths we can name honestly
          </motion.h2>
          <p className="text-center text-muted-foreground mb-12 text-sm">
            Ground the story in ingestion routes your teams can defend in diligence.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {dataPaths.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-4 p-6 rounded-xl border border-border bg-muted/20"
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

      {/* Enablement */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container px-4 md:px-6 max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex p-3 rounded-lg bg-primary/10 text-primary mb-4">
              <BookOpen className="h-8 w-8" />
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-4">Education &amp; guidance as the controlled last mile</h2>
            <p className="text-muted-foreground leading-relaxed">
              Assessments, learning loops, chat engagement, and recommendations are a strength: they turn aggregated
              intelligence into explainable nudges and wealth-management-ready context—while staying distinct from
              execution or advice-as-product. Signals and insights <span className="font-medium text-foreground">feed enablement</span>, not a black-box autopilot.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Partner analytics — API-aligned story */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl font-bold text-foreground mb-3">
              Cohort &amp; health intelligence for partner teams
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              An aggregated institutional view aligned with the partner customers insights surface—risk, financial
              health, engagement, and segments—rather than signal-metric mocks that are not yet API-backed everywhere.
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
              <Link to="/for-banks#platform">View capabilities</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="py-14 md:py-20 border-y border-dashed border-border/60 bg-muted/20">
        <div className="container px-4 md:px-6 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 text-primary mb-3">
              <MapPin className="h-5 w-5" />
              <span className="text-sm font-semibold uppercase tracking-wide">Roadmap · design partners</span>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Intent signals &amp; deeper automation</h2>
            <p className="text-sm text-muted-foreground mb-8">
              We are explicit when something is direction versus generally available. Partner with us to prioritize the
              next wave of signal taxonomy and operational analytics.
            </p>
            <ul className="text-left space-y-3 text-sm text-muted-foreground max-w-xl mx-auto">
              {roadmapItems.map((line) => (
                <li key={line} className="flex gap-2">
                  <span className="text-primary mt-0.5">→</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Platform capabilities — DashboardPreview stays in codebase for ForIndividuals / Index, not embedded here. */}
      <section id="platform" className="py-16 md:py-24 bg-muted/30">
        <div className="container px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">Platform capabilities</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              What we prioritize for Financial Institution integrations: aggregation, explainability, enablement, and
              partner-facing surfaces—not a consumer investment dashboard as the hero of this page.
            </p>
            <p className="text-sm text-muted-foreground/90 max-w-2xl mx-auto mt-4">
              End-user experience mocks remain in the codebase for other flows (e.g. individual marketing). We can walk
              through them live on a demo when relevant to your rollout.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto space-y-8"
          >
            <div>
              <h3 className="font-semibold text-foreground mb-4 text-center">Capabilities in production today</h3>
              <ul className="space-y-3">
                {capabilitiesToday.map((label) => (
                  <li key={label} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <CheckCircle2 className={cn("h-4 w-4 shrink-0 text-primary mt-0.5")} />
                    <span>{label}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-dashed border-border bg-background/50 p-6">
              <h3 className="font-semibold text-foreground mb-4 text-center text-sm uppercase tracking-wide text-muted-foreground">
                Roadmap &amp; co-design
              </h3>
              <ul className="space-y-3">
                {capabilitiesRoadmap.map((label) => (
                  <li key={label} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <LineChart className="h-4 w-4 shrink-0 text-muted-foreground mt-0.5" />
                    <span>{label}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <LayoutDashboard className="h-3.5 w-3.5" />
                Ingest → normalize → enrich
              </span>
              <span className="inline-flex items-center gap-1">
                <CreditCard className="h-3.5 w-3.5" />
                Partner outputs: APIs &amp; snapshots
              </span>
            </div>
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
              Ready to align aggregation, explainability, and enablement?
            </h2>
            <p className="text-muted-foreground">
              Talk to us about integration, governance expectations, and roadmap co-design for intent and signal
              depth—grounded in what your environment can run today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <a href="mailto:team@rimbun.co">
                  Request a demo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/for-banks#platform">View capabilities</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
