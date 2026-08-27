import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { accentStyles, type AccentTone } from "./content";

interface RouteCardProps {
  title: string;
  description: string;
  href: string;
  tone: AccentTone;
  icon: LucideIcon;
}

/** Mockup: 3-up cards — square icon well, copy, trailing arrow. */
export function RouteCard({
  title,
  description,
  href,
  tone,
  icon: Icon,
}: RouteCardProps) {
  const styles = accentStyles[tone];

  return (
    <Link
      to={href}
      className="group flex h-full items-start gap-3 rounded-[16px] border border-[#e8e8ea] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors hover:bg-white/90 dark:border-border dark:bg-card"
    >
      <div
        className={cn(
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px]",
          styles.well
        )}
      >
        <Icon className={cn("h-5 w-5", styles.icon)} strokeWidth={1.75} />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="text-[15px] font-semibold leading-snug tracking-tight text-foreground">
          {title}
        </h3>
        <p className="mt-1.5 text-[13px] leading-snug text-[#6b7280] dark:text-muted-foreground">
          {description}
        </p>
      </div>
      <ArrowRight
        className="mt-1 h-4 w-4 shrink-0 text-[#9ca3af] transition-transform group-hover:translate-x-0.5"
        strokeWidth={1.75}
        aria-hidden
      />
    </Link>
  );
}
