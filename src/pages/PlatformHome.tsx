import { Link } from "react-router-dom";
import {
  AudienceCard,
  CapabilityCard,
  IndustryExample,
  IntelligencePreview,
  PlatformFooter,
  PlatformHeader,
  RouteCard,
  platformAudiences,
  platformCapabilities,
  platformExamples,
  platformRoutes,
} from "@/components/blocks/platform";

/**
 * Trial unified homepage — visual match to the design mockup.
 * Not wired as `/` yet. Review at `/platform`.
 */
export default function PlatformHome() {
  return (
    <div className="min-h-screen bg-[#f7f7f8] text-foreground dark:bg-background">
      <PlatformHeader />

      {/* Hero */}
      <section className="px-8 pb-8 pt-[68px] md:pb-8 md:pt-20">
        <div className="mx-auto grid max-w-[1100px] items-center gap-8 lg:grid-cols-2 lg:gap-10">
          <div>
            <h1 className="text-[36px] font-semibold leading-[1.08] tracking-tight text-foreground md:text-[48px]">
              Financial intelligence for banks, businesses, and insurers.
            </h1>
            <p className="mt-5 max-w-[520px] text-[17px] leading-relaxed text-[#6b7280] dark:text-muted-foreground md:text-[18px]">
              Rimbun turns transaction and operating data into clear actions,
              warnings, and fit-for-purpose financial recommendations.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
              <Link
                to="/contact"
                className="inline-flex h-11 items-center justify-center rounded-full bg-foreground px-6 text-[15px] font-medium text-background hover:opacity-90"
              >
                Talk to us
              </Link>
              <a
                href="#solutions"
                className="text-[15px] font-medium text-[#2563eb] hover:underline dark:text-primary"
              >
                See solutions →
              </a>
            </div>
          </div>
          <IntelligencePreview />
        </div>
      </section>

      {/* Who — tight vertical gap only between sections */}
      <section id="solutions" className="scroll-mt-14 px-8 py-6 md:py-7">
        <div className="mx-auto max-w-[1100px]">
          <h2 className="text-[24px] font-semibold tracking-tight text-foreground md:text-[28px]">
            Who Rimbun helps
          </h2>
          <div className="mt-5 grid gap-5 md:grid-cols-3">
            {platformAudiences.map((audience) => (
              <AudienceCard key={audience.id} {...audience} />
            ))}
          </div>
        </div>
      </section>

      {/* Intelligence */}
      <section className="px-8 py-6 md:py-7">
        <div className="mx-auto max-w-[1100px]">
          <h2 className="text-[24px] font-semibold tracking-tight text-foreground md:text-[28px]">
            What the intelligence looks like
          </h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {platformCapabilities.map((cap) => (
              <CapabilityCard
                key={cap.id}
                title={cap.title}
                items={cap.items}
                tone={cap.tone}
                icon={cap.icon}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Examples — mockup: divider columns, no cards */}
      <section className="px-8 py-6 md:py-7">
        <div className="mx-auto max-w-[1100px]">
          <h2 className="text-[24px] font-semibold tracking-tight text-foreground md:text-[28px]">
            How it shows up
          </h2>
          <div className="mt-5 grid gap-8 md:grid-cols-3 md:gap-0">
            {platformExamples.map((example, i) => (
              <IndustryExample
                key={example.id}
                {...example}
                divided={i > 0}
              />
            ))}
          </div>

          {/* Content-width rule only — not edge-to-edge */}
          <div className="mt-8 border-t border-[#e8e8ea] dark:border-border md:mt-10" />

          <h2 className="mt-8 text-[24px] font-semibold tracking-tight text-foreground md:mt-10 md:text-[28px]">
            Choose your route
          </h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {platformRoutes.map((route) => (
              <RouteCard key={route.id} {...route} />
            ))}
          </div>
        </div>
      </section>

      <div className="pb-4 md:pb-6">
        <PlatformFooter />
      </div>
    </div>
  );
}
