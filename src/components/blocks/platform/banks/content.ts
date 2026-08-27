import type { LucideIcon } from "lucide-react";
import {
  User,
  Shield,
  TrendingUp,
  Heart,
  Gauge,
  Sparkles,
  Target,
  Bell,
  BarChart3,
  Server,
  GitBranch,
  Layers,
  Plug,
  LineChart,
  Zap,
  AlertTriangle,
  ArrowUpRight,
  CalendarCheck,
  FileLock2,
  ShieldCheck,
  ClipboardList,
  Lock,
} from "lucide-react";

export const banksHero = {
  eyebrow: "FOR BANKS",
  title: "Turn customer financial behavior into clearer decisions and recommendations.",
  lead: "Rimbun gives banks an intelligence layer on top of existing customer data, helping teams understand financial behavior earlier and act with more confidence.",
};

export const banksValueProps: Array<{
  title: string;
  description: string;
  icon: LucideIcon;
}> = [
  {
    title: "Know your customers in real time",
    description:
      "Understand how customers actually manage money from how they already transact.",
    icon: User,
  },
  {
    title: "Act earlier on risk",
    description:
      "Spot financial stress and changing behavior earlier with forward-looking signals.",
    icon: Shield,
  },
  {
    title: "Recommend with confidence",
    description:
      "Make product recommendations and advice more timely, relevant and personalized.",
    icon: TrendingUp,
  },
  {
    title: "Strengthen relationships",
    description:
      "Support customers with more relevant guidance at the moments that matter.",
    icon: Heart,
  },
];

export const banksUseCases = {
  retail: [
    {
      title: "Financial health monitoring",
      icon: Gauge,
      points: [
        "Track financial health over time",
        "Understand income stability and cash flow patterns",
      ],
    },
    {
      title: "Early risk identification",
      icon: Sparkles,
      points: [
        "Detect stress signals early",
        "Reduce delinquencies and unexpected losses",
      ],
    },
    {
      title: "Personalized recommendations",
      icon: Target,
      points: [
        "Right product, right time",
        "Improve conversion and wallet share",
      ],
    },
    {
      title: "Life event awareness",
      icon: Bell,
      points: [
        "Identify life events that change behavior",
        "Offer relevant support early",
      ],
    },
    {
      title: "Portfolio intelligence",
      icon: BarChart3,
      points: [
        "Segment with real behavior, not static profiles",
        "Make data-led decisions at scale",
      ],
    },
  ],
  sme: [
    {
      title: "Cash flow visibility",
      icon: Gauge,
      points: [
        "See runway and working-capital pressure early",
        "Spot inflow/outflow shifts before they compound",
      ],
    },
    {
      title: "Early risk identification",
      icon: Sparkles,
      points: [
        "Flag stress across receivables, payables, and balances",
        "Give RMs earlier context for intervention",
      ],
    },
    {
      title: "Fit-for-purpose recommendations",
      icon: Target,
      points: [
        "Surface deposits, facilities, or ops moves when they fit",
        "Improve relevance without generic product pushes",
      ],
    },
    {
      title: "Operating moment awareness",
      icon: Bell,
      points: [
        "Catch supplier, stock, and seasonality pressure",
        "Support clients in the moments that matter",
      ],
    },
    {
      title: "Portfolio intelligence",
      icon: BarChart3,
      points: [
        "Segment SMEs by real behavior, not static labels",
        "Prioritize outreach and credit review with evidence",
      ],
    },
  ],
} as const;

export const banksWorkflow: Array<{
  title: string;
  description: string;
  icon: LucideIcon;
}> = [
  {
    title: "Secure data access",
    description:
      "Connect via API or secure file transfer. Read-only and permission-controlled.",
    icon: Server,
  },
  {
    title: "Behavioral analysis",
    description:
      "Rimbun's models turn transactions into signals and forward-looking insights.",
    icon: GitBranch,
  },
  {
    title: "Intelligence layer",
    description:
      "We generate scores, signals, and recommendations with clear explanations.",
    icon: Layers,
  },
  {
    title: "Delivered to you",
    description:
      "Insights flow into your systems and workflows in real time.",
    icon: Plug,
  },
  {
    title: "Better outcomes",
    description:
      "Earlier action, better advice, stronger relationships, healthier portfolios.",
    icon: LineChart,
  },
];

export const banksTrustItems: Array<{
  label: string;
  icon: LucideIcon;
}> = [
  { label: "Read-only access", icon: FileLock2 },
  { label: "No PII shared with Rimbun", icon: ShieldCheck },
  { label: "Designed for PDPO-aligned deployments", icon: Shield },
  { label: "Audit trails and logs", icon: ClipboardList },
  { label: "Bank-grade encryption", icon: Lock },
];

export const banksHeroMetrics: Array<{
  count: string;
  label: string;
  detail: string;
  tone: "blue" | "amber" | "green" | "purple";
  icon: LucideIcon;
}> = [
  {
    count: "4",
    label: "Actions",
    detail: "recommended",
    tone: "blue",
    icon: Zap,
  },
  {
    count: "2",
    label: "Warnings",
    detail: "to monitor",
    tone: "amber",
    icon: AlertTriangle,
  },
  {
    count: "3",
    label: "Operating moves",
    detail: "opportunities",
    tone: "green",
    icon: ArrowUpRight,
  },
  {
    count: "2",
    label: "When finance fits",
    detail: "options",
    tone: "purple",
    icon: CalendarCheck,
  },
];
