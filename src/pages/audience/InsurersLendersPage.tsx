import { useState } from "react";
import { Link } from "react-router-dom";
import { MessageCircle, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { PlatformFooter, PlatformHeader } from "@/components/blocks/platform";
import { InsurersDataFlow } from "@/components/blocks/platform/insurers/InsurersDataFlow";
import { InsurersHeroPreview } from "@/components/blocks/platform/insurers/InsurersHeroPreview";
import {
  insurersHero,
  insurersOutcomes,
  insurersTrust,
  insurersUseCases,
  insurersWorkflow,
} from "@/components/blocks/platform/insurers/content";

type UseCaseTab = "insurance" | "lending";

export default function InsurersLendersPage() {
  const [tab, setTab] = useState<UseCaseTab>("insurance");
  const useCases = insurersUseCases[tab];

  return (
    <div className="min-h-screen bg-[#f7f7f8] text-foreground dark:bg-background">
      <PlatformHeader />

      <section className="px-8 pb-10 pt-[68px] md:pb-12 md:pt-20">
        <div className="mx-auto max-w-[1100px]">
          <nav className="text-[12px] text-[#6b7280]">
            <Link to="/platform" className="hover:text-foreground">
              Home
            </Link>
            <span className="mx-1.5">/</span>
            <Link to="/platform#solutions" className="hover:text-foreground">
              Solutions
            </Link>
            <span className="mx-1.5">/</span>
            <span className="text-foreground">Insurers & Lenders</span>
          </nav>

          <div className="mt-6 grid items-center gap-8 lg:grid-cols-2 lg:gap-10">
            <div>
              <p className="text-[12px] font-semibold tracking-[0.08em] text-[#059669]">
                {insurersHero.eyebrow}
              </p>
              <h1 className="mt-3 text-[34px] font-semibold leading-[1.1] tracking-tight text-foreground md:text-[42px]">
                {insurersHero.title}
              </h1>
              <p className="mt-4 max-w-[500px] text-[16px] leading-relaxed text-[#6b7280] dark:text-muted-foreground md:text-[17px]">
                {insurersHero.lead}
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  to="/contact"
                  className="inline-flex h-11 items-center justify-center rounded-full bg-foreground px-6 text-[15px] font-medium text-background hover:opacity-90"
                >
                  Talk to us →
                </Link>
                <a
                  href="#how-it-works"
                  className="inline-flex h-11 items-center justify-center rounded-full border border-[#d1d5db] bg-white px-6 text-[15px] font-medium text-foreground hover:bg-[#f3f4f6] dark:border-border dark:bg-card"
                >
                  See how it works
                </a>
              </div>
            </div>
            <InsurersHeroPreview />
          </div>
        </div>
      </section>

      <section className="px-8 py-10 md:py-12">
        <div className="mx-auto max-w-[1100px]">
          <InsurersDataFlow />
        </div>
      </section>

      <section className="px-8 py-10 md:py-12">
        <div className="mx-auto max-w-[1100px]">
          <h2 className="text-center text-[24px] font-semibold tracking-tight text-foreground md:text-[28px]">
            Outcomes that matter
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {insurersOutcomes.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title}>
                  <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#059669]/10">
                    <Icon
                      className="h-5 w-5 text-[#059669]"
                      strokeWidth={1.75}
                    />
                  </div>
                  <h3 className="mt-4 text-[14px] font-semibold tracking-tight text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-[#6b7280] dark:text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-8 py-10 md:py-12">
        <div className="mx-auto max-w-[1100px]">
          <h2 className="text-center text-[24px] font-semibold tracking-tight text-foreground md:text-[28px]">
            Use cases across insurance and lending
          </h2>

          <div className="mt-5 flex justify-center">
            <div className="inline-flex rounded-full border border-[#e8e8ea] bg-white p-1 dark:border-border dark:bg-card">
              {(
                [
                  { id: "insurance", label: "Insurance" },
                  { id: "lending", label: "Lending" },
                ] as const
              ).map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setTab(option.id)}
                  className={cn(
                    "rounded-full px-4 py-2 text-[13px] font-medium transition-colors",
                    tab === option.id
                      ? "bg-foreground text-background"
                      : "text-[#6b7280] hover:text-foreground"
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {useCases.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="rounded-[16px] border border-[#e8e8ea] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)] dark:border-border dark:bg-card"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#059669]/10">
                    <Icon
                      className="h-4 w-4 text-[#059669]"
                      strokeWidth={1.75}
                    />
                  </div>
                  <h3 className="mt-3 text-[14px] font-semibold leading-snug tracking-tight text-foreground">
                    {item.title}
                  </h3>
                  <ul className="mt-3 space-y-2">
                    {item.points.map((point) => (
                      <li
                        key={point}
                        className="flex gap-2 text-[12px] leading-snug text-[#6b7280]"
                      >
                        <span className="mt-[6px] h-1 w-1 shrink-0 rounded-full bg-[#9ca3af]" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="scroll-mt-16 px-8 py-10 md:py-12">
        <div className="mx-auto max-w-[1100px]">
          <h2 className="text-center text-[24px] font-semibold tracking-tight text-foreground md:text-[28px]">
            How it works with your systems
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-3">
            {insurersWorkflow.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="relative">
                  {i < insurersWorkflow.length - 1 ? (
                    <span
                      className="pointer-events-none absolute -right-2 top-7 hidden text-[#9ca3af] lg:block"
                      aria-hidden
                    >
                      →
                    </span>
                  ) : null}
                  <div className="flex items-start gap-3 pr-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#e8f5ee]">
                      <Icon
                        className="h-5 w-5 text-foreground"
                        strokeWidth={1.75}
                      />
                    </div>
                    <div className="min-w-0 pt-0.5">
                      <div className="flex items-center gap-2">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#059669] text-[11px] font-semibold text-white">
                          {i + 1}
                        </span>
                        <h3 className="text-[14px] font-semibold tracking-tight text-foreground">
                          {step.title}
                        </h3>
                      </div>
                      <p className="mt-2 text-[13px] leading-relaxed text-[#6b7280] dark:text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-8 py-10 md:py-12">
        <div className="mx-auto max-w-[1100px]">
          <div className="rounded-[16px] border border-[#e8e8ea] bg-[#f3f4f6] px-5 py-6 dark:border-border dark:bg-muted/30 md:px-7 md:py-7">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-stretch lg:gap-0">
              <div className="flex max-w-[300px] shrink-0 items-start gap-3 lg:pr-8">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#e8f5ee]">
                  <Lock className="h-5 w-5 text-[#059669]" strokeWidth={1.75} />
                </div>
                <div>
                  <h2 className="text-[18px] font-semibold tracking-tight text-foreground">
                    Security, privacy and compliance by design
                  </h2>
                  <p className="mt-2 text-[13px] leading-relaxed text-[#6b7280] dark:text-muted-foreground">
                    We help you use intelligence while meeting strict regulatory
                    and data governance requirements.
                  </p>
                </div>
              </div>

              <div className="hidden w-px shrink-0 bg-[#d1d5db] dark:bg-border lg:block" />

              <div className="grid flex-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4 lg:pl-8">
                {insurersTrust.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title}>
                      <Icon
                        className="h-4 w-4 text-[#059669]"
                        strokeWidth={1.75}
                      />
                      <h3 className="mt-2.5 text-[13px] font-semibold text-foreground">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-[12px] leading-relaxed text-[#6b7280]">
                        {item.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-8 pb-14 pt-4 md:pb-16 md:pt-6">
        <div className="mx-auto max-w-[1100px]">
          <div className="flex flex-col gap-5 rounded-[16px] bg-foreground px-6 py-6 text-background md:flex-row md:items-center md:justify-between md:gap-8 md:px-8 md:py-7">
            <div className="flex items-start gap-3 md:items-center">
              <MessageCircle
                className="mt-0.5 h-5 w-5 shrink-0 opacity-80 md:mt-0"
                strokeWidth={1.75}
              />
              <div>
                <p className="text-[16px] font-semibold tracking-tight">
                  Better decisions. Lower risk. Stronger performance.
                </p>
                <p className="mt-1 text-[13px] leading-relaxed opacity-75">
                  Book a conversation to see how Rimbun can support your
                  business.
                </p>
              </div>
            </div>
            <Link
              to="/contact"
              className="inline-flex h-11 shrink-0 items-center justify-center rounded-full bg-[#059669] px-6 text-[14px] font-medium text-white hover:opacity-90"
            >
              Talk to us →
            </Link>
          </div>
        </div>
      </section>

      <PlatformFooter />
    </div>
  );
}
