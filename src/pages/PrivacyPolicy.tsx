import React from 'react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="prose prose-lg max-w-none">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        <p className="text-muted-foreground mb-8">Last Updated: {new Date().toLocaleDateString()}</p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
          <p>
              Welcome to InvestLearn ("we," "our," or "us"). We are committed to protecting your privacy and ensuring you have a positive experience when using our educational platform.
          </p>
          <p>
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our investment education platform InvestLearn (the "Service").
          </p>
          </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
            
          <h3 className="text-xl font-semibold mb-3">2.1 Personal Information</h3>
          <p>When you register and use our Service, we collect:</p>
          <ul className="list-disc pl-6 mb-4">
              <li><strong>Account Information:</strong> Email address, name (from Google OAuth or registration)</li>
              <li><strong>Authentication Data:</strong> Firebase authentication tokens</li>
              <li><strong>Assessment Responses:</strong> Your answers to investment assessment questions</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3">2.2 Assessment and Financial Information</h3>
          <p>To provide personalized educational content, we collect:</p>
          <ul className="list-disc pl-6 mb-4">
              <li><strong>Financial Assessment Data:</strong> Risk tolerance, knowledge level, investment preferences</li>
              <li><strong>Optional Financial Inputs:</strong> Age, financial goals, income range, savings amount (if provided voluntarily)</li>
              <li><strong>Spending Analysis Data:</strong> Monthly expenses, spending patterns (if you use spending features)</li>
              <li><strong>Cash Flow Projections:</strong> Financial projections (if you use projection features)</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3">2.3 Usage Information</h3>
          <p>We automatically collect:</p>
          <ul className="list-disc pl-6 mb-4">
              <li>Device information, browser type, IP address</li>
              <li>Usage patterns and feature interactions</li>
              <li>Learning progress and completion data</li>
          </ul>
          </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
          <p>We use the collected information to:</p>
          <ul className="list-disc pl-6 mb-4">
              <li>Provide and improve our educational services</li>
              <li>Generate personalized investment profiles and recommendations</li>
              <li>Create custom learning paths based on your assessment results</li>
              <li>Track your learning progress and achievements</li>
              <li>Send you updates and educational content (with your consent)</li>
              <li>Ensure platform security and prevent fraud</li>
              <li>Comply with legal obligations</li>
          </ul>
          <p className="font-semibold">
              We do NOT sell your personal information to third parties.
          </p>
          </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
          <p>We implement industry-standard security measures:</p>
          <ul className="list-disc pl-6 mb-4">
              <li><strong>Firebase Authentication:</strong> Secure authentication with Google OAuth</li>
              <li><strong>Encrypted API Communication:</strong> All data transmitted over HTTPS</li>
              <li><strong>Secure Backend:</strong> Your data is stored in secure databases with access controls</li>
              <li><strong>Regular Security Audits:</strong> We continuously monitor and update our security practices</li>
          </ul>
          <p>However, no method of transmission over the internet is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.</p>
          </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Data Sharing and Disclosure</h2>
          <p>We may share your information only in these circumstances:</p>
          <ul className="list-disc pl-6 mb-4">
              <li><strong>Service Providers:</strong> With third-party services (Firebase, hosting providers) necessary to operate our platform</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our legal rights</li>
              <li><strong>With Your Consent:</strong> When you explicitly authorize us to share your information</li>
          </ul>
          <p className="font-semibold">We do NOT:</p>
          <ul className="list-disc pl-6">
              <li>Sell your data to advertisers or brokers</li>
              <li>Share your financial information with investment firms</li>
              <li>Use your data for marketing to third parties without consent</li>
          </ul>
          </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Your Rights (GDPR/CCPA Compliance)</h2>
          <p>You have the following rights:</p>
          <ul className="list-disc pl-6 mb-4">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Correction:</strong> Update or correct inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your data (account deletion)</li>
              <li><strong>Portability:</strong> Export your data in a machine-readable format</li>
              <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications</li>
              <li><strong>Restrict Processing:</strong> Limit how we use your data</li>
          </ul>
          <p>To exercise these rights, contact us at: investlearn@gmail.com</p>
          </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Cookies and Tracking</h2>
          <p>We use cookies and similar technologies to:</p>
          <ul className="list-disc pl-6 mb-4">
              <li>Maintain your login session</li>
              <li>Remember your preferences</li>
              <li>Analyze usage patterns (anonymized)</li>
          </ul>
          <p>You can control cookies through your browser settings.</p>
          </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Children's Privacy</h2>
          <p>Our Service is not intended for users under 18 years of age. We do not knowingly collect personal information from children.</p>
          </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. International Users</h2>
          <p>If you are accessing our Service from outside the United States, your information may be transferred to, stored, and processed in the United States. By using our Service, you consent to this transfer.</p>
          </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">10. Data Retention</h2>
          <p>We retain your information for as long as:</p>
          <ul className="list-disc pl-6 mb-4">
              <li>Your account is active</li>
              <li>Required to provide you with our services</li>
              <li>Required by law or for legitimate business purposes</li>
          </ul>
          <p>You can delete your account and data at any time through your account settings.</p>
          </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">11. Changes to This Policy</h2>
          <p>We may update this Privacy Policy periodically. We will notify you of any material changes by posting the new policy on this page and updating the "Last Updated" date.</p>
          </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">12. Contact Us</h2>
          <p>If you have questions about this Privacy Policy, please contact us:</p>
          <ul className="list-none mb-4">
              <li><strong>Email:</strong> investlearn@gmail.com</li>
              <li><strong>Support:</strong> investlearn@gmail.com</li>
          </ul>
          </section>

          <div className="mt-8 p-4 bg-muted rounded-lg">
          <p className="text-sm">
              <strong>Important Disclaimer:</strong> This Privacy Policy applies to InvestLearn educational platform only. 
              We do not provide investment, financial, or legal advice. All content is for educational purposes.
          </p>
          </div>
        </div>
      </div>
  );
};

export default PrivacyPolicy;
