import { HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export function FiDemoInfoHint({
  text,
  label,
  stopPropagation,
  className,
  iconClassName,
}: {
  text: string;
  /** Used for aria-label and screen readers */
  label: string;
  /** Use inside clickable rows so the hint does not change selection */
  stopPropagation?: boolean;
  className?: string;
  iconClassName?: string;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className={cn(
            "inline-flex shrink-0 rounded-full text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            className
          )}
          aria-label={`About: ${label}`}
          onClick={stopPropagation ? (e) => e.stopPropagation() : undefined}
        >
          <HelpCircle className={cn("h-3.5 w-3.5", iconClassName)} />
        </button>
      </TooltipTrigger>
      <TooltipContent
        side="top"
        className="max-w-[min(320px,calc(100vw-2rem))] text-xs leading-relaxed"
      >
        {text}
      </TooltipContent>
    </Tooltip>
  );
}
