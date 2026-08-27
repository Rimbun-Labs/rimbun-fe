import type { LucideIcon } from "lucide-react";
import {
  FileText,
  Activity,
  Building2,
  CreditCard,
  Radio,
  ShieldCheck,
  BadgeDollarSign,
  ShieldAlert,
  TrendingUp,
  LineChart,
  ClipboardCheck,
  Percent,
  ScanSearch,
  FolderKanban,
  PieChart,
  Landmark,
  Wallet,
  Scale,
  Share2,
  Lightbulb,
  MessagesSquare,
  UserX,
  Database,
  Lock,
  BadgeCheck,
} from "lucide-react";

export const insurersHero = {
  eyebrow: "FOR INSURERS & LENDERS",
  title: "Better risk decisions. Smarter pricing. Stronger outcomes.",
  lead: "Rimbun adds behavioral and financial context to your data, so you can assess risk more accurately, prevent loss, and grow profitably.",
};

export const insurersDataSources: Array<{
  title: string;
  description: string;
  icon: LucideIcon;
}> = [
  {
    title: "Policy / loan data",
    description: "Policies, claims, limits, repayments, delinquencies",
    icon: FileText,
  },
  {
    title: "Transaction behavior",
    description: "Income, spending patterns, cash flow behavior",
    icon: Activity,
  },
  {
    title: "Asset & collateral data",
    description: "Vehicle, property, inventory and asset performance",
    icon: Building2,
  },
  {
    title: "Bureau & credit data",
    description: "Credit scores, credit history, inquiries, tradelines",
    icon: CreditCard,
  },
  {
    title: "External signals",
    description: "Economic, sector, geo and fraud risk indicators",
    icon: Radio,
  },
];

export const insurersOutputs = [
  "Risk scoring",
  "Behavioral insights",
  "Fraud detection",
  "Pricing signals",
  "Early warnings",
  "Portfolio monitoring",
] as const;

export const insurersOutcomes: Array<{
  title: string;
  description: string;
  icon: LucideIcon;
}> = [
  {
    title: "Assess risk with confidence",
    description:
      "See beyond traditional data with behavioral and cash flow intelligence.",
    icon: ShieldCheck,
  },
  {
    title: "Price more accurately",
    description:
      "Use richer behavioral and financial signals to price risk more accurately and improve profitability.",
    icon: BadgeDollarSign,
  },
  {
    title: "Prevent loss early",
    description:
      "Detect changes in risk, fraud signals and vulnerabilities before they become losses.",
    icon: ShieldAlert,
  },
  {
    title: "Grow higher-quality business",
    description:
      "Identify lower-risk customers and segments and focus growth where risk-adjusted value is strongest.",
    icon: TrendingUp,
  },
  {
    title: "Improve portfolio performance",
    description:
      "Monitor risk, losses and portfolio trends continuously and act when conditions change.",
    icon: LineChart,
  },
];

export const insurersUseCases = {
  insurance: [
    {
      title: "Stronger underwriting",
      icon: ClipboardCheck,
      points: [
        "Improve risk selection with behavioral and financial signals",
        "Reduce adverse selection",
        "Automate and enrich risk assessment",
      ],
    },
    {
      title: "Pricing & profitability",
      icon: Percent,
      points: [
        "Price risk using behavioral and real-world signals",
        "Improve loss ratios",
        "Optimize pricing for profitability",
      ],
    },
    {
      title: "Fraud detection & prevention",
      icon: ScanSearch,
      points: [
        "Detect anomalous behavioral and transaction patterns",
        "Identify suspicious claims and activity earlier",
        "Reduce fraud leakage and unnecessary losses",
      ],
    },
    {
      title: "Claims triage & management",
      icon: FolderKanban,
      points: [
        "Prioritize and route claims using richer context",
        "Identify suspicious claims earlier",
        "Improve settlement decisions and outcomes",
      ],
    },
    {
      title: "Portfolio monitoring & insights",
      icon: PieChart,
      points: [
        "Track risk, exposure and performance",
        "Run scenario analysis and stress tests",
        "Surface actionable portfolio and management insights",
      ],
    },
  ],
  lending: [
    {
      title: "Credit decisioning",
      icon: Scale,
      points: [
        "Richer underwriting context beyond bureau scores",
        "Reduce false declines and adverse selection",
        "Support consistent, explainable decisions",
      ],
    },
    {
      title: "Pricing & limit setting",
      icon: Percent,
      points: [
        "Price facilities with behavioral and cash-flow signals",
        "Set limits that fit actual capacity",
        "Improve risk-adjusted return",
      ],
    },
    {
      title: "Early delinquency & fraud",
      icon: ScanSearch,
      points: [
        "Flag stress and anomalous repayment patterns early",
        "Reduce fraud and application risk",
        "Intervene before losses compound",
      ],
    },
    {
      title: "Collections prioritization",
      icon: Wallet,
      points: [
        "Rank accounts by urgency and recoverability",
        "Focus outreach where it matters most",
        "Improve recovery outcomes",
      ],
    },
    {
      title: "Portfolio monitoring",
      icon: Landmark,
      points: [
        "Track exposure, risk migration and concentration",
        "Run scenarios across segments",
        "Give credit and risk teams clearer reports",
      ],
    },
  ],
} as const;

export const insurersWorkflow: Array<{
  title: string;
  description: string;
  icon: LucideIcon;
}> = [
  {
    title: "Connect securely",
    description:
      "Integrate via API or file upload. Read-only access. You stay in control.",
    icon: ShieldCheck,
  },
  {
    title: "We analyze",
    description:
      "Rimbun connects and analyzes your data using proprietary models.",
    icon: Share2,
  },
  {
    title: "Deliver insights",
    description: "Scores, alerts and recommendations in your workflows.",
    icon: Lightbulb,
  },
  {
    title: "Take action",
    description: "Act in your systems and measure impact over time.",
    icon: MessagesSquare,
  },
];

export const insurersTrust: Array<{
  title: string;
  description: string;
  icon: LucideIcon;
}> = [
  {
    title: "No PII required",
    description:
      "We don’t need personal identifiers to deliver valuable insights.",
    icon: UserX,
  },
  {
    title: "You own your data",
    description:
      "Your data stays yours. You decide what we see and for how long.",
    icon: Database,
  },
  {
    title: "Secure by design",
    description:
      "Encryption in transit and at rest. Role-based access and audit logs.",
    icon: Lock,
  },
  {
    title: "Comply with confidence",
    description:
      "Designed for PDPO-aligned deployments and local regulatory requirements.",
    icon: BadgeCheck,
  },
];

export const insurersHeroMetrics = [
  {
    label: "Policies assessed",
    value: "12.4K",
    detail: "+18% vs last 12M",
    positive: true,
  },
  {
    label: "High risk flagged",
    value: "1.2K",
    detail: "-12% vs last 12M",
    positive: true,
  },
  {
    label: "Losses prevented",
    value: "$3.6M",
    detail: "+24% vs last 12M",
    positive: true,
  },
  {
    label: "Premium impact",
    value: "+$5.8M",
    detail: "+19% vs last 12M",
    positive: true,
  },
] as const;
