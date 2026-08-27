import { cn } from "@/lib/utils";
import { accentStyles } from "../content";
import { banksHeroMetrics } from "./content";

export function BanksHeroPreview() {
  return (
    <div className="overflow-hidden rounded-[20px] border border-[#e8e8ea] bg-white shadow-[0_12px_40px_rgba(0,0,0,0.06)] dark:border-border dark:bg-card">
      <div className="grid gap-4 border-b border-[#e8e8ea] p-5 dark:border-border md:grid-cols-[140px_1fr] md:p-6">
        {/* Financial health gauge */}
        <div className="flex flex-col items-center justify-center rounded-[14px] bg-[#f7f7f8] px-3 py-4 dark:bg-muted/40">
          <p className="text-[11px] font-medium text-[#6b7280]">
            Financial Health Score
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
                strokeDashoffset={2 * Math.PI * 40 * 0.25}
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div className="text-center">
              <p className="text-[22px] font-semibold leading-none text-foreground">
                723
              </p>
              <p className="mt-1 text-[11px] font-medium text-[#059669]">
                Good
              </p>
            </div>
          </div>
          <p className="mt-2 text-[11px] text-[#6b7280]">Customer overview</p>
        </div>

        {/* Cash flow trend */}
        <div>
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-[14px] font-semibold text-foreground">
              Cash flow trend
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
              <defs>
                <linearGradient id="banksBalanceFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                </linearGradient>
              </defs>
              <polygon
                points="2,28 12,30 22,24 32,26 42,20 52,22 62,18 72,21 82,16 98,19 98,48 2,48"
                fill="url(#banksBalanceFill)"
              />
              <polyline
                points="2,32 12,28 22,34 32,30 42,36 52,29 62,33 72,27 82,31 98,24"
                fill="none"
                stroke="#059669"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
              <polyline
                points="2,18 12,22 22,16 32,20 42,14 52,19 62,15 72,18 82,12 98,16"
                fill="none"
                stroke="#dc2626"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
                opacity="0.85"
              />
            </svg>
          </div>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-[#6b7280]">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#059669]" />
              Inflow
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#dc2626]" />
              Outflow
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#2563eb]/50" />
              Balance
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4">
        {banksHeroMetrics.map((item, i) => {
          const styles = accentStyles[item.tone];
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className={cn(
                "px-3 py-3.5 md:px-4",
                i < 3 && "sm:border-r sm:border-[#e8e8ea] dark:sm:border-border",
                i < 2 &&
                  "border-b border-[#e8e8ea] dark:border-border sm:border-b-0"
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
      </div>
    </div>
  );
}
