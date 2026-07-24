import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LandingHeader } from "@/components/blocks/header/LandingHeader";
import { Footer } from "@/components/blocks/footer";
import { FloatingShapes } from "@/components/blocks/ui";
import { BankAnalyticsPreview } from "@/components/blocks/analytics-preview";
import { motion } from "framer-motion";
import { ArrowRight, BarChart3, Building2, CheckCircle2, FileText, Shield, Sparkles, Target } from "lucide-react";

const DOCS_URL = "https://docs.rimbun.co/";
const DOCS_API_URL = "https://docs.rimbun.co/api";

const pillars = [
  {
    icon: BarChart3,
    title: "Detect",
    description: "Find customer opportunities from payment behavior, not static snapshots alone.",
  },
  {
    icon: Target,
    title: "Map",
    description: "Match opportunities to your available non-credit products and constraints.",
  },
  {
    icon: Sparkles,
    title: "Recommend",
    description: "Return ranked activations with clear rationale your teams can review.",
  },
  {
    icon: FileText,
    title: "Deliver",
    description: "Act through the Rimbun workspace or embed recommendations in your channels via API.",
  },
];

const capabilities = [
  "Client workspace to review the book, customers, and recommended actions",
  "API for embedding recommendations into CRM, push, in-app, and other channels",
  "Explainable outputs with rationale your teams can audit before acting",
  "Outcome feedback that improves future recommendations over time",
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
              <span>For financial institutions and payment platforms</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-foreground"
            >
              Product-activation opportunities from payment behavior
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
            >
              Rimbun detects opportunities from payment behavior and maps them to your
              non-credit products, with explainable recommendations teams can act on.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center"
            >
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link to="/contact">
                  Contact us
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-border">
                <Link to="/clients/demo">Preview workspace</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-border">
                <a href={DOCS_API_URL} target="_blank" rel="noopener noreferrer">
                  API docs
                </a>
              </Button>
            </motion.div>
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
            How it works
          </motion.h2>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-10 text-sm md:text-base">
            From payment behavior to explainable activation, delivered where your teams already work.
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
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">Client workspace</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Review the book and customer opportunities in the Rimbun workspace. SSO sign-in for entitled
              client operators.
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
              <Link to="/clients/demo">
                Open workspace preview
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/login">Sign in</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      <section className="py-14 md:py-18 bg-muted/30">
        <div className="container px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center space-y-6"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">API for your channels</h2>
            <p className="text-muted-foreground">
              Embed explainable recommendations into CRM, push, in-app, and other client systems.
              Full reference and quickstart live in the developer docs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <a href={DOCS_API_URL} target="_blank" rel="noopener noreferrer">
                  Open API reference
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href={DOCS_URL} target="_blank" rel="noopener noreferrer">
                  Developer docs
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="platform" className="py-12 md:py-16">
        <div className="container px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground mb-4">
              <Shield className="h-3.5 w-3.5" />
              Built for regulated client environments
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">What clients get</h2>
            <ul className="space-y-3 text-sm text-muted-foreground text-left max-w-2xl mx-auto">
              {capabilities.map((label) => (
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
            <h2 className="text-3xl font-bold text-foreground">Ready to see how Rimbun fits?</h2>
            <p className="text-muted-foreground">
              Tell us about your environment and we will help you evaluate workspace, API, or both.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link to="/contact">
                  Contact us
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/clients/demo">Preview workspace</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
