import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type PathTone = "green" | "blue" | "amber";

const pathStyles: Record<
  PathTone,
  { card: string; well: string; icon: string }
> = {
  green: {
    card: "bg-[#e8f3ec] hover:bg-[#dff0e6]",
    well: "bg-white/70",
    icon: "text-[#1B4D3E]",
  },
  blue: {
    card: "bg-[#e8eef8] hover:bg-[#dde7f5]",
    well: "bg-white/70",
    icon: "text-[#2b4f7a]",
  },
  amber: {
    card: "bg-[#f6ebe3] hover:bg-[#f1e2d7]",
    well: "bg-white/70",
    icon: "text-[#8a5530]",
  },
};

interface PathCardProps {
  title: string;
  description: string;
  href: string;
  tone: PathTone;
  icon: LucideIcon;
}

/** Soft full-tint cards for “Choose your path”. */
export function PathCard({
  title,
  description,
  href,
  tone,
  icon: Icon,
}: PathCardProps) {
  const styles = pathStyles[tone];

  return (
    <Link
      to={href}
      className={cn(
        "group flex h-full flex-col rounded-[22px] p-6 transition-colors",
        styles.card,
      )}
    >
      <div
        className={cn(
          "flex h-11 w-11 items-center justify-center rounded-[14px]",
          styles.well,
        )}
      >
        <Icon className={cn("h-5 w-5", styles.icon)} strokeWidth={1.75} />
      </div>
      <h3 className="mt-5 text-[18px] font-semibold tracking-tight text-[#15241f]">
        {title}
      </h3>
      <p className="mt-2 flex-1 text-[14px] leading-relaxed text-[#4b5563]">
        {description}
      </p>
      <span className="mt-5 text-[14px] font-medium text-[#15241f] group-hover:underline">
        Explore ?
      </span>
    </Link>
  );
}
