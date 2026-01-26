import React from 'react';

const AboutUs: React.FC = () => {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-16">
      <div className="prose prose-lg max-w-none">
        <h1 className="text-4xl font-bold mb-8">About Us</h1>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-lg text-muted-foreground mb-4">
            At Rimbun, we believe that financial literacy is the foundation of financial freedom. 
            Our mission is to empower individuals with the knowledge, confidence, and tools they need 
            to make informed investment decisions.
          </p>
          <p>
            We understand that investing can feel overwhelming, especially for beginners. That's why we've 
            created an interactive, personalized learning platform that adapts to your knowledge level 
            and investment goals.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">What We Do</h2>
          <p className="mb-4">
            Rimbun is an AI-powered investment education platform that provides:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li><strong>Personalized Assessments:</strong> Understand your risk tolerance, knowledge level, and investment preferences through our interactive assessment</li>
            <li><strong>Customized Learning Paths:</strong> Receive educational content tailored to your specific needs and goals</li>
            <li><strong>Real-World Scenarios:</strong> Learn through practical investment scenarios and examples</li>
            <li><strong>Portfolio Insights:</strong> Get personalized recommendations based on your assessment results</li>
            <li><strong>Progress Tracking:</strong> Monitor your learning journey and build confidence over time</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Our Approach</h2>
          <p className="mb-4">
            We believe in learning by doing. Our platform combines:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li><strong>Interactive Learning:</strong> Engage with real-world scenarios rather than just reading theory</li>
            <li><strong>Personalization:</strong> Content that adapts to your knowledge level and investment goals</li>
            <li><strong>Practical Application:</strong> Tools and insights you can apply to your actual financial decisions</li>
            <li><strong>Continuous Improvement:</strong> Track your progress and identify areas for growth</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Important Disclaimer</h2>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 dark:border-yellow-600 p-4 my-4">
            <p className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Educational Purpose Only</p>
            <p className="text-yellow-700 dark:text-yellow-300">
              Rimbun is an educational platform. We do not provide investment, financial, or legal advice. 
              All content, assessments, and recommendations are for educational purposes only and should not 
              be construed as personalized investment advice. Always consult with a qualified financial advisor 
              before making investment decisions.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Get Started</h2>
          <p className="mb-4">
            Ready to build your investment confidence? Start by taking our personalized assessment to 
            understand your investment profile, then explore our customized learning paths designed 
            specifically for you.
          </p>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;
