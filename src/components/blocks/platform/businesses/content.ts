import type { LucideIcon } from "lucide-react";
import {
  ShoppingCart,
  UserRound,
  Coins,
  TrendingUp,
  ArrowLeftRight,
  BookOpen,
  Boxes,
  Layers,
  Lightbulb,
  AlertTriangle,
  ListChecks,
} from "lucide-react";

export const businessesHero = {
  eyebrow: "FOR BUSINESSES",
  title: "Know what your business can afford to do next.",
  lead: "Rimbun uses the data you already have to give you clear answers and recommendations, so you can move forward with confidence.",
};

export const businessesDecisions: Array<{
  question: string;
  detail: string;
  status: "yes" | "review";
  tone: "green" | "blue" | "amber" | "purple";
  icon: LucideIcon;
}> = [
  {
    question: "Can I buy £60k of stock?",
    detail: "Yes, without putting your cash buffer at risk.",
    status: "yes",
    tone: "green",
    icon: ShoppingCart,
  },
  {
    question: "Can I hire another person?",
    detail: "From November, based on current commitments.",
    status: "yes",
    tone: "blue",
    icon: UserRound,
  },
  {
    question: "Where can I free up cash?",
    detail: "£38k tied up in overdue receivables.",
    status: "review",
    tone: "amber",
    icon: Coins,
  },
  {
    question: "Can I invest in new equipment?",
    detail: "Likely, with manageable impact on cash flow.",
    status: "yes",
    tone: "purple",
    icon: TrendingUp,
  },
];

export const decisionIconStyles: Record<
  "green" | "blue" | "amber" | "purple",
  { well: string; icon: string }
> = {
  green: { well: "bg-[#dcefe4]", icon: "text-[#1B4D3E]" },
  blue: { well: "bg-[#dde7f5]", icon: "text-[#2b4f7a]" },
  amber: { well: "bg-[#f3e6d4]", icon: "text-[#8a5530]" },
  purple: { well: "bg-[#e8e0f4]", icon: "text-[#5b4578]" },
};

export const businessesDataInputs: Array<{
  title: string;
  icon: LucideIcon;
}> = [
  { title: "Transactions", icon: ArrowLeftRight },
  { title: "Accounting", icon: BookOpen },
  { title: "Operational data", icon: Boxes },
  { title: "Other sources", icon: Layers },
];

export const businessesAnswers: Array<{
  title: string;
  icon: LucideIcon;
  tone: "blue" | "amber" | "purple";
}> = [
  { title: "Opportunities", icon: Lightbulb, tone: "blue" },
  { title: "Risks", icon: AlertTriangle, tone: "amber" },
  { title: "Next steps", icon: ListChecks, tone: "purple" },
];

export const answerIconStyles: Record<
  "blue" | "amber" | "purple",
  { well: string; icon: string }
> = {
  blue: { well: "bg-[#dde7f5]", icon: "text-[#2b4f7a]" },
  amber: { well: "bg-[#f8ead8]", icon: "text-[#9a5b1f]" },
  purple: { well: "bg-[#e8e0f4]", icon: "text-[#5b4578]" },
};
