import { LayoutDashboard, BookOpen, Target, Brain, TrendingUp, Shield, CreditCard } from "lucide-react";
import { FeatureCard } from "./FeatureCard";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface FeaturesSectionProps {
  className?: string;
}

const features = [
  {
    title: "Signal-Aware Ingestion",
    description: "Ingest transaction and behavioral events across accounts to create a unified stream for downstream intelligence.",
    icon: Brain,
    color: "blue" as const,
    benefits: [
      "Connect multi-source account activity",
      "Capture event context and timestamps",
      "Establish a consistent upstream signal feed",
      "Prepare data for compliant processing"
    ],
    details: "The platform ingests event-level financial activity from approved sources and prepares it for normalization and signal detection."
  },
  {
    title: "Normalization + Signal Detection",
    description: "Normalize fragmented event data, detect intent signals, and attach confidence metadata for each signal.",
    icon: LayoutDashboard,
    color: "purple" as const,
    benefits: [
      "Standardize categories across data sources",
      "Detect spend rhythm and travel momentum",
      "Track merchant and behavior shifts",
      "Attach confidence and recency markers"
    ],
    details: "Detection pipelines transform raw events into explainable signals with confidence scoring and traceable histories."
  },
  {
    title: "Partner-Ready Outputs",
    description: "Publish intelligence through APIs and snapshots so product and servicing teams can act in context.",
    icon: BookOpen,
    color: "green" as const,
    benefits: [
      "Serve API payloads for integrations",
      "Share dashboard-ready summary snapshots",
      "Expose confidence metadata for review",
      "Support action workflows across channels"
    ],
    details: "Outputs are designed for partner apps and operations teams that need signal context and confidence metadata in one place."
  },
  {
    title: "Intelligence Command Center",
    description: "Monitor signal quality, cohort movement, and operational outcomes through a shared intelligence dashboard.",
    icon: Target,
    color: "orange" as const,
    benefits: [
      "Track distribution and signal drift",
      "Review confidence-scored opportunities",
      "Segment cohorts by detected intent",
      "Monitor historical signal behavior"
    ],
    details: "The dashboard helps teams operationalize intelligence by combining trend visibility with traceable signal histories."
  },
  {
    title: "Action Workflows with Human Review",
    description: "Use signals to prioritize next-best actions while keeping final decisions in regulated human workflows.",
    icon: TrendingUp,
    color: "red" as const,
    benefits: [
      "Trigger timely customer journeys",
      "Route actions by confidence thresholds",
      "Support review before execution",
      "Document rationale from signal traces"
    ],
    details: "Signals indicate likely customer needs and are designed to inform, not replace, judgment in advisory and servicing workflows."
  },
  {
    title: "Privacy by Architecture",
    description: "Build intelligence with privacy-first controls, including hashed identifiers and minimal dependency on direct PII.",
    icon: CreditCard,
    color: "indigo" as const,
    benefits: [
      "Use hashed IDs for linkage",
      "Avoid direct PII dependency by default",
      "Apply access boundaries by role",
      "Preserve transparent processing context"
    ],
    details: "Privacy controls are embedded in system design so intelligence workflows remain partner-ready and compliance-aware."
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
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">From Data Events to Financial Intelligence</h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            Ingest, normalize, and activate confidence-scored intent signals across partner workflows while retaining space for human review.
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
              We collect only what is required for signal generation and partner outputs. No direct PII dependency by default, no data selling, and transparent confidence context.
            </p>
            <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>No data sold to third parties</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Hashed IDs and privacy-first architecture</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Signals indicate; human review remains essential</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}; 