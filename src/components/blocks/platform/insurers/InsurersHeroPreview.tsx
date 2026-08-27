import { cn } from "@/lib/utils";
import { insurersHeroMetrics } from "./content";

export function InsurersHeroPreview() {
  return (
    <div className="overflow-hidden rounded-[20px] border border-[#e8e8ea] bg-white shadow-[0_12px_40px_rgba(0,0,0,0.06)] dark:border-border dark:bg-card">
      <div className="grid gap-4 border-b border-[#e8e8ea] p-5 dark:border-border md:grid-cols-[150px_1fr] md:p-6">
        <div className="flex flex-col items-center justify-center rounded-[14px] bg-[#f7f7f8] px-3 py-4 dark:bg-muted/40">
          <p className="text-[11px] font-medium text-[#6b7280]">
            Portfolio risk overview
          </p>
          <div className="relative mt-2 flex h-[88px] w-[88px] items-center justify-center">
            <svg viewBox="0 0 100 100" className="absolute inset-0" aria-hidden>
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#059669"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 40 * 0.72} ${2 * Math.PI * 40}`}
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div className="text-center">
              <p className="text-[22px] font-semibold leading-none text-foreground">
                72
              </p>
              <p className="mt-1 text-[11px] font-medium text-[#059669]">
                Good
              </p>
            </div>
          </div>
          <div className="mt-3 w-full space-y-1 text-[10px] text-[#6b7280]">
            <div className="flex justify-between">
              <span>Low risk</span>
              <span className="font-medium text-foreground">58%</span>
            </div>
            <div className="flex justify-between">
              <span>Medium risk</span>
              <span className="font-medium text-foreground">32%</span>
            </div>
            <div className="flex justify-between">
              <span>High risk</span>
              <span className="font-medium text-foreground">10%</span>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-[14px] font-semibold text-foreground">
              Loss ratio trend
            </p>
            <p className="text-[12px] text-[#6b7280]">12 months</p>
          </div>
          <div className="mt-3 h-[110px] w-full">
            <svg
              viewBox="0 0 100 48"
              className="h-full w-full"
              preserveAspectRatio="none"
              aria-hidden
            >
              <polyline
                points="2,28 14,26 26,30 38,24 50,27 62,22 74,25 86,20 98,23"
                fill="none"
                stroke="#2563eb"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
              <polyline
                points="2,24 14,24 26,24 38,23 50,23 62,22 74,22 86,21 98,21"
                fill="none"
                stroke="#059669"
                strokeWidth="1.5"
                strokeDasharray="3 2.5"
                vectorEffect="non-scaling-stroke"
                opacity="0.85"
              />
              <polyline
                points="2,32 14,31 26,33 38,30 50,31 62,29 74,30 86,28 98,29"
                fill="none"
                stroke="#d97706"
                strokeWidth="1.5"
                strokeDasharray="3 2.5"
                vectorEffect="non-scaling-stroke"
                opacity="0.85"
              />
            </svg>
          </div>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-[#6b7280]">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#2563eb]" />
              Actual
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#059669]" />
              Expected
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#d97706]" />
              Target
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4">
        {insurersHeroMetrics.map((item, i) => (
          <div
            key={item.label}
            className={cn(
              "px-3 py-3.5 md:px-4",
              i < 3 && "sm:border-r sm:border-[#e8e8ea] dark:sm:border-border",
              i < 2 &&
                "border-b border-[#e8e8ea] dark:border-border sm:border-b-0"
            )}
          >
            <p className="text-[11px] text-[#6b7280]">{item.label}</p>
            <p className="mt-1 text-[16px] font-semibold text-foreground">
              {item.value}
            </p>
            <p
              className={cn(
                "mt-0.5 text-[11px]",
                item.positive ? "text-[#059669]" : "text-[#6b7280]"
              )}
            >
              {item.detail}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
