import type { LucideIcon } from "lucide-react";
import {
  Zap,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  Building2,
  Shield,
  Car,
  Plane,
  ShoppingCart,
  Landmark,
} from "lucide-react";
import type { PathTone } from "./PathCard";

export type AccentTone = "blue" | "amber" | "green" | "purple";

/** Soft tinted icon wells — matches audience mockups. */
export const accentStyles: Record<
  AccentTone,
  { icon: string; well: string }
> = {
  blue: {
    icon: "text-[#2563eb]",
    well: "bg-[#2563eb]/10",
  },
  amber: {
    icon: "text-[#d97706]",
    well: "bg-[#d97706]/10",
  },
  green: {
    icon: "text-[#059669]",
    well: "bg-[#059669]/10",
  },
  purple: {
    icon: "text-[#7c3aed]",
    well: "bg-[#7c3aed]/10",
  },
};

/** Homepage + header Solutions menu — order matches mockup. */
export const platformAudiences: Array<{
  id: string;
  title: string;
  description: string;
  href: string;
  tone: AccentTone;
  pathTone: PathTone;
  icon: LucideIcon;
}> = [
  {
    id: "businesses",
    title: "Businesses",
    description:
      "Understand what’s ahead and make better financial decisions.",
    href: "/businesses",
    tone: "green",
    pathTone: "green",
    icon: Building2,
  },
  {
    id: "banks",
    title: "Banks",
    description:
      "Understand customer financial behaviour and act earlier.",
    href: "/banks",
    tone: "blue",
    pathTone: "blue",
    icon: Landmark,
  },
  {
    id: "insurers",
    title: "Insurance",
    description:
      "Turn financial signals into better risk and customer decisions.",
    href: "/insurers-lenders",
    tone: "amber",
    pathTone: "amber",
    icon: Shield,
  },
];

export const platformCapabilities: Array<{
  id: string;
  title: string;
  items: string[];
  tone: AccentTone;
  icon: LucideIcon;
}> = [
  {
    id: "actions",
    title: "Actions",
    tone: "blue",
    icon: Zap,
    items: [
      "Put idle cash to work",
      "Slow stock tying up capital",
      "Build reserves before a gap",
    ],
  },
  {
    id: "warnings",
    title: "Warnings",
    tone: "amber",
    icon: AlertTriangle,
    items: [
      "Cash runway getting short",
      "Receivables taking longer to collect",
      "Outflows rising faster than inflows",
    ],
  },
  {
    id: "operating",
    title: "Operating moves",
    tone: "green",
    icon: TrendingUp,
    items: [
      "When to pay suppliers",
      "What to chase first",
      "Where costs are creeping",
    ],
  },
  {
    id: "finance",
    title: "When finance fits",
    tone: "purple",
    icon: BarChart3,
    items: [
      "Short deposit for surplus",
      "Facility before a crunch",
      "Invoice finance when collections drag",
    ],
  },
];

export const platformExamples: Array<{
  id: string;
  title: string;
  lines: string[];
  href: string;
  tone: AccentTone;
  icon: LucideIcon;
}> = [
  {
    id: "dealership",
    title: "Dealership",
    href: "/businesses",
    tone: "blue",
    icon: Car,
    lines: [
      "Stock aging → free working capital",
      "Floor-plan vs cash for the next buy",
    ],
  },
  {
    id: "travel",
    title: "Travel & hospitality",
    href: "/businesses",
    tone: "green",
    icon: Plane,
    lines: [
      "Seasonal dip ahead → how much to hold",
      "Supplier terms worsening the cash dip",
    ],
  },
  {
    id: "retail",
    title: "Retail / trading",
    href: "/businesses",
    tone: "purple",
    icon: ShoppingCart,
    lines: [
      "Surplus between cycles → place it",
      "Overdue accounts → who to chase",
    ],
  },
];

export const platformRoutes: Array<{
  id: string;
  title: string;
  description: string;
  href: string;
  tone: AccentTone;
  icon: LucideIcon;
}> = [
  {
    id: "business",
    title: "Use Rimbun for your business",
    description: "Get clarity on cash, operations, and when finance fits.",
    href: "/businesses",
    tone: "blue",
    icon: Building2,
  },
  {
    id: "bank",
    title: "Embed Rimbun in your bank",
    description: "Deliver smarter guidance inside your platform.",
    href: "/banks",
    tone: "green",
    icon: Landmark,
  },
  {
    id: "risk",
    title: "Use Rimbun for lending & risk",
    description:
      "Make stronger credit and risk decisions from behavioral signals.",
    href: "/insurers-lenders",
    tone: "purple",
    icon: Shield,
  },
];

export const heroOutputSummary: Array<{
  count: string;
  label: string;
  detail: string;
  tone: AccentTone;
  icon: LucideIcon;
}> = [
  { count: "2", label: "Actions", detail: "This week", tone: "blue", icon: Zap },
  {
    count: "3",
    label: "Warnings",
    detail: "Active",
    tone: "amber",
    icon: AlertTriangle,
  },
  {
    count: "4",
    label: "Operating moves",
    detail: "Recommended",
    tone: "green",
    icon: TrendingUp,
  },
  {
    count: "1",
    label: "Finance fit",
    detail: "Available",
    tone: "purple",
    icon: BarChart3,
  },
];
