import { cn } from "@/lib/utils";
import { accentStyles, heroOutputSummary } from "./content";

export function IntelligencePreview() {
  return (
    <div className="overflow-hidden rounded-[20px] border border-[#e8e8ea] bg-white shadow-[0_12px_40px_rgba(0,0,0,0.06)] dark:border-border dark:bg-card">
      <div className="border-b border-[#e8e8ea] px-5 py-4 dark:border-border md:px-6 md:py-5">
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-[14px] font-semibold text-foreground">
            Cash position
          </p>
          <p className="text-[12px] text-[#6b7280]">Next 90 days</p>
        </div>
        <div className="mt-3 h-[120px] w-full">
          <svg
            viewBox="0 0 100 48"
            className="h-full w-full"
            preserveAspectRatio="none"
            aria-hidden
          >
            <defs>
              <linearGradient id="platformCashFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563eb" stopOpacity="0.16" />
                <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
              </linearGradient>
            </defs>
            <polygon
              points="2,30 14,34 26,22 38,28 50,16 62,24 74,20 86,12 98,18 98,48 2,48"
              fill="url(#platformCashFill)"
            />
            <polyline
              points="2,30 14,34 26,22 38,28 50,16 62,24 74,20"
              fill="none"
              stroke="#2563eb"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
            <polyline
              points="74,20 86,12 98,18"
              fill="none"
              stroke="#2563eb"
              strokeWidth="2.2"
              strokeDasharray="3.5 2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
              opacity="0.65"
            />
          </svg>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4">
        {heroOutputSummary.map((item, i) => {
          const styles = accentStyles[item.tone];
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className={cn(
                "px-3 py-4 md:px-4",
                i < 3 && "sm:border-r sm:border-[#e8e8ea] dark:sm:border-border",
                i < 2 && "border-b border-[#e8e8ea] dark:border-border sm:border-b-0"
              )}
            >
              <div
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full",
                  styles.well
                )}
              >
                <Icon className={cn("h-3.5 w-3.5", styles.icon)} strokeWidth={1.75} />
              </div>
              <p className="mt-2.5 text-[13px] font-semibold leading-tight text-foreground">
                {item.count} {item.label}
              </p>
              <p className="mt-0.5 text-[11px] text-[#6b7280]">{item.detail}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
