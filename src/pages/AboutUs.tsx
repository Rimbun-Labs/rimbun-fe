import React from 'react';

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
            At Rimbun Labs, we believe clearer financial context leads to better decisions. Our mission is to
            help people and partner institutions turn fragmented financial activity into explainable,
            confidence-scored signals—so teams can review and act with appropriate oversight.
          </p>
          <p>
            We pair that intelligence layer with optional learning paths where they help users build context,
            without replacing regulated judgment or personalized advice.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">What We Do</h2>
          <p className="mb-4">
            Rimbun Labs builds financial intelligence tooling for Financial Institutions and end users. Our product surfaces:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li><strong>Signal-oriented views:</strong> Patterns and intent signals from financial activity, with confidence metadata</li>
            <li><strong>Partner-ready outputs:</strong> Summaries and integrations designed for product and servicing workflows</li>
            <li><strong>Assessments &amp; context:</strong> Scenario-based inputs to enrich profiles—not a substitute for advice</li>
            <li><strong>Optional learning:</strong> Curated paths where education supports understanding of signals and goals</li>
            <li><strong>Transparency:</strong> Traceable signal history to support human review where required</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Our Approach</h2>
          <p className="mb-4">
            We combine data discipline with a trust-first tone:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li><strong>Ingest to action:</strong> Normalize events, detect signals, and expose outputs partners can operationalize</li>
            <li><strong>Confidence, not hype:</strong> Signals indicate likelihoods; human review stays in the loop where it matters</li>
            <li><strong>Privacy by design:</strong> Minimize direct PII dependency and use identifiers appropriate to your deployment</li>
            <li><strong>Education where it helps:</strong> Learning content supports comprehension—it does not replace regulated advice</li>
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
                <h3 className="text-lg font-semibold text-foreground">Adrian Koh — Founder & CEO</h3>
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
                <h3 className="text-lg font-semibold text-foreground">Jaitun Shah — Co-Founder & COO</h3>
                <p className="text-muted-foreground mt-1">
                  A product leader turned operator, Jaitun spent nearly a decade leading complex automotive programs like Ford&apos;s autonomous vehicle initiatives. He leverages this operational rigor to drive startup growth, recently expediting a €5M Series A raise.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Important Disclaimer</h2>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 dark:border-yellow-600 p-4 my-4">
            <p className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Educational Purpose Only</p>
            <p className="text-yellow-700 dark:text-yellow-300">
              Rimbun Labs provides educational and analytical tooling, not investment, financial, or legal advice.
              Signals, assessments, and recommendations are informational and may require human review in your
              jurisdiction. They should not be construed as personalized investment advice. Always consult a
              qualified professional before making investment decisions.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Get Started</h2>
          <p className="mb-4">
            For individuals: take the assessment to enrich your profile, then explore insights and optional
            learning. For Financial Institutions and partners: contact us to discuss integration and how signal outputs fit your
            workflows.
          </p>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;
