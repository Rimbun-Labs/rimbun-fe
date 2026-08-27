import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { accentStyles, type AccentTone } from "./content";

interface AudienceCardProps {
  title: string;
  description: string;
  href: string;
  tone: AccentTone;
  icon: LucideIcon;
}

/** Soft square icon wells — matches mockup "Who Rimbun helps". */
export function AudienceCard({
  title,
  description,
  href,
  tone,
  icon: Icon,
}: AudienceCardProps) {
  const styles = accentStyles[tone];

  return (
    <Link
      to={href}
      className="group flex flex-col rounded-[20px] border border-[#e8e8ea] bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)] dark:border-border dark:bg-card"
    >
      <div
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-[14px]",
          styles.well
        )}
      >
        <Icon className={cn("h-5 w-5", styles.icon)} strokeWidth={1.75} />
      </div>
      <h3 className="mt-4 text-[18px] font-semibold tracking-tight text-foreground">
        {title}
      </h3>
      <p className="mt-2 flex-1 text-[14px] leading-relaxed text-[#6b7280] dark:text-muted-foreground">
        {description}
      </p>
      <span className="mt-4 text-[14px] font-medium text-[#2563eb] group-hover:underline dark:text-primary">
        Explore →
      </span>
    </Link>
  );
}
