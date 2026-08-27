import { useState } from "react";
import { Link } from "react-router-dom";
import { MessageCircle, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { PlatformFooter, PlatformHeader } from "@/components/blocks/platform";
import { BanksHeroPreview } from "@/components/blocks/platform/banks/BanksHeroPreview";
import {
  banksHero,
  banksTrustItems,
  banksUseCases,
  banksValueProps,
  banksWorkflow,
} from "@/components/blocks/platform/banks/content";

type UseCaseTab = "retail" | "sme";

/**
 * Banks audience page — structure/copy match to the banks mockup.
 * Shares platform header/footer with /platform.
 */
export default function BanksPage() {
  const [tab, setTab] = useState<UseCaseTab>("retail");
  const useCases = banksUseCases[tab];

  return (
    <div className="min-h-screen bg-[#f7f7f8] text-foreground dark:bg-background">
      <PlatformHeader />

      {/* Hero */}
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
            <span className="text-foreground">Banks</span>
          </nav>

          <div className="mt-6 grid items-center gap-8 lg:grid-cols-2 lg:gap-10">
            <div>
              <p className="text-[12px] font-semibold tracking-[0.08em] text-[#059669]">
                {banksHero.eyebrow}
              </p>
              <h1 className="mt-3 text-[34px] font-semibold leading-[1.1] tracking-tight text-foreground md:text-[42px]">
                {banksHero.title}
              </h1>
              <p className="mt-4 max-w-[500px] text-[16px] leading-relaxed text-[#6b7280] dark:text-muted-foreground md:text-[17px]">
                {banksHero.lead}
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
            <BanksHeroPreview />
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="px-8 py-10 md:py-12">
        <div className="mx-auto max-w-[1100px]">
          <div className="mx-auto max-w-[720px] text-center">
            <h2 className="text-[24px] font-semibold tracking-tight text-foreground md:text-[28px]">
              Deliver more value across retail and SME banking
            </h2>
            <p className="mt-2 text-[16px] text-[#6b7280] dark:text-muted-foreground">
              Use behavioral intelligence to strengthen relationships, reduce
              risk, and grow sustainably.
            </p>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {banksValueProps.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title}>
                  <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#059669]/10">
                    <Icon
                      className="h-5 w-5 text-[#059669]"
                      strokeWidth={1.75}
                    />
                  </div>
                  <h3 className="mt-4 text-[15px] font-semibold tracking-tight text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-[#6b7280] dark:text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="px-8 py-10 md:py-12">
        <div className="mx-auto max-w-[1100px]">
          <h2 className="text-center text-[24px] font-semibold tracking-tight text-foreground md:text-[28px]">
            Use cases across retail and SME
          </h2>

          <div className="mt-5 flex justify-center">
            <div className="inline-flex rounded-full border border-[#e8e8ea] bg-white p-1 dark:border-border dark:bg-card">
              {(
                [
                  { id: "retail", label: "Retail banking" },
                  { id: "sme", label: "SME banking" },
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
                        className="flex gap-2 text-[12px] leading-snug text-[#6b7280] dark:text-muted-foreground"
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

      {/* How it works */}
      <section id="how-it-works" className="scroll-mt-16 px-8 py-10 md:py-12">
        <div className="mx-auto max-w-[1100px]">
          <h2 className="text-center text-[24px] font-semibold tracking-tight text-foreground md:text-[28px]">
            How Rimbun works with your systems
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {banksWorkflow.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="relative text-center">
                  {i < banksWorkflow.length - 1 ? (
                    <div
                      className="pointer-events-none absolute left-[calc(50%+28px)] right-[-12px] top-5 hidden border-t border-dashed border-[#d1d5db] lg:block"
                      aria-hidden
                    />
                  ) : null}
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-[#e8e8ea] bg-white dark:border-border dark:bg-card">
                    <Icon
                      className="h-4 w-4 text-[#059669]"
                      strokeWidth={1.75}
                    />
                  </div>
                  <h3 className="mt-4 text-[14px] font-semibold tracking-tight text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-[#6b7280] dark:text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="px-8 py-8 md:py-10">
        <div className="mx-auto max-w-[1100px]">
          <div className="rounded-[16px] border border-[#e8e8ea] bg-white px-5 py-6 dark:border-border dark:bg-card md:px-6 md:py-7">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
              <div className="flex max-w-[420px] items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-[#059669]/10">
                  <Lock className="h-4 w-4 text-[#059669]" strokeWidth={1.75} />
                </div>
                <div>
                  <h2 className="text-[16px] font-semibold tracking-tight text-foreground">
                    Built for trust and compliance
                  </h2>
                  <p className="mt-1 text-[13px] leading-relaxed text-[#6b7280] dark:text-muted-foreground">
                    Enterprise-grade security, full auditability, and clear data
                    governance—so you stay in control.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-5 gap-y-4 sm:grid-cols-3 lg:grid-cols-5">
                {banksTrustItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.label}
                      className="flex items-center gap-2 text-[12px] leading-snug text-[#6b7280]"
                    >
                      <Icon
                        className="h-4 w-4 shrink-0 text-[#059669]"
                        strokeWidth={1.75}
                      />
                      {item.label}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
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
                  See how Rimbun could work with your bank.
                </p>
                <p className="mt-1 text-[13px] leading-relaxed opacity-75">
                  Talk to our team about your data, use cases, and deployment
                  requirements.
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
