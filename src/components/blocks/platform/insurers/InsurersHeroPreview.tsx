import {
  Home,
  FileText,
  ShieldCheck,
  BarChart3,
  Check,
  ChevronRight,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { insurersSignals } from "./content";

/** Hero risk-decision preview card. */
export function InsurersHeroPreview() {
  return (
    <div className="overflow-hidden rounded-[22px] border border-[#e8e8ea] bg-white shadow-[0_18px_50px_rgba(11,61,52,0.10)]">
      <div className="flex min-h-[300px]">
        <aside
          className="hidden w-12 shrink-0 flex-col items-center gap-4 border-r border-[#eef0f2] bg-[#f7f8f8] py-4 sm:flex"
          aria-hidden
        >
          <Logo size="sm" variant="header" />
          <Home className="h-4 w-4 text-[#9ca3af]" strokeWidth={1.75} />
          <FileText className="h-4 w-4 text-[#9ca3af]" strokeWidth={1.75} />
          <ShieldCheck className="h-4 w-4 text-[#9ca3af]" strokeWidth={1.75} />
          <BarChart3 className="mt-auto h-4 w-4 text-[#9ca3af]" strokeWidth={1.75} />
        </aside>

        <div className="min-w-0 flex-1 p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#dde7f5] text-[12px] font-semibold text-[#2b4f7a]">
                C
              </div>
              <div>
                <p className="text-[14px] font-semibold text-[#15241f]">
                  Customer
                </p>
                <p className="text-[12px] text-[#6b7280]">
                  Auto insurance · 3 years
                </p>
              </div>
            </div>
            <span className="shrink-0 rounded-full bg-[#e4f3ea] px-2.5 py-1 text-[12px] font-semibold text-[#1B4D3E]">
              Lower risk
            </span>
          </div>

          <div className="mt-5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[13px] font-medium text-[#15241f]">Risk score</p>
              <p className="text-[18px] font-semibold text-[#15241f]">72</p>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#eef0f2]">
              <div
                className="h-full rounded-full bg-[#1B4D3E]"
                style={{ width: "72%" }}
              />
            </div>
          </div>

          <div className="mt-5">
            <p className="text-[13px] font-medium text-[#15241f]">Key signals</p>
            <ul className="mt-2.5 space-y-2">
              {insurersSignals.map((s) => (
                <li
                  key={s.label}
                  className="flex items-center gap-2.5 text-[13px] text-[#15241f]"
                >
                  <span
                    className={
                      s.tone === "good"
                        ? "h-2 w-2 rounded-full bg-[#1B4D3E]"
                        : "h-2 w-2 rounded-full bg-[#dc6b5e]"
                    }
                  />
                  {s.label}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-5 flex items-center justify-between gap-3 rounded-[14px] bg-[#e4f3ea] px-3.5 py-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#1B4D3E] text-white">
                <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
              </span>
              <p className="text-[13px] font-medium text-[#0B3D34]">
                Proceed at standard terms
              </p>
            </div>
            <ChevronRight
              className="h-4 w-4 shrink-0 text-[#1B4D3E]"
              strokeWidth={1.75}
              aria-hidden
            />
          </div>
        </div>
      </div>
    </div>
  );
}
