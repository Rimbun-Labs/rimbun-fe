import type { LucideIcon } from "lucide-react";
import {
  Landmark,
  BookOpen,
  Boxes,
  FileText,
  Radio,
  Eye,
  Zap,
  ShieldAlert,
  Lightbulb,
  UserX,
  Database,
  Shield,
  BadgeCheck,
  AlertTriangle,
  TrendingUp,
  ShieldCheck,
  Share2,
  MessagesSquare,
} from "lucide-react";

export const businessesHero = {
  eyebrow: "FOR BUSINESSES",
  title: "Make clearer money decisions. Run your business with more confidence.",
  lead: "Rimbun turns your financial and operational data into practical intelligence—so you know what’s coming, what to do, and where to focus next.",
};

export const businessesDataSources: Array<{
  title: string;
  description: string;
  icon: LucideIcon;
}> = [
  {
    title: "Bank transactions",
    description: "Accounts, card, payments and receipts",
    icon: Landmark,
  },
  {
    title: "Accounting data",
    description: "Sales, purchases, AR/AP, P&L and balance sheet",
    icon: BookOpen,
  },
  {
    title: "Operational data",
    description: "Inventory, orders, bookings, projects, customers",
    icon: Boxes,
  },
  {
    title: "Financing & obligations",
    description: "Loans, leases, facilities, repayment schedules",
    icon: FileText,
  },
  {
    title: "External signals",
    description: "Market, sector and seasonal indicators",
    icon: Radio,
  },
];

export const businessesOutputs = [
  "Cash flow forecasting",
  "Working capital insights",
  "Risk & early warnings",
  "Recommendations",
] as const;

export const businessesOutcomes: Array<{
  title: string;
  description: string;
  icon: LucideIcon;
}> = [
  {
    title: "See what’s ahead",
    description:
      "Cash flow projections and scenario views so you can plan with confidence.",
    icon: Eye,
  },
  {
    title: "Act on time",
    description:
      "Clear actions to improve cash flow, reduce costs, and strengthen performance.",
    icon: Zap,
  },
  {
    title: "Reduce risk",
    description:
      "Early warnings on cash dips, overdue accounts, margin pressure and stock aging.",
    icon: ShieldAlert,
  },
  {
    title: "Find opportunities",
    description:
      "Spot where to invest, negotiate better terms, and unlock working capital.",
    icon: Lightbulb,
  },
];

export const businessesWorkflow: Array<{
  title: string;
  description: string;
  icon: LucideIcon;
}> = [
  {
    title: "Connect securely",
    description:
      "Connect your data securely via API or file upload. You stay in control.",
    icon: ShieldCheck,
  },
  {
    title: "We analyze",
    description:
      "Rimbun connects and analyzes your data using proprietary models.",
    icon: Share2,
  },
  {
    title: "Get insights",
    description:
      "Dashboards, alerts and recommendations tailored to your business.",
    icon: Lightbulb,
  },
  {
    title: "Take action",
    description: "Act in your systems and track the impact over time.",
    icon: MessagesSquare,
  },
];

export const businessesTrust: Array<{
  title: string;
  description: string;
  icon: LucideIcon;
}> = [
  {
    title: "No PII required",
    description:
      "We don’t need personal identifiers to deliver useful intelligence.",
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
    icon: Shield,
  },
  {
    title: "Comply with confidence",
    description:
      "Designed for PDPO-aligned deployments and local regulatory requirements.",
    icon: BadgeCheck,
  },
];

export const businessesHeroMetrics: Array<{
  count: string;
  label: string;
  detail: string;
  tone: "blue" | "amber" | "green" | "purple";
  icon: LucideIcon;
}> = [
  {
    count: "5",
    label: "Actions",
    detail: "recommended",
    tone: "blue",
    icon: Zap,
  },
  {
    count: "3",
    label: "Warnings",
    detail: "to watch",
    tone: "amber",
    icon: AlertTriangle,
  },
  {
    count: "4",
    label: "Opportunities",
    detail: "potential upside",
    tone: "green",
    icon: TrendingUp,
  },
];
