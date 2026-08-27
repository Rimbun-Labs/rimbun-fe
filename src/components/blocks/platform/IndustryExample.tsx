import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { accentStyles, type AccentTone } from "./content";

interface IndustryExampleProps {
  title: string;
  lines: readonly string[];
  href: string;
  tone: AccentTone;
  icon: LucideIcon;
  /** Add a left border divider on desktop (mockup columns). */
  divided?: boolean;
}

/** Mockup: circular icon wells, no card chrome, columns with hairline dividers. */
export function IndustryExample({
  title,
  lines,
  href,
  tone,
  icon: Icon,
  divided = false,
}: IndustryExampleProps) {
  const styles = accentStyles[tone];
  const body = lines.map((line) => line.replace(/\.$/, "")).join(". ") + ".";

  return (
    <div
      className={cn(
        "py-1 md:px-6",
        divided && "md:border-l md:border-[#e8e8ea] dark:md:border-border",
        !divided && "md:pl-0"
      )}
    >
      <div className="flex items-start gap-3.5">
        <div
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-full",
            styles.well
          )}
        >
          <Icon className={cn("h-4 w-4", styles.icon)} strokeWidth={1.75} />
        </div>
        <div className="min-w-0">
          <h3 className="text-[16px] font-semibold tracking-tight text-foreground">
            {title}
          </h3>
          <p className="mt-2 text-[14px] leading-relaxed text-[#6b7280] dark:text-muted-foreground">
            {body}
          </p>
          <Link
            to={href}
            className="mt-3 inline-block text-[13px] font-medium text-[#2563eb] hover:underline dark:text-primary"
          >
            Learn more →
          </Link>
        </div>
      </div>
    </div>
  );
}
