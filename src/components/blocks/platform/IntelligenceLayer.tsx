import { Database, BarChart3, Monitor, Code2, ArrowRight } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

/** Your data ? Rimbun ? outputs, plus Dashboard / API delivery. */
export function IntelligenceLayer() {
  return (
    <div className="mx-auto max-w-[900px]">
      <h2 className="text-center text-[28px] font-semibold tracking-tight text-[#15241f] md:text-[34px]">
        One intelligence layer
      </h2>

      <div className="mt-10 flex flex-col items-stretch gap-4 md:flex-row md:items-center md:justify-center md:gap-3">
        <div className="flex flex-1 flex-col items-center rounded-[18px] border border-[#e5e7eb] bg-white px-5 py-6 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
          <Database className="h-6 w-6 text-[#6b7280]" strokeWidth={1.75} />
          <p className="mt-3 text-[14px] font-medium text-[#15241f]">Your data</p>
        </div>

        <ArrowRight
          className="mx-auto hidden h-5 w-5 shrink-0 text-[#9ca3af] md:block"
          strokeWidth={1.75}
          aria-hidden
        />

        <div className="flex flex-1 flex-col items-center rounded-[18px] bg-[#1B4D3E] px-5 py-6 text-white shadow-[0_12px_28px_rgba(27,77,62,0.22)]">
          <Logo size="sm" variant="header" />
          <p className="mt-3 text-[14px] font-medium">Rimbun</p>
        </div>

        <ArrowRight
          className="mx-auto hidden h-5 w-5 shrink-0 text-[#9ca3af] md:block"
          strokeWidth={1.75}
          aria-hidden
        />

        <div className="flex flex-1 flex-col items-center rounded-[18px] border border-[#e5e7eb] bg-white px-5 py-6 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
          <BarChart3 className="h-6 w-6 text-[#6b7280]" strokeWidth={1.75} />
          <p className="mt-3 text-center text-[13px] font-medium leading-snug text-[#15241f]">
            Forecasts {"\u00B7"} Signals {"\u00B7"} Recommendations
          </p>
        </div>
      </div>

      <p className="mt-10 text-center text-[11px] font-semibold tracking-[0.12em] text-[#9ca3af]">
        DELIVERED WHERE YOU NEED IT
      </p>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
        <span className="inline-flex items-center gap-2 rounded-full border border-[#e5e7eb] bg-white px-4 py-2 text-[13px] font-medium text-[#15241f] shadow-sm">
          <Monitor className="h-4 w-4 text-[#6b7280]" strokeWidth={1.75} />
          Dashboard
        </span>
        <span className="inline-flex items-center gap-2 rounded-full border border-[#e5e7eb] bg-white px-4 py-2 text-[13px] font-medium text-[#15241f] shadow-sm">
          <Code2 className="h-4 w-4 text-[#6b7280]" strokeWidth={1.75} />
          API
        </span>
      </div>
    </div>
  );
}
