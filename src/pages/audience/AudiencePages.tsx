import { Link } from "react-router-dom";
import {
  CapabilityCard,
  PlatformFooter,
  PlatformHeader,
  platformCapabilities,
} from "@/components/blocks/platform";

interface AudiencePageProps {
  eyebrow: string;
  title: string;
  lead: string;
  points: string[];
}

function AudiencePage({ eyebrow, title, lead, points }: AudiencePageProps) {
  return (
    <div className="min-h-screen bg-[#f7f7f8] dark:bg-background">
      <PlatformHeader />

      <section className="px-6 pb-12 pt-[88px] md:pb-16 md:pt-28">
        <div className="mx-auto max-w-[720px]">
          <p className="text-[13px] font-medium tracking-wide text-[#2563eb] dark:text-primary">
            {eyebrow}
          </p>
          <h1 className="mt-3 text-[36px] font-semibold leading-[1.08] tracking-tight text-foreground md:text-[44px]">
            {title}
          </h1>
          <p className="mt-5 text-[17px] leading-relaxed text-[#6b7280] dark:text-muted-foreground">
            {lead}
          </p>
          <ul className="mt-6 space-y-2.5">
            {points.map((point) => (
              <li
                key={point}
                className="text-[15px] leading-relaxed text-foreground/85"
              >
                {point}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
            <Link
              to="/contact"
              className="inline-flex h-11 items-center justify-center rounded-full bg-foreground px-6 text-[15px] font-medium text-background hover:opacity-90"
            >
              Talk to us
            </Link>
            <Link
              to="/platform"
              className="text-[15px] font-medium text-[#2563eb] hover:underline dark:text-primary"
            >
              ← All solutions
            </Link>
          </div>
        </div>
      </section>

      <section className="px-6 pb-16 md:pb-20">
        <div className="mx-auto max-w-[1120px]">
          <h2 className="text-[22px] font-semibold tracking-tight text-foreground">
            Same intelligence layer
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

      <PlatformFooter />
    </div>
  );
}

export function InsurersLendersAudiencePage() {
  return (
    <AudiencePage
      eyebrow="Insurers & lenders"
      title="Behavioral signal for risk and facilities."
      lead="Use how money moves — not only static forms — for underwriting context, risk flags, and when a facility actually fits."
      points={[
        "Warnings and cash stress as decision support, not a black box score.",
        "Fit-for-purpose facility and protection context when evidence supports it.",
        "Same Rimbun intelligence layer as banks and businesses.",
      ]}
    />
  );
}
