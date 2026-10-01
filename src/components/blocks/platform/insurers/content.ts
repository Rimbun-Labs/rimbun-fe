import type { LucideIcon } from "lucide-react";
import {
  ShieldCheck,
  Percent,
  AlertTriangle,
  BarChart3,
  Database,
  Lightbulb,
  Lock,
  FileText,
  ClipboardCheck,
} from "lucide-react";

export const insurersHero = {
  eyebrow: "FOR INSURERS & LENDERS",
  title: "Smarter risk decisions. Stronger outcomes.",
  lead: "Rimbun helps insurers and lenders assess risk, prevent loss and grow profitably.",
};

export const insurersCapabilities: Array<{
  title: string;
  tone: "green" | "blue" | "red" | "purple";
  icon: LucideIcon;
}> = [
  { title: "Underwriting", tone: "green", icon: ShieldCheck },
  { title: "Pricing", tone: "blue", icon: Percent },
  { title: "Claims & fraud", tone: "red", icon: AlertTriangle },
  { title: "Portfolio", tone: "purple", icon: BarChart3 },
];

export const capabilityStyles: Record<
  "green" | "blue" | "red" | "purple",
  { well: string; icon: string }
> = {
  green: { well: "bg-[#dcefe4]", icon: "text-[#1B4D3E]" },
  blue: { well: "bg-[#dde7f5]", icon: "text-[#2b4f7a]" },
  red: { well: "bg-[#fde8e8]", icon: "text-[#b42318]" },
  purple: { well: "bg-[#e8e0f4]", icon: "text-[#5b4578]" },
};

export const insurersSignals: Array<{
  label: string;
  tone: "good" | "warn";
}> = [
  { label: "Income stability", tone: "good" },
  { label: "Rising expenses", tone: "warn" },
  { label: "Low claim frequency", tone: "good" },
];

export const insurersOutputs: Array<{
  title: string;
  tone: "green" | "red" | "amber";
  icon: LucideIcon;
}> = [
  { title: "Scores", tone: "green", icon: BarChart3 },
  { title: "Signals", tone: "red", icon: AlertTriangle },
  { title: "Recommendations", tone: "amber", icon: Lightbulb },
];

export const outputStyles: Record<
  "green" | "red" | "amber",
  { well: string; icon: string }
> = {
  green: { well: "bg-[#dcefe4]", icon: "text-[#1B4D3E]" },
  red: { well: "bg-[#fde8e8]", icon: "text-[#b42318]" },
  amber: { well: "bg-[#f8ead8]", icon: "text-[#9a5b1f]" },
};

export const insurersTrustItems: Array<{
  label: string;
  icon: LucideIcon;
}> = [
  { label: "No PII required", icon: Lock },
  { label: "You control your data", icon: FileText },
  { label: "Audit logs", icon: ClipboardCheck },
];
