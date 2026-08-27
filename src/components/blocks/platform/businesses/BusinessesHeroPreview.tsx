import { cn } from "@/lib/utils";
import { accentStyles } from "../content";
import { businessesHeroMetrics } from "./content";

export function BusinessesHeroPreview() {
  return (
    <div className="overflow-hidden rounded-[20px] border border-[#e8e8ea] bg-white shadow-[0_12px_40px_rgba(0,0,0,0.06)] dark:border-border dark:bg-card">
      <div className="border-b border-[#e8e8ea] p-5 dark:border-border md:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[14px] font-semibold text-foreground">
              Cash position
            </p>
            <p className="mt-3 text-[12px] text-[#6b7280]">
              Projected cash position
            </p>
            <p className="mt-1 text-[28px] font-semibold tracking-tight text-foreground">
              $128,450
            </p>
            <p className="mt-1 text-[12px] font-medium text-[#059669]">
              ↑ $24,300 · +23%
            </p>
          </div>
          <p className="text-[12px] text-[#6b7280]">Next 90 days</p>
        </div>

        <div className="mt-4 h-[110px] w-full">
          <svg
            viewBox="0 0 100 48"
            className="h-full w-full"
            preserveAspectRatio="none"
            aria-hidden
          >
            <polyline
              points="2,30 18,28 34,32 50,24 66,26 82,18 98,20"
              fill="none"
              stroke="#2563eb"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
            <polyline
              points="2,26 18,22 34,24 50,16 66,14 82,10 98,8"
              fill="none"
              stroke="#059669"
              strokeWidth="1.6"
              strokeDasharray="3 2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
              opacity="0.85"
            />
            <polyline
              points="2,34 18,36 34,38 50,34 66,36 82,32 98,34"
              fill="none"
              stroke="#d97706"
              strokeWidth="1.6"
              strokeDasharray="3 2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
              opacity="0.85"
            />
          </svg>
        </div>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-[#6b7280]">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#2563eb]" />
            Base case
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#059669]" />
            Best case
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#d97706]" />
            Worst case
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4">
        {businessesHeroMetrics.map((item, i) => {
          const styles = accentStyles[item.tone];
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className={cn(
                "px-3 py-3.5 md:px-4",
                "border-b border-[#e8e8ea] dark:border-border lg:border-b-0",
                i % 2 === 0 && "border-r border-[#e8e8ea] dark:border-border",
                i < 2 && "lg:border-r lg:border-[#e8e8ea] dark:lg:border-border"
              )}
            >
              <div
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full",
                  styles.well
                )}
              >
                <Icon
                  className={cn("h-3.5 w-3.5", styles.icon)}
                  strokeWidth={1.75}
                />
              </div>
              <p className="mt-2 text-[13px] font-semibold leading-tight text-foreground">
                {item.count} {item.label}
              </p>
              <p className="mt-0.5 text-[11px] text-[#6b7280]">{item.detail}</p>
            </div>
          );
        })}
        <div className="border-l-0 px-3 py-3.5 md:px-4 lg:border-l lg:border-[#e8e8ea] dark:lg:border-border">
          <p className="text-[12px] font-semibold text-foreground">At a glance</p>
          <ul className="mt-2 space-y-1 text-[11px] leading-snug text-[#6b7280]">
            <li>Cash dip in late Aug</li>
            <li>Recovering in Sep</li>
            <li>Stronger Q4 outlook</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
