import {
  ChevronDown,
  ChevronRight,
  Home,
  BarChart3,
  FileText,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/Logo";
import { businessesDecisions, decisionIconStyles } from "./content";

/** Hero preview — key decisions with short explanations. */
export function BusinessesHeroPreview() {
  return (
    <div className="overflow-hidden rounded-[22px] border border-[#e8e8ea] bg-white shadow-[0_18px_50px_rgba(11,61,52,0.10)]">
      <div className="flex min-h-[320px]">
        {/* Decorative app chrome — not interactive */}
        <aside
          className="hidden w-12 shrink-0 flex-col items-center gap-4 border-r border-[#eef0f2] bg-[#f7f8f8] py-4 sm:flex"
          aria-hidden
        >
          <Logo size="sm" variant="header" />
          <Home className="h-4 w-4 text-[#9ca3af]" strokeWidth={1.75} />
          <BarChart3 className="h-4 w-4 text-[#9ca3af]" strokeWidth={1.75} />
          <FileText className="h-4 w-4 text-[#9ca3af]" strokeWidth={1.75} />
          <Settings className="mt-auto h-4 w-4 text-[#9ca3af]" strokeWidth={1.75} />
        </aside>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3 border-b border-[#eef0f2] px-4 py-3.5 sm:px-5">
            <p className="text-[15px] font-semibold tracking-tight text-[#15241f]">
              Key decisions
            </p>
            <span className="inline-flex items-center gap-1 rounded-full border border-[#e5e7eb] bg-[#f8f9fa] px-2.5 py-1 text-[12px] text-[#5b6570]">
              This month
              <ChevronDown className="h-3.5 w-3.5" />
            </span>
          </div>

          <ul className="divide-y divide-[#eef0f2]">
            {businessesDecisions.map((item) => {
              const Icon = item.icon;
              const styles = decisionIconStyles[item.tone];
              return (
                <li
                  key={item.question}
                  className="flex items-center gap-3 px-4 py-3.5 sm:gap-3.5 sm:px-5"
                >
                  <div
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                      styles.well,
                    )}
                  >
                    <Icon
                      className={cn("h-4 w-4", styles.icon)}
                      strokeWidth={1.75}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-semibold leading-snug text-[#15241f] sm:text-[14px]">
                      {item.question}
                    </p>
                    <p className="mt-0.5 text-[12px] leading-snug text-[#6b7280]">
                      {item.detail}
                    </p>
                  </div>
                  {item.status === "yes" ? (
                    <span className="inline-flex shrink-0 items-center gap-0.5 rounded-full bg-[#e4f3ea] py-1 pl-2.5 pr-1.5 text-[12px] font-semibold text-[#1B4D3E]">
                      Yes
                      <ChevronRight className="h-3.5 w-3.5 opacity-70" />
                    </span>
                  ) : (
                    <span className="inline-flex shrink-0 items-center gap-0.5 rounded-full bg-[#f8ead8] py-1 pl-2.5 pr-1.5 text-[12px] font-semibold text-[#9a5b1f]">
                      Review
                      <ChevronRight className="h-3.5 w-3.5 opacity-70" />
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
