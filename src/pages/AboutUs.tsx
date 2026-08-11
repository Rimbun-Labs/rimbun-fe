import React from "react";
import { Link } from "react-router-dom";

const AboutUs: React.FC = () => {
  return (
    <div>
      <section className="px-6 pt-20 pb-24 md:pt-28 md:pb-32">
        <div className="mx-auto max-w-[680px]">
          <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            About
          </p>
          <h1 className="mt-4 text-[40px] font-semibold leading-[1.07] tracking-tight text-foreground md:text-[56px]">
            Rimbun helps you respond to what customers already show they need.
          </h1>
          <p className="mt-7 text-[19px] leading-relaxed text-muted-foreground">
            We work with banks, wallets, and others in financial services. Based
            in Brunei Darussalam.
          </p>
        </div>
      </section>

      <section className="bg-card px-6 py-24 md:py-32">
        <div className="mx-auto max-w-[680px]">
          <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            People
          </p>
          <h2 className="mt-4 text-[32px] font-semibold leading-tight tracking-tight text-foreground md:text-[40px]">
            Founders
          </h2>

          <div className="mt-12 space-y-14">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
              <img
                src="/Adrian.JPG"
                alt="Adrian Koh"
                className="h-28 w-28 shrink-0 rounded-full object-cover sm:h-32 sm:w-32"
              />
              <div>
                <h3 className="text-[21px] font-semibold tracking-tight text-foreground">
                  Adrian Koh
                </h3>
                <p className="mt-1 text-[15px] text-muted-foreground">
                  Founder & CEO
                </p>
                <p className="mt-4 text-[17px] leading-relaxed text-muted-foreground">
                  Adrian comes from strategy and economics in Brunei’s
                  government, including work with the national SME body, and from
                  the SEA tech ecosystem. He brings that institutional and
                  startup context to Rimbun.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
              <img
                src="/Jaitun.JPG"
                alt="Jaitun Shah"
                className="h-28 w-28 shrink-0 rounded-full object-cover sm:h-32 sm:w-32"
              />
              <div>
                <h3 className="text-[21px] font-semibold tracking-tight text-foreground">
                  Jaitun Shah
                </h3>
                <p className="mt-1 text-[15px] text-muted-foreground">
                  Co-Founder & COO
                </p>
                <p className="mt-4 text-[17px] leading-relaxed text-muted-foreground">
                  Jaitun is a product leader and operator. He spent nearly a
                  decade shipping complex programs, including Ford’s autonomous
                  vehicle work. He runs how Rimbun gets built and delivered.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-24 md:py-32">
        <div className="mx-auto max-w-[680px]">
          <h2 className="text-[32px] font-semibold leading-tight tracking-tight text-foreground md:text-[40px]">
            Talk to us
          </h2>
          <p className="mt-5 text-[17px] leading-relaxed text-muted-foreground">
            If you’re trying to understand what customers need, how they use your
            products, or what to do next, we’d like to hear about it.
          </p>
          <Link
            to="/contact"
            className="mt-8 inline-flex h-12 items-center rounded-full bg-foreground px-7 text-[17px] font-medium text-background transition-opacity hover:opacity-85"
          >
            Talk to us
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
