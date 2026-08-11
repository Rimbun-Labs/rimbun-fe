import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { LandingHeader } from "@/components/blocks/header/LandingHeader";
import { Footer } from "@/components/blocks/footer";

const DOCS_API_URL = "https://docs.rimbun.co/api";

export default function ForBanks() {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash !== "#product") return;
    document.getElementById("product")?.scrollIntoView({ behavior: "smooth" });
  }, [hash]);

  return (
    <div className="homepage min-h-screen">
      <LandingHeader />

      <section className="px-6 pt-36 pb-28 md:pt-44 md:pb-36">
        <div className="mx-auto max-w-[720px] text-center">
          <h1 className="text-[40px] font-semibold leading-[1.07] tracking-tight text-foreground md:text-[64px]">
            Your customers already show you what they need.
          </h1>
          <p className="mx-auto mt-7 max-w-[540px] text-[19px] leading-relaxed text-muted-foreground md:text-[21px]">
            Rimbun helps you respond with the right product, offer, or
            experience.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-8">
            <Link
              to="/contact"
              className="inline-flex h-12 items-center rounded-full bg-foreground px-7 text-[17px] font-medium text-background transition-opacity hover:opacity-85"
            >
              Talk to us
            </Link>
            <a
              href={DOCS_API_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[17px] font-medium text-primary hover:underline"
            >
              The API&nbsp;→
            </a>
          </div>
        </div>
      </section>

      <section className="bg-card px-6 py-24 md:py-32">
        <div className="mx-auto max-w-[680px]">
          <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            For their customer
          </p>
          <h2 className="mt-4 text-[32px] font-semibold leading-tight tracking-tight text-foreground md:text-[44px]">
            When it works, their day gets easier.
          </h2>
          <p className="mt-6 text-[19px] leading-relaxed text-muted-foreground">
            A bill paid by hand every month doesn’t need another message. It
            needs something that makes the job disappear. Cash that sits needs a
            better place to go. They get something useful at the right time. You
            get a product that gets used.
          </p>
        </div>
      </section>

      <section id="product" className="scroll-mt-20 px-6 py-24 md:py-32">
        <div className="mx-auto grid max-w-[980px] gap-16 md:grid-cols-2 md:gap-24">
          <div>
            <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
              The product
            </p>
            <h2 className="mt-4 text-[32px] font-semibold leading-tight tracking-tight text-foreground md:text-[40px]">
              An API you can use today.
            </h2>
            <p className="mt-5 text-[17px] leading-relaxed text-muted-foreground">
              Payment activity in. Ranked recommendations out — with a reason —
              into the app, CRM, or channel you already use.
            </p>
            <a
              href={DOCS_API_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-block text-[17px] font-medium text-primary hover:underline"
            >
              Read the API&nbsp;→
            </a>
          </div>

          <div>
            <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
              A conversation
            </p>
            <h2 className="mt-4 text-[32px] font-semibold leading-tight tracking-tight text-foreground md:text-[40px]">
              Working on a related problem? Talk to us.
            </h2>
            <p className="mt-5 text-[17px] leading-relaxed text-muted-foreground">
              If you’re trying to understand what customers need, how they use
              your products, or what to do next, we’d like to hear about it.
            </p>
            <Link
              to="/contact"
              className="mt-8 inline-block text-[17px] font-medium text-primary hover:underline"
            >
              Talk to us&nbsp;→
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
