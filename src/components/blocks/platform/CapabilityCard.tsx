import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { accentStyles, type AccentTone } from "./content";

interface CapabilityCardProps {
  title: string;
  items: readonly string[];
  tone: AccentTone;
  icon: LucideIcon;
}

export function CapabilityCard({
  title,
  items,
  tone,
  icon: Icon,
}: CapabilityCardProps) {
  const styles = accentStyles[tone];

  return (
    <div className="rounded-[20px] border border-[#e8e8ea] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] dark:border-border dark:bg-card md:p-6">
      <div className="flex items-center gap-2.5">
        <div
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-full",
            styles.well
          )}
        >
          <Icon className={cn("h-4 w-4", styles.icon)} strokeWidth={1.75} />
        </div>
        <h3 className="text-[16px] font-semibold tracking-tight text-foreground">
          {title}
        </h3>
      </div>
      <ul className="mt-4 space-y-2.5">
        {items.map((item) => (
          <li
            key={item}
            className="flex gap-2.5 text-[13px] leading-snug text-[#6b7280] dark:text-muted-foreground"
          >
            <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-[#9ca3af]" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
