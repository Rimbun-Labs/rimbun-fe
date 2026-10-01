import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/Logo";
import {
  banksCapabilities,
  banksFlowNodes,
  banksTrustItems,
  heroMetricStyles,
} from "./content";

export function BanksCapabilityStrip() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
      {banksCapabilities.map((item, i) => {
        const Icon = item.icon;
        const styles = heroMetricStyles[item.tone];
        return (
          <div
            key={item.title}
            className={cn(
              "flex items-center gap-3 px-2 py-2 lg:justify-center lg:px-4",
              i > 0 && "lg:border-l lg:border-[#e5e7eb]",
            )}
          >
            <div
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                styles.well,
              )}
            >
              <Icon className={cn("h-4 w-4", styles.icon)} strokeWidth={1.75} />
            </div>
            <p className="text-[14px] font-medium text-[#15241f]">{item.title}</p>
          </div>
        );
      })}
    </div>
  );
}

export function BanksDataFlow() {
  const DataIcon = banksFlowNodes.data.icon;

  return (
    <div className="flex flex-col items-stretch gap-4 lg:flex-row lg:items-center lg:justify-center lg:gap-3">
      <div className="flex flex-1 flex-col items-center rounded-[18px] border border-[#e8e8ea] bg-white px-5 py-6 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
        <DataIcon className="h-6 w-6 text-[#6b7280]" strokeWidth={1.75} />
        <p className="mt-3 text-[14px] font-medium text-[#15241f]">
          {banksFlowNodes.data.title}
        </p>
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

      <div className="flex min-h-[112px] flex-[1.35] items-stretch overflow-hidden rounded-[20px] border border-[#e5e7eb] bg-[#f7f8f8]">
        {banksFlowNodes.outputs.map((out, i) => {
          const Icon = out.icon;
          return (
            <div
              key={out.title}
              className={cn(
                "flex flex-1 items-center justify-center gap-2.5 px-4 py-5",
                i > 0 && "border-l border-[#e5e7eb]",
              )}
            >
              <Icon
                className="h-5 w-5 shrink-0 text-[#1e3a5f]"
                strokeWidth={1.5}
              />
              <p className="text-[13px] font-medium text-[#1e3a5f]">
                {out.title}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function BanksTrustStrip() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {banksTrustItems.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.label}
            className="flex items-center justify-center gap-2 text-[13px] text-[#6b7280]"
          >
            <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
            {item.label}
          </div>
        );
      })}
    </div>
  );
}
