import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { PlatformFooter, PlatformHeader } from "@/components/blocks/platform";
import { InsurersHeroPreview } from "@/components/blocks/platform/insurers/InsurersHeroPreview";
import {
  InsurersCapabilityStrip,
  InsurersDataFlow,
  InsurersTrustStrip,
} from "@/components/blocks/platform/insurers/InsurersSupportSections";
import { insurersHero } from "@/components/blocks/platform/insurers/content";

/**
 * Insurers & lenders audience page.
 */
export default function InsurersLendersPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#fbfcfb] text-[#15241f] font-['Plus_Jakarta_Sans',ui-sans-serif,system-ui,sans-serif]">
      <PlatformHeader />

      <section className="relative px-6 pb-14 pt-[72px] md:px-8 md:pb-20 md:pt-24">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(11,61,52,0.07),_transparent_55%)]"
          aria-hidden
        />
        <div className="relative mx-auto grid max-w-[1100px] items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-[11px] font-semibold tracking-[0.14em] text-[#6b7280]">
              {insurersHero.eyebrow}
            </p>
            <h1 className="mt-4 max-w-[14ch] text-[36px] font-semibold leading-[1.08] tracking-tight text-[#0B3D34] md:text-[48px]">
              {insurersHero.title}
            </h1>
            <p className="mt-5 max-w-[440px] text-[16px] leading-relaxed text-[#5b6570] md:text-[17px]">
              {insurersHero.lead}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                to="/contact"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#0B3D34] px-6 text-[15px] font-medium text-white hover:bg-[#09332b]"
              >
                Talk to us
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex h-12 items-center justify-center rounded-full border border-[#d1d5db] bg-white px-6 text-[15px] font-medium text-[#15241f] hover:bg-[#f3f4f6]"
              >
                See how it works
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <InsurersHeroPreview />
          </motion.div>
        </div>
      </section>

      <section className="px-6 py-10 md:px-8 md:py-12">
        <div className="mx-auto max-w-[900px]">
          <InsurersCapabilityStrip />
        </div>
      </section>

      <section
        id="how-it-works"
        className="scroll-mt-16 px-6 py-14 md:px-8 md:py-16"
      >
        <div className="mx-auto max-w-[900px]">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45 }}
          >
            <InsurersDataFlow />
          </motion.div>
        </div>
      </section>

      <section className="px-6 pb-10 md:px-8">
        <div className="mx-auto max-w-[900px]">
          <InsurersTrustStrip />
        </div>
      </section>

      <section className="px-6 pb-14 pt-4 md:px-8 md:pb-16">
        <div className="mx-auto max-w-[1100px]">
          <div className="relative overflow-hidden rounded-[24px] bg-[#0B3D34] px-6 py-8 text-white md:px-10 md:py-10">
            <div
              className="pointer-events-none absolute -bottom-8 -right-6 h-40 w-40 opacity-20"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'%3E%3Cpath fill='%23ffffff' d='M60 8c18 18 28 38 28 58 0 22-14 40-28 46-14-6-28-24-28-46 0-20 10-40 28-58z'/%3E%3C/svg%3E\")",
                backgroundRepeat: "no-repeat",
                backgroundSize: "contain",
              }}
              aria-hidden
            />
            <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between md:gap-10">
              <h2 className="max-w-[20ch] text-[24px] font-semibold leading-tight tracking-tight md:text-[30px]">
                See how Rimbun could work with your organisation.
              </h2>
              <Link
                to="/contact"
                className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-white px-6 text-[15px] font-medium text-[#0B3D34] hover:bg-[#f3f4f6]"
              >
                Talk to us
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <PlatformFooter />
    </div>
  );
}
