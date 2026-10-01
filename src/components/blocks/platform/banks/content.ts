import type { LucideIcon } from "lucide-react";
import {
  UserRound,
  Building2,
  Zap,
  AlertTriangle,
  Lightbulb,
  CalendarCheck,
  Monitor,
  Code2,
  BarChart3,
  Users,
  Database,
  EyeOff,
  ClipboardList,
  ShieldCheck,
} from "lucide-react";

export type BanksAudienceTab = "retail" | "sme";

export const banksHero = {
  eyebrow: "FOR BANKS",
  title: "Turn customer financial behaviour into clearer decisions.",
};

export const banksAudienceTabs: Array<{
  id: BanksAudienceTab;
  label: string;
  icon: LucideIcon;
}> = [
  { id: "retail", label: "Retail banking", icon: UserRound },
  { id: "sme", label: "SME banking", icon: Building2 },
];

export const banksHeroByTab: Record<
  BanksAudienceTab,
  {
    name: string;
    subtitle: string;
    score: string;
    scoreLabel: string;
  }
> = {
  retail: {
    name: "Customer A",
    subtitle: "Retail customer · 3 years",
    score: "723",
    scoreLabel: "Good",
  },
  sme: {
    name: "Business A",
    subtitle: "SME customer · 5 years",
    score: "641",
    scoreLabel: "Fair",
  },
};

export const banksHeroMetrics: Array<{
  count: string;
  label: string;
  tone: "green" | "red" | "amber" | "purple";
  icon: LucideIcon;
}> = [
  { count: "4", label: "Actions", tone: "green", icon: Zap },
  { count: "2", label: "Warnings", tone: "red", icon: AlertTriangle },
  { count: "3", label: "Opportunities", tone: "amber", icon: Lightbulb },
  { count: "2", label: "When finance fits", tone: "purple", icon: CalendarCheck },
];

export const heroMetricStyles: Record<
  "green" | "red" | "amber" | "purple",
  { well: string; icon: string; text: string }
> = {
  green: {
    well: "bg-[#dcefe4]",
    icon: "text-[#1B4D3E]",
    text: "text-[#1B4D3E]",
  },
  red: {
    well: "bg-[#fde8e8]",
    icon: "text-[#b42318]",
    text: "text-[#b42318]",
  },
  amber: {
    well: "bg-[#f8ead8]",
    icon: "text-[#9a5b1f]",
    text: "text-[#9a5b1f]",
  },
  purple: {
    well: "bg-[#e8e0f4]",
    icon: "text-[#5b4578]",
    text: "text-[#5b4578]",
  },
};

export const banksDeliveryModes: Array<{
  id: "dashboard" | "api";
  title: string;
  description: string;
  tone: "green" | "blue";
  icon: LucideIcon;
}> = [
  {
    id: "dashboard",
    title: "RM Dashboard",
    description: "Insights and next best actions for your teams.",
    tone: "green",
    icon: Monitor,
  },
  {
    id: "api",
    title: "API",
    description: "Embed Rimbun intelligence into your products.",
    tone: "blue",
    icon: Code2,
  },
];

export const banksPortfolioRows: Array<{
  name: string;
  score: string;
  action: string;
  actionTone: "green" | "amber" | "blue" | "purple";
}> = [
  { name: "Customer A", score: "723", action: "Grow", actionTone: "green" },
  { name: "Customer B", score: "568", action: "Review", actionTone: "amber" },
  {
    name: "Business A",
    score: "641",
    action: "Opportunity",
    actionTone: "blue",
  },
  {
    name: "Business B",
    score: "482",
    action: "Monitor",
    actionTone: "purple",
  },
];

export const actionToneStyles: Record<
  "green" | "amber" | "blue" | "purple",
  string
> = {
  green: "bg-[#e4f3ea] text-[#1B4D3E]",
  amber: "bg-[#f8ead8] text-[#9a5b1f]",
  blue: "bg-[#dde7f5] text-[#2b4f7a]",
  purple: "bg-[#e8e0f4] text-[#5b4578]",
};

export const banksCapabilities: Array<{
  title: string;
  tone: "green" | "red" | "amber" | "purple";
  icon: LucideIcon;
}> = [
  { title: "Financial health", tone: "green", icon: BarChart3 },
  { title: "Risk signals", tone: "red", icon: AlertTriangle },
  { title: "Opportunities", tone: "amber", icon: Lightbulb },
  { title: "Recommendations", tone: "purple", icon: Users },
];

export const banksTrustItems: Array<{
  label: string;
  icon: LucideIcon;
}> = [
  { label: "No PII shared", icon: EyeOff },
  { label: "Audit trails", icon: ClipboardList },
  { label: "Bank-grade encryption", icon: ShieldCheck },
];

export const banksFlowNodes = {
  data: { title: "Your customer data", icon: Database },
  outputs: [
    { title: "RM Dashboard", icon: Monitor },
    { title: "API", icon: Code2 },
  ],
} as const;
