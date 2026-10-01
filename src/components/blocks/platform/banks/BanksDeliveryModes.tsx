import { Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  actionToneStyles,
  banksDeliveryModes,
  banksPortfolioRows,
} from "./content";

/** Tiny decorative sparkline for the RM table. */
function Sparkline({ seed }: { seed: number }) {
  const points = [8, 12, 9, 14, 11, 16, 13, 18].map(
    (v, i) => `${i * 8},${20 - ((v + seed * 2) % 12)}`,
  );
  return (
    <svg viewBox="0 0 56 20" className="h-5 w-14" aria-hidden>
      <polyline
        points={points.join(" ")}
        fill="none"
        stroke="#1B4D3E"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** RM Dashboard + API delivery cards. */
export function BanksDeliveryModes() {
  return (
    <div>
      <h2 className="text-center text-[28px] font-semibold tracking-tight text-[#0B3D34] md:text-[34px]">
        Use Rimbun your way
      </h2>

      <div className="mt-9 grid gap-4 lg:grid-cols-2">
        {banksDeliveryModes.map((mode) => {
          const Icon = mode.icon;
          return (
            <div
              key={mode.id}
              className="rounded-[22px] border border-[#eef0f2] bg-[#f4f5f5] p-5 md:p-6"
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px]",
                    mode.tone === "green" ? "bg-[#dcefe4]" : "bg-[#dde7f5]",
                  )}
                >
                  <Icon
                    className={cn(
                      "h-5 w-5",
                      mode.tone === "green"
                        ? "text-[#1B4D3E]"
                        : "text-[#2b4f7a]",
                    )}
                    strokeWidth={1.75}
                  />
                </div>
                <div>
                  <h3 className="text-[17px] font-semibold tracking-tight text-[#15241f]">
                    {mode.title}
                  </h3>
                  <p className="mt-1 text-[14px] text-[#5b6570]">
                    {mode.description}
                  </p>
                </div>
              </div>

              <div className="mt-5 overflow-hidden rounded-[16px] border border-[#e8e8ea] bg-white">
                {mode.id === "dashboard" ? (
                  <table className="w-full text-left text-[12px]">
                    <thead className="bg-[#f8f9fa] text-[#6b7280]">
                      <tr>
                        <th className="px-3 py-2.5 font-medium">Customer</th>
                        <th className="hidden px-3 py-2.5 font-medium sm:table-cell">
                          Health
                        </th>
                        <th className="hidden px-3 py-2.5 font-medium md:table-cell">
                          Trend
                        </th>
                        <th className="px-3 py-2.5 font-medium">Next action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {banksPortfolioRows.map((row, i) => (
                        <tr
                          key={row.name}
                          className="border-t border-[#eef0f2]"
                        >
                          <td className="px-3 py-2.5 font-medium text-[#15241f]">
                            {row.name}
                          </td>
                          <td className="hidden px-3 py-2.5 text-[#5b6570] sm:table-cell">
                            {row.score}
                          </td>
                          <td className="hidden px-3 py-2.5 md:table-cell">
                            <Sparkline seed={i} />
                          </td>
                          <td className="px-3 py-2.5">
                            <span
                              className={cn(
                                "inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold",
                                actionToneStyles[row.actionTone],
                              )}
                            >
                              {row.action}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="flex flex-col items-center gap-4 px-4 py-6 sm:flex-row sm:justify-center sm:gap-6">
                    <div className="flex h-28 w-[72px] flex-col rounded-[14px] border border-[#e5e7eb] bg-[#f8f9fa] p-2 shadow-sm">
                      <Smartphone
                        className="mx-auto h-4 w-4 text-[#9ca3af]"
                        strokeWidth={1.75}
                      />
                      <div className="mt-2 space-y-1.5">
                        <div className="h-1.5 rounded bg-[#d1d5db]" />
                        <div className="h-1.5 w-2/3 rounded bg-[#e5e7eb]" />
                        <div className="h-8 rounded bg-[#dcefe4]" />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      {["Your app", "Your channels", "Your systems"].map(
                        (label) => (
                          <div
                            key={label}
                            className="rounded-[10px] border border-[#e8e8ea] bg-white px-3 py-2 text-[12px] font-medium text-[#15241f] shadow-sm"
                          >
                            {label}
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
