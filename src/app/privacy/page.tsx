import React from 'react';

export const metadata = {
  title: 'Privacy Policy | Nordic Loop',
  description: 'Privacy Policy for using the Nordic Loop platform',
};

export default function PrivacyPolicy() {
  return (
    <main className="bg-white py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-[#1E2A36]">Privacy Policy</h1>
        
        <div className="prose max-w-none">
          <p className="mb-6">Effective from: 18/06/2025</p>
          
          <h2 className="text-xl font-medium mt-8 mb-4">1. Who We Are</h2>
          <p className="mb-6">
            This Privacy Policy applies to Nordic Loop AB, the data controller for the personal data
            collected on www.nordicloop.se. You can contact us at: info@nordicloop.se.
          </p>
          
          <h2 className="text-xl font-medium mt-8 mb-4">2. What Data We Collect</h2>
          <p className="mb-4">
            We collect personal information you provide when:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Registering for the Platform</li>
            <li>Posting Offers or Demands</li>
            <li>Contacting us or subscribing to updates</li>
          </ul>
          <p className="mb-4">This may include:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Name</li>
            <li>Company name</li>
            <li>Contact details (email, phone)</li>
            <li>Job role</li>
            <li>Any data related to material listings</li>
          </ul>
          <p className="mb-6">
            We do not collect or store sensitive personal information unless strictly necessary.
          </p>
          
          <h2 className="text-xl font-medium mt-8 mb-4">3. Purpose and Legal Basis for Processing</h2>
          <p className="mb-4">
            We process your data to:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Provide access to and functionality of the Platform</li>
            <li>Facilitate communication between users</li>
            <li>Improve our services</li>
            <li>Send relevant updates or newsletters (if you opt in)</li>
          </ul>
          <p className="mb-4">Legal bases include:</p>
          <ul className="list-disc pl-6 mb-6">
            <li>Fulfillment of a contract (GDPR Art. 6(1)(b))</li>
            <li>Legitimate interest in improving our service (Art. 6(1)(f))</li>
            <li>Your consent for marketing (Art. 6(1)(a))</li>
          </ul>
          
          <h2 className="text-xl font-medium mt-8 mb-4">4. Data Retention</h2>
          <p className="mb-4">
            We keep your data:
          </p>
          <ul className="list-disc pl-6 mb-6">
            <li>As long as your account is active</li>
            <li>Up to 12 months after account deletion, unless legal obligations require longer retention</li>
            <li>Until you withdraw consent for marketing</li>
          </ul>
          
          <h2 className="text-xl font-medium mt-8 mb-4">5. Who We Share It With</h2>
          <p className="mb-4">
            We may share your data with:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Hosting and IT service providers</li>
            <li>Partners helping with customer support or analytics</li>
            <li>Other users (only when you post listings and only to registered users)</li>
          </ul>
          <p className="mb-6">
            We do not sell your data. Some data processors may be located outside the EU, in which
            case we ensure appropriate safeguards (such as SCCs) are in place.
          </p>
          
          <h2 className="text-xl font-medium mt-8 mb-4">6. Your Rights</h2>
          <p className="mb-4">
            Under GDPR, you have the right to:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Access your data</li>
            <li>Correct inaccurate or incomplete data</li>
            <li>Request deletion of your data</li>
            <li>Object to processing</li>
            <li>Withdraw consent (where applicable)</li>
            <li>Data portability</li>
          </ul>
          <p className="mb-6">
            To exercise any of these rights, email: info@nordicloop.se. If you&apos;re not satisfied, you can file
            a complaint with the Swedish Authority for Privacy Protection (IMY).
          </p>
          
          <h2 className="text-xl font-medium mt-8 mb-4">7. Security</h2>
          <p className="mb-6">
            We implement appropriate technical and organizational measures to protect your personal
            data against unauthorized access, loss, misuse, or disclosure. Access to your personal data
            is limited to authorized personnel only.
          </p>
          
          <h2 className="text-xl font-medium mt-8 mb-4">8. Changes to This Policy</h2>
          <p className="mb-6">
            We may update this Privacy Policy from time to time. When we do, we will notify you via
            email and post the updated version on our website.
          </p>
          
          <div className="border-t border-gray-200 my-12"></div>
          
          <p className="text-sm text-gray-500 mt-8">
            Last updated: June 18, 2025
          </p>
        </div>
      </div>
    </main>
  );
} 