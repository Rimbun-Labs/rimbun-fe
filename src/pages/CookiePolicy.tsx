import React from 'react';

const CookiePolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="prose prose-lg max-w-none">
          <h1 className="text-4xl font-bold mb-8">Cookie Policy</h1>
          <p className="text-muted-foreground mb-8">Last Updated: {new Date().toLocaleDateString()}</p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. What Are Cookies?</h2>
            <p>
              Cookies are small text files that are placed on your device when you visit a website. 
              They are widely used to make websites work more efficiently and provide information to 
              the website owners.
            </p>
            <p>
              This Cookie Policy explains how InvestLearn ("we," "our," or "us") uses cookies and 
              similar technologies when you use our Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. How We Use Cookies</h2>
            <p className="mb-4">We use cookies for the following purposes:</p>
            
            <h3 className="text-xl font-semibold mb-3">2.1 Essential Cookies</h3>
            <p className="mb-4">
              These cookies are necessary for the Service to function properly. They enable core 
              functionality such as authentication, security, and session management.
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Authentication:</strong> To keep you logged in and maintain your session</li>
              <li><strong>Security:</strong> To protect against fraud and ensure secure access</li>
              <li><strong>Preferences:</strong> To remember your settings and preferences</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">2.2 Functional Cookies</h3>
            <p className="mb-4">
              These cookies enhance functionality and personalization. They remember your choices 
              and preferences to provide a better experience.
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Theme Preferences:</strong> To remember your light/dark mode preference</li>
              <li><strong>Language Settings:</strong> To remember your language preference</li>
              <li><strong>Assessment Progress:</strong> To save your progress in assessments</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">2.3 Analytics Cookies</h3>
            <p className="mb-4">
              These cookies help us understand how visitors interact with our Service by collecting 
              and reporting information anonymously.
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Usage Analytics:</strong> To understand how users navigate and use our platform</li>
              <li><strong>Performance Monitoring:</strong> To identify and fix technical issues</li>
              <li><strong>Feature Usage:</strong> To improve our features based on user behavior</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Third-Party Cookies</h2>
            <p className="mb-4">
              We may use third-party services that set cookies on your device. These include:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Firebase Authentication:</strong> For secure user authentication</li>
              <li><strong>Analytics Services:</strong> To analyze website usage and improve our Service</li>
              <li><strong>Error Tracking:</strong> To identify and fix technical issues</li>
            </ul>
            <p>
              These third-party services have their own privacy policies and cookie practices. 
              We encourage you to review their policies.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Managing Cookies</h2>
            <p className="mb-4">
              You have the right to accept or reject cookies. Most web browsers automatically accept 
              cookies, but you can usually modify your browser settings to decline cookies if you prefer.
            </p>
            <p className="mb-4">
              However, please note that disabling certain cookies may impact your experience on our 
              Service. Some features may not function properly if cookies are disabled.
            </p>
            <h3 className="text-xl font-semibold mb-3">How to Manage Cookies:</h3>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Browser Settings:</strong> Most browsers allow you to control cookies through their settings</li>
              <li><strong>Cookie Consent:</strong> When you first visit our Service, you can choose to accept or reject non-essential cookies</li>
              <li><strong>Opt-Out Tools:</strong> You can use browser extensions or opt-out tools provided by third-party services</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Cookie Retention</h2>
            <p>
              Cookies are stored on your device for different periods depending on their purpose:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Session Cookies:</strong> Temporary cookies that are deleted when you close your browser</li>
              <li><strong>Persistent Cookies:</strong> Remain on your device for a set period or until you delete them</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Updates to This Policy</h2>
            <p>
              We may update this Cookie Policy from time to time to reflect changes in our practices 
              or for other operational, legal, or regulatory reasons. We will notify you of any 
              material changes by posting the new policy on this page and updating the "Last Updated" date.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Contact Us</h2>
            <p>If you have questions about our use of cookies, please contact us:</p>
            <ul className="list-none mb-4">
              <li><strong>Email:</strong> investlearnco@gmail.com</li>
            </ul>
          </section>

          <div className="mt-8 p-4 bg-muted rounded-lg">
            <p className="text-sm">
              <strong>Note:</strong> This Cookie Policy should be read in conjunction with our 
              <a href="/privacy" className="text-primary hover:underline ml-1">Privacy Policy</a> and 
              <a href="/terms" className="text-primary hover:underline ml-1">Terms of Service</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;

