import React from 'react';

const TermsOfService: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="prose prose-lg max-w-none">
          <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
          <p className="text-muted-foreground mb-8">Last Updated: {new Date().toLocaleDateString()}</p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing and using InvestLearn ("the Service," "we," "us," or "our"), you accept and agree to be bound by these Terms of Service ("Terms"). 
              If you do not agree to these Terms, please do not use our Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
            <p>
              InvestLearn is an educational platform that provides:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Investment education and learning materials</li>
              <li>Personalized investment assessments</li>
              <li>Educational content on investment concepts, asset classes, and financial metrics</li>
              <li>Interactive learning tools and scenarios</li>
              <li>Spending Analysis and Projections</li>
            </ul>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-4">
              <p className="font-semibold text-yellow-800">Important Disclaimer:</p>
              <p className="text-yellow-700">
                InvestLearn is an EDUCATIONAL platform only. We do NOT provide investment, 
                financial, or legal advice. Our content is for educational purposes only and should 
                not be construed as personalized investment recommendations.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. User Accounts and Eligibility</h2>
            <h3 className="text-xl font-semibold mb-3">3.1 Age Requirement</h3>
            <p>You must be at least 18 years old to use this Service.</p>

            <h3 className="text-xl font-semibold mb-3">3.2 Account Creation</h3>
            <p>To access certain features, you must create an account using Google OAuth or email registration. 
              You are responsible for:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Providing accurate and complete information</li>
              <li>Notifying us immediately of any unauthorized access</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Use of Service</h2>
            <h3 className="text-xl font-semibold mb-3">4.1 Permitted Use</h3>
            <p>You may use our Service for:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Educational and learning purposes</li>
              <li>Personal investment education</li>
              <li>Assessment of your own financial situation</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">4.2 Prohibited Uses</h3>
            <p>You agree NOT to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Use the Service for any unlawful purpose</li>
              <li>Impersonate any person or entity</li>
              <li>Attempt to gain unauthorized access to the Service</li>
              <li>Interfere with or disrupt the Service or servers</li>
              <li>Reproduce, duplicate, or copy content without permission</li>
              <li>Use automated systems to access the Service</li>
              <li>Scrape or mine data from the Service</li>
              <li>Transmit viruses or malicious code</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Investment Disclaimer</h2>
            <div className="bg-red-50 border-l-4 border-red-400 p-4 my-4">
              <p className="font-semibold text-red-800 mb-2">CRITICAL INVESTMENT DISCLAIMER</p>
              <p className="text-red-700">
                <strong>NOT INVESTMENT ADVICE:</strong> The content, assessments, and recommendations provided 
                by InvestLearn are for EDUCATIONAL PURPOSES ONLY and should NOT be considered as 
                investment, financial, legal, or tax advice.
              </p>
              <p className="text-red-700 mt-2">
                <strong>No Guarantees:</strong> We make no representations or warranties about the accuracy, 
                completeness, or suitability of any information provided. Past performance does not guarantee 
                future results. All investments carry risk, including potential loss of principal.
              </p>
              <p className="text-red-700 mt-2">
                <strong>Consult Professionals:</strong> Before making any investment decisions, you should consult 
                with a qualified financial advisor, investment professional, tax advisor, or legal counsel who 
                understands your specific financial situation and objectives.
              </p>
              <p className="text-red-700 mt-2">
                <strong>Your Responsibility:</strong> You are solely responsible for your investment decisions. 
                InvestLearn, its operators, and content creators are not liable for any losses or damages 
                resulting from your use of this educational platform.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Intellectual Property</h2>
            <p>The Service and its original content, features, and functionality are owned by InvestLearn 
              and protected by international copyright, trademark, and other intellectual property laws.</p>
            <p>You may not:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Reproduce, modify, or distribute our content without permission</li>
              <li>Use our trademarks or logos without authorization</li>
              <li>Create derivative works based on our content</li>
            </ul>
            <p>You retain ownership of any content you create or submit to the Service, but grant us a license to 
              use such content to provide and improve the Service.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. User Content and Conduct</h2>
            <p>You are responsible for any content you post, upload, or share on the Service. You agree:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Not to post content that is illegal, harmful, or infringing</li>
              <li>Not to post personal information of others without consent</li>
              <li>Not to engage in harassment, hate speech, or discrimination</li>
              <li>To respect intellectual property rights of others</li>
            </ul>
            <p>We reserve the right to remove any content that violates these Terms or is otherwise objectionable.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Limitation of Liability</h2>
            <div className="bg-gray-50 border-l-4 border-gray-400 p-4 my-4">
              <p className="font-semibold text-gray-800 mb-2">TO THE MAXIMUM EXTENT PERMITTED BY LAW:</p>
              <p className="text-gray-700">
                InvestLearn and its operators, employees, and partners shall NOT be liable for any indirect, 
                incidental, special, consequential, or punitive damages, including but not limited to:</p>
              <ul className="list-disc pl-6 text-gray-700 mt-2">
                <li>Loss of profits or investments</li>
                <li>Loss of data</li>
                <li>Loss of goodwill or business opportunities</li>
                <li>Financial losses of any kind</li>
              </ul>
              <p className="text-gray-700 mt-2">
                Our total liability shall not exceed the amount you paid to use the Service (currently $0, as the 
                Service is free for educational use).
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Disclaimer of Warranties</h2>
            <p>The Service is provided "AS IS" and "AS AVAILABLE" without warranties of any kind, either express or 
              implied, including but not limited to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Warranties of merchantability or fitness for a particular purpose</li>
              <li>Warranties that the Service will be uninterrupted, secure, or error-free</li>
              <li>Warranties regarding the accuracy or reliability of any information provided</li>
              <li>Warranties that results or recommendations will lead to investment success</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Indemnification</h2>
            <p>You agree to indemnify and hold harmless InvestLearn, its operators, employees, and partners 
              from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Your use or misuse of the Service</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any rights of others</li>
              <li>Investment decisions made based on information from the Service</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">11. Third-Party Services</h2>
            <p>Our Service may integrate with third-party services (such as Firebase, Google OAuth, and hosting providers). 
              Your use of third-party services is subject to their respective terms and privacy policies.</p>
            <p>We are not responsible for the practices or policies of third-party services.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">12. Termination</h2>
            <p>We may terminate or suspend your account and access to the Service immediately, without prior notice, 
              for any reason, including but not limited to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Violation of these Terms</li>
              <li>Fraudulent or illegal activity</li>
              <li>Extended inactivity</li>
              <li>At our sole discretion</li>
            </ul>
            <p>You may terminate your account at any time by deleting your account through the Service or contacting us.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">13. Changes to Terms</h2>
            <p>We reserve the right to modify these Terms at any time. Material changes will be notified by:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Posting the updated Terms on this page</li>
              <li>Updating the "Last Updated" date</li>
              <li>Sending an email notification for significant changes</li>
            </ul>
            <p>Your continued use of the Service after changes constitutes acceptance of the new Terms.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">14. Governing Law</h2>
            <p>These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction], 
              without regard to its conflict of law provisions.</p>
            <p>Any disputes arising from these Terms or your use of the Service shall be resolved through binding 
              arbitration or in the courts of [Your Jurisdiction].</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">15. Contact Information</h2>
            <p>If you have questions about these Terms, please contact us:</p>
            <ul className="list-none mb-4">
              <li><strong>Email:</strong> investlearn@gmail.com</li>
              <li><strong>Support:</strong> investlearn@gmail.com</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">16. Severability</h2>
            <p>If any provision of these Terms is found to be unenforceable or invalid, that provision shall be 
              limited or eliminated to the minimum extent necessary, and the remaining provisions shall remain 
              in full force and effect.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">17. Entire Agreement</h2>
            <p>These Terms, together with our Privacy Policy, constitute the entire agreement between you and 
              InvestLearn regarding the use of the Service and supersede all prior agreements and understandings.</p>
          </section>

          <div className="mt-8 p-4 bg-blue-50 border-l-4 border-blue-400 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Final Reminder:</strong> This platform is for educational purposes only. Always consult 
              with qualified financial professionals before making investment decisions. InvestLearn does 
              not provide investment, financial, legal, or tax advice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
