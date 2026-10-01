import { ArrowRight, Database } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/Logo";
import {
  capabilityStyles,
  insurersCapabilities,
  insurersOutputs,
  insurersTrustItems,
  outputStyles,
} from "./content";

export function InsurersCapabilityStrip() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {insurersCapabilities.map((item) => {
        const Icon = item.icon;
        const styles = capabilityStyles[item.tone];
        return (
          <div key={item.title} className="flex flex-col items-center text-center">
            <div
              className={cn(
                "flex h-14 w-14 items-center justify-center rounded-full",
                styles.well,
              )}
            >
              <Icon className={cn("h-6 w-6", styles.icon)} strokeWidth={1.75} />
            </div>
            <p className="mt-3 text-[14px] font-medium text-[#15241f]">
              {item.title}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export function InsurersDataFlow() {
  return (
    <div>
      <div className="flex flex-col items-stretch gap-4 lg:flex-row lg:items-center lg:justify-center lg:gap-3">
        <div className="flex flex-1 flex-col items-center rounded-[18px] border border-[#e8e8ea] bg-white px-5 py-6 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
          <Database className="h-6 w-6 text-[#6b7280]" strokeWidth={1.75} />
          <p className="mt-3 text-[14px] font-medium text-[#15241f]">Your data</p>
        </div>

        <ArrowRight
          className="mx-auto hidden h-5 w-5 shrink-0 text-[#9ca3af] lg:block"
          strokeWidth={1.75}
          aria-hidden
        />

        <div className="flex flex-1 flex-col items-center rounded-[18px] bg-[#0B3D34] px-5 py-6 text-white shadow-[0_12px_28px_rgba(11,61,52,0.22)]">
          <Logo size="sm" variant="header" />
          <p className="mt-3 text-[14px] font-medium">Rimbun</p>
        </div>

        <ArrowRight
          className="mx-auto hidden h-5 w-5 shrink-0 text-[#9ca3af] lg:block"
          strokeWidth={1.75}
          aria-hidden
        />

        <div className="flex flex-1 flex-col justify-center rounded-[18px] border border-[#e8e8ea] bg-white px-5 py-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
          <ul className="space-y-2.5">
            {insurersOutputs.map((item) => {
              const Icon = item.icon;
              const styles = outputStyles[item.tone];
              return (
                <li
                  key={item.title}
                  className="flex items-center gap-3 text-[13px] font-medium text-[#15241f]"
                >
                  <span
                    className={cn(
                      "flex h-7 w-7 items-center justify-center rounded-full",
                      styles.well,
                    )}
                  >
                    <Icon
                      className={cn("h-3.5 w-3.5", styles.icon)}
                      strokeWidth={1.75}
                    />
                  </span>
                  {item.title}
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <p className="mt-6 text-center text-[13px] text-[#6b7280]">
        Delivered into your workflows via API
      </p>
    </div>
  );
}

export function InsurersTrustStrip() {
  return (
    <div className="grid gap-4 rounded-[16px] bg-[#f1f2f2] px-4 py-5 sm:grid-cols-3 sm:px-6">
      {insurersTrustItems.map((item, i) => {
        const Icon = item.icon;
        return (
          <div
            key={item.label}
            className={cn(
              "flex items-center justify-center gap-2 text-[13px] text-[#5b6570]",
              i > 0 && "sm:border-l sm:border-[#d1d5db]",
            )}
          >
            <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
            {item.label}
          </div>
        );
      })}
    </div>
  );
}
