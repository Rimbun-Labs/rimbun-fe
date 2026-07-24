import React from 'react';
import { Link } from 'react-router-dom';

const AboutUs: React.FC = () => {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-16">
      <div className="prose prose-lg max-w-none">
        <h1 className="text-4xl font-bold mb-8">About Us</h1>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Rimbun Labs</h2>
          <p className="text-muted-foreground mb-2">
            <strong>Location:</strong> Brunei Darussalam
          </p>
          <p className="text-muted-foreground mb-4">
            <strong>Contact:</strong>{" "}
            <a href="mailto:team@rimbun.co" className="text-primary hover:underline">
              team@rimbun.co
            </a>
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-lg text-muted-foreground mb-4">
            Rimbun Labs helps financial institutions and payment platforms turn payment
            behavior into explainable product-activation opportunities, so teams can act
            with clearer context and appropriate oversight.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">What we offer</h2>
          <p className="mb-4">
            Explainable product-activation opportunities from payment behavior,
            mapped to your available non-credit products, ready for your teams to act on.
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>
              <strong>Opportunity detection</strong> from transaction behavior
            </li>
            <li>
              <strong>Product mapping</strong> to your inventory and constraints
            </li>
            <li>
              <strong>Explainable recommendations</strong> with clear rationale
            </li>
            <li>
              <strong>Delivery your way:</strong> API into CRM, push, or in-app;
              a Rimbun workspace to review the book and customers; or both
            </li>
            <li>
              <strong>Improvement over time</strong> from the outcomes you share back
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Our Approach</h2>
          <p className="mb-4">
            Clients remain in control of their data, product catalog, constraints, and
            customer outcomes. Rimbun owns enrichment, opportunity detection, scoring,
            ranking, explainability, and model improvement.
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>
              <strong>Flexible delivery:</strong> Integrate into existing systems, use
              the Rimbun workspace, or combine both
            </li>
            <li>
              <strong>Explainability:</strong> Recommendations include rationale so
              teams can review before acting
            </li>
            <li>
              <strong>Privacy-aware:</strong> Minimize unnecessary PII and use
              identifiers appropriate to each deployment
            </li>
            <li>
              <strong>Non-credit focus:</strong> Activation for available non-credit
              products, not credit eligibility or repayment scoring
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Our Founders</h2>
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
              <img
                src="/Adrian.JPG"
                alt="Adrian Koh, Founder & CEO"
                className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover shrink-0 border-2 border-border"
              />
              <div className="min-w-0">
                <h3 className="text-lg font-semibold text-foreground">Adrian Koh, Founder & CEO</h3>
                <p className="text-muted-foreground mt-1">
                  A corporate strategist and economist in the national government of Brunei. Adrian executed policies and strategic plans for the national SME body of Brunei. He has worked in the SEA tech ecosystem and has helped startups raise pre-A and Series A funding.
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
              <img
                src="/Jaitun.JPG"
                alt="Jaitun Shah, Co-Founder & COO"
                className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover shrink-0 border-2 border-border"
              />
              <div className="min-w-0">
                <h3 className="text-lg font-semibold text-foreground">Jaitun Shah, Co-Founder & COO</h3>
                <p className="text-muted-foreground mt-1">
                  A product leader turned operator, Jaitun spent nearly a decade leading complex automotive programs like Ford&apos;s autonomous vehicle initiatives. He leverages this operational rigor to drive startup growth, recently expediting a €5M Series A raise.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Important notice</h2>
          <div className="bg-muted/50 border-l-4 border-border p-4 my-4">
            <p className="font-semibold text-foreground mb-2">Decision support for partners</p>
            <p className="text-muted-foreground">
              Rimbun provides analytical recommendations to client institutions. It does
              not replace regulated judgment, underwriting, or customer-facing advice
              issued by the client. Clients retain control over how recommendations are
              reviewed, delivered, and acted on.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Get started</h2>
          <p className="mb-4">
            If you represent a financial institution or payment platform and want to
            explore how Rimbun fits your workflows,{" "}
            <Link to="/contact" className="text-primary hover:underline">
              contact us
            </Link>{" "}
            or email{" "}
            <a href="mailto:team@rimbun.co" className="text-primary hover:underline">
              team@rimbun.co
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;
