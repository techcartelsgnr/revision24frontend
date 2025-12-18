import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const privacyPolicy = [
  {
    heading: "Information We Collect",
    description: `<ul>
        <li>Phone Number (for registration)</li>
        <li>Name and PIN</li>
        <li>Email (optional)</li>
        <li>Usage data (tests, scores, preferences)</li>
        <li>Device & browser info</li>
      </ul>`
  },
  {
    heading: "How We Use Your Information",
    description: `<ul>
        <li>To manage your account and access to content</li>
        <li>To track progress and performance</li>
        <li>To improve our services</li>
        <li>To send updates and notifications</li>
      </ul>`
  },
  {
    heading: "Sharing Your Information",
    description: `<p>We do not sell your data. Data may be shared with payment processors or legal authorities when necessary.</p>`
  },
  {
    heading: "Data Security",
    description: `<p>We use standard encryption and controls, but cannot guarantee absolute security online.</p>`
  },
  {
    heading: "Cookies & Tracking",
    description: `<p>We may use cookies to personalize content and improve experience.</p>`
  },
  {
    heading: "Your Rights",
    description: `<p>You may view/edit your profile, request data deletion, or opt out of marketing. 
      Contact: <a href="mailto:privacy@revision24.com" class="text-blue-600 underline">privacy@revision24.com</a></p>`
  },
  {
    heading: "Children’s Privacy",
    description: `<p>Our service is not for children under 13. We do not knowingly collect data from minors.</p>`
  },
 
  {
    heading: "Updates to Policy",
    description: `<p>We may change this policy. Updated versions will be available on our platform.</p>`
  },
  {
    heading: "Contact Us",
    description: `<p>For any questions, email us at <a href="mailto:privacy@revision24.com" class="text-blue-600 underline">privacy@revision24.com</a></p>`
  }
];

const PrivacyPolicy = () => {
  return (
    <>
      <Header />
      <div className="max-w-8xl mx-auto px-4 p-8 text-gray-800 bg-white shadow-md rounded-lg">
        <h1 className="text-3xl font-bold text-center mb-6">Privacy Policy – Revision24</h1>
        <p className="text-sm text-gray-500 text-center mb-6">Effective Date: July 1, 2025</p>

        <p className="mb-6">
          This Privacy Policy explains how Revision24 collects, uses, and protects your information.
        </p>

        {privacyPolicy.map((item, index) => (
          <section key={index} className="mb-6">
            <h2 className="text-xl font-semibold mb-2">
              {index + 1}. {item.heading}
            </h2>
            <div
              className="prose prose-sm"
              dangerouslySetInnerHTML={{ __html: item.description }}
            />
          </section>
        ))}
      </div>
      <Footer />
    </>
  );
};

export default PrivacyPolicy;
