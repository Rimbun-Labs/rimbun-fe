import { LayoutDashboard, BookOpen, Target, Brain, TrendingUp, Shield, CreditCard } from "lucide-react";
import { FeatureCard } from "./FeatureCard";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface FeaturesSectionProps {
  className?: string;
}

const features = [
  {
    title: "Transaction ingestion",
    description: "Unify approved account and transaction streams for downstream intelligence.",
    icon: Brain,
    color: "blue" as const,
    benefits: [
      "Connect multi-source account activity",
      "Capture event context and timestamps",
      "Establish a consistent upstream feed",
      "Prepare data for compliant processing"
    ],
    details: "The platform ingests event-level financial activity from approved sources and prepares it for normalization and signal detection."
  },
  {
    title: "Behavioral signal detection",
    description: "Detect spend rhythm, liquidity pressure, merchant shifts, and momentum changes with confidence context.",
    icon: LayoutDashboard,
    color: "purple" as const,
    benefits: [
      "Standardize categories across data sources",
      "Surface early liquidity and spend pressure",
      "Track merchant and behavior shifts",
      "Attach confidence and recency markers"
    ],
    details: "Detection pipelines transform raw events into explainable behavioral risk and growth signals with confidence scoring and traceable histories."
  },
  {
    title: "Bank-ready outputs",
    description: "APIs and snapshots for partner apps, ops, and RM tools — not a rip-and-replace core.",
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
    title: "Institutional dashboard",
    description: "Cohort health, signal quality, and opportunity queues for bank teams.",
    icon: Target,
    color: "orange" as const,
    benefits: [
      "Track distribution and signal drift",
      "Review confidence-scored opportunities",
      "Segment cohorts by behavioral pattern",
      "Monitor historical signal behavior"
    ],
    details: "The dashboard helps teams operationalize intelligence by combining trend visibility with traceable signal histories."
  },
  {
    title: "Next-best action with human review",
    description: "Prioritize early warning and cross-sell actions; keep final decisions in regulated workflows.",
    icon: TrendingUp,
    color: "red" as const,
    benefits: [
      "Trigger timely customer journeys",
      "Route actions by confidence thresholds",
      "Support review before execution",
      "Document rationale from signal traces"
    ],
    details: "Signals indicate likely customer needs and are designed to inform, not replace, judgment in risk, servicing, and commercial workflows."
  },
  {
    title: "Privacy by architecture",
    description: "Hashed IDs, minimal direct PII dependency, designed for partner compliance review.",
    icon: CreditCard,
    color: "indigo" as const,
    benefits: [
      "Prefer hashed identifiers where possible",
      "Minimize direct PII in signal pipelines",
      "Support partner access controls",
      "Keep audit-friendly traces"
    ],
    details: "Privacy controls are embedded in system design so intelligence workflows remain partner-ready and compliance-aware."
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
};

export const FeaturesSection = ({ className }: FeaturesSectionProps) => {
  return (
    <section id="features" className={cn("py-20 md:py-28 bg-gradient-to-br from-background via-background to-muted/20", className)}>
      <div className="container px-4 md:px-6">
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">From raw transactions to decisions your teams can use</h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            Ingest activity you already have, surface behavioral risk and growth signals, and activate them in RM, risk, and product workflows — with human review where it matters.
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {features.map((feature) => (
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

        <motion.div 
          className="text-center mt-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8 border border-primary/20">
            <Shield className="h-12 w-12 mx-auto mb-6 text-primary" />
            <h3 className="text-2xl font-bold mb-4 text-foreground">Built to sit beside your stack</h3>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              We work with approved data feeds and partner controls. Signals inform; your teams decide. No selling customer data.
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
