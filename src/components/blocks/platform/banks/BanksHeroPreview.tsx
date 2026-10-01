import { cn } from "@/lib/utils";
import {
  banksHeroByTab,
  banksHeroMetrics,
  heroMetricStyles,
  type BanksAudienceTab,
} from "./content";

const months = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
/** Relative cash-flow bar heights for the decorative chart. */
const inflow = [42, 55, 48, 62, 50, 70, 58, 66, 52, 74, 60, 68];
const outflow = [28, 35, 40, 32, 38, 45, 50, 42, 48, 36, 44, 40];

interface BanksHeroPreviewProps {
  tab: BanksAudienceTab;
}

/** Hero customer / SME overview card. */
export function BanksHeroPreview({ tab }: BanksHeroPreviewProps) {
  const profile = banksHeroByTab[tab];

  return (
    <div className="overflow-hidden rounded-[22px] border border-[#e8e8ea] bg-white shadow-[0_18px_50px_rgba(11,61,52,0.10)]">
      <div className="flex items-start justify-between gap-4 border-b border-[#eef0f2] px-5 py-4">
        <div>
          <p className="text-[15px] font-semibold tracking-tight text-[#15241f]">
            {profile.name}
          </p>
          <p className="mt-0.5 text-[12px] text-[#6b7280]">{profile.subtitle}</p>
        </div>
        <div className="text-right">
          <p className="text-[11px] text-[#6b7280]">Financial health</p>
          <div className="mt-1 flex items-center justify-end gap-2">
            <span className="text-[22px] font-semibold leading-none text-[#15241f]">
              {profile.score}
            </span>
            <span className="rounded-full bg-[#e4f3ea] px-2 py-0.5 text-[11px] font-semibold text-[#1B4D3E]">
              {profile.scoreLabel}
            </span>
          </div>
        </div>
      </div>

      <div className="px-5 py-4">
        <p className="text-[13px] font-semibold text-[#15241f]">Cash flow</p>
        <div className="mt-3 h-[120px]">
          <svg
            viewBox="0 0 240 100"
            className="h-full w-full"
            role="img"
            aria-label="Cash flow chart"
          >
            <line
              x1="0"
              y1="50"
              x2="240"
              y2="50"
              stroke="#e5e7eb"
              strokeWidth="1"
            />
            {inflow.map((h, i) => {
              const x = 10 + i * 19;
              const barH = h * 0.55;
              return (
                <rect
                  key={`in-${i}`}
                  x={x}
                  y={50 - barH}
                  width="6"
                  height={barH}
                  rx="1.5"
                  fill="#1B4D3E"
                  opacity="0.85"
                />
              );
            })}
            {outflow.map((h, i) => {
              const x = 18 + i * 19;
              const barH = h * 0.55;
              return (
                <rect
                  key={`out-${i}`}
                  x={x}
                  y={50}
                  width="6"
                  height={barH}
                  rx="1.5"
                  fill="#dc6b5e"
                  opacity="0.9"
                />
              );
            })}
            {months.map((m, i) => (
              <text
                key={m + i}
                x={14 + i * 19}
                y={96}
                textAnchor="middle"
                fill="#9ca3af"
                fontSize="7"
              >
                {m}
              </text>
            ))}
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-2 border-t border-[#eef0f2] sm:grid-cols-4">
        {banksHeroMetrics.map((item, i) => {
          const Icon = item.icon;
          const styles = heroMetricStyles[item.tone];
          return (
            <div
              key={item.label}
              className={cn(
                "px-3 py-3.5 sm:px-4",
                i < 3 && "sm:border-r sm:border-[#eef0f2]",
                i < 2 && "border-b border-[#eef0f2] sm:border-b-0",
              )}
            >
              <div
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full",
                  styles.well,
                )}
              >
                <Icon
                  className={cn("h-3.5 w-3.5", styles.icon)}
                  strokeWidth={1.75}
                />
              </div>
              <p
                className={cn(
                  "mt-2 text-[13px] font-semibold leading-tight",
                  styles.text,
                )}
              >
                {item.count} {item.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
