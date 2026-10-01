import { ArrowRight, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/Logo";
import {
  answerIconStyles,
  businessesAnswers,
  businessesDataInputs,
} from "./content";

/** Your data ? Rimbun ? answers and recommendations. */
export function BusinessesHowItWorks() {
  return (
    <div>
      <div className="mx-auto max-w-[720px] text-center">
        <p className="text-[11px] font-semibold tracking-[0.14em] text-[#9ca3af]">
          HOW IT WORKS
        </p>
        <h2 className="mt-3 text-[28px] font-semibold tracking-tight text-[#0B3D34] md:text-[34px]">
          Your data. Our intelligence. Clear answers.
        </h2>
      </div>

      <div className="mt-10 flex flex-col items-stretch gap-4 lg:flex-row lg:items-center lg:gap-3">
        <div className="flex-1 rounded-[20px] border border-[#e8e8ea] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
          <p className="text-[14px] font-semibold text-[#15241f]">
            Your business data
          </p>
          <ul className="mt-4 space-y-2.5">
            {businessesDataInputs.map((item) => {
              const Icon = item.icon;
              return (
                <li
                  key={item.title}
                  className="flex items-center gap-3 rounded-[12px] bg-[#f7f8f8] px-3 py-2.5"
                >
                  <Icon
                    className="h-4 w-4 shrink-0 text-[#6b7280]"
                    strokeWidth={1.75}
                  />
                  <span className="text-[13px] text-[#15241f]">{item.title}</span>
                </li>
              );
            })}
          </ul>
        </div>

        <ArrowRight
          className="mx-auto hidden h-5 w-5 shrink-0 text-[#9ca3af] lg:block"
          strokeWidth={1.75}
          aria-hidden
        />

        <div className="flex flex-1 flex-col items-center justify-center rounded-[20px] bg-[#0B3D34] px-6 py-8 text-center text-white shadow-[0_16px_40px_rgba(11,61,52,0.28)]">
          <Logo size="sm" variant="header" />
          <p className="mt-3 text-[15px] font-semibold">Rimbun</p>
          <p className="mt-3 max-w-[220px] text-[13px] leading-relaxed text-white/80">
            Analyzes your data to understand your business and what&apos;s next.
          </p>
        </div>

        <ArrowRight
          className="mx-auto hidden h-5 w-5 shrink-0 text-[#9ca3af] lg:block"
          strokeWidth={1.75}
          aria-hidden
        />

        <div className="flex-1 rounded-[20px] border border-[#e8e8ea] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
          <p className="text-[14px] font-semibold text-[#15241f]">
            Answers and recommendations
          </p>
          <ul className="mt-4 space-y-2">
            {businessesAnswers.map((item) => {
              const Icon = item.icon;
              const styles = answerIconStyles[item.tone];
              return (
                <li
                  key={item.title}
                  className="flex items-center justify-between gap-3 rounded-[12px] border border-[#eef0f2] px-3 py-2.5"
                >
                  <span className="inline-flex items-center gap-3 text-[13px] text-[#15241f]">
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
                  </span>
                  <ChevronRight
                    className="h-4 w-4 text-[#9ca3af]"
                    strokeWidth={1.75}
                    aria-hidden
                  />
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
