import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import {
  ForecastHeroCard,
  IntelligenceLayer,
  PathCard,
  PlatformFooter,
  PlatformHeader,
  platformAudiences,
} from "@/components/blocks/platform";

/**
 * Main marketing homepage — hub into Businesses, Banks, Insurance.
 */
export default function PlatformHome() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#fbfcfb] text-[#15241f] font-['Plus_Jakarta_Sans',ui-sans-serif,system-ui,sans-serif]">
      <PlatformHeader />

      {/* Hero */}
      <section className="relative px-6 pb-14 pt-[72px] md:px-8 md:pb-20 md:pt-24">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(27,77,62,0.10),_transparent_55%),radial-gradient(ellipse_at_bottom_left,_rgba(232,243,236,0.9),_transparent_50%)]"
          aria-hidden
        />
        <div className="relative mx-auto grid max-w-[1100px] items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 className="max-w-[14ch] text-[40px] font-semibold leading-[1.05] tracking-tight text-[#15241f] md:text-[52px]">
              Turn financial data into clearer decisions.
            </h1>
            <p className="mt-5 max-w-[420px] text-[17px] leading-relaxed text-[#5b6570] md:text-[18px]">
              Rimbun turns your data into forecasts, signals and
              recommendations.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href="#paths"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#1B4D3E] px-6 text-[15px] font-medium text-white hover:bg-[#164235]"
              >
                Explore solutions
                <ArrowRight className="h-4 w-4" />
              </a>
              <Link
                to="/contact"
                className="inline-flex h-12 items-center justify-center rounded-full border border-[#d1d5db] bg-white px-6 text-[15px] font-medium text-[#15241f] hover:bg-[#f3f4f6]"
              >
                Talk to us
              </Link>
            </div>
          </motion.div>

          <ForecastHeroCard />
        </div>
      </section>

      {/* Choose your path */}
      <section id="paths" className="scroll-mt-16 px-6 py-14 md:px-8 md:py-16">
        <div className="mx-auto max-w-[1100px]">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45 }}
            className="text-center"
          >
            <p className="text-[11px] font-semibold tracking-[0.14em] text-[#9ca3af]">
              BUILT FOR DIFFERENT DECISIONS
            </p>
            <h2 className="mt-3 text-[28px] font-semibold tracking-tight text-[#15241f] md:text-[34px]">
              Choose your path
            </h2>
          </motion.div>

          <div className="mt-9 grid gap-4 md:grid-cols-3 md:gap-5">
            {platformAudiences.map((audience, i) => (
              <motion.div
                key={audience.id}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <PathCard
                  title={audience.title}
                  description={audience.description}
                  href={audience.href}
                  tone={audience.pathTone}
                  icon={audience.icon}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Intelligence layer */}
      <section className="px-6 py-14 md:px-8 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.45 }}
        >
          <IntelligenceLayer />
        </motion.div>
      </section>

      {/* Closing CTA */}
      <section className="relative overflow-hidden px-6 py-16 md:px-8 md:py-20">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(27,77,62,0.12),_transparent_60%),linear-gradient(180deg,_transparent,_rgba(232,243,236,0.65))]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-40 opacity-40"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 120' preserveAspectRatio='none'%3E%3Cpath fill='%231B4D3E' fill-opacity='0.08' d='M0,64 C240,120 480,0 720,40 C960,80 1200,100 1440,40 L1440,120 L0,120 Z'/%3E%3C/svg%3E\")",
            backgroundSize: "cover",
            backgroundPosition: "bottom",
          }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-[720px] text-center">
          <h2 className="text-[28px] font-semibold tracking-tight text-[#15241f] md:text-[36px]">
            See what Rimbun could do with your data.
          </h2>
          <Link
            to="/contact"
            className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#1B4D3E] px-7 text-[15px] font-medium text-white hover:bg-[#164235]"
          >
            Talk to us
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <PlatformFooter />
    </div>
  );
}
