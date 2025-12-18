import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const TermsOfServicePage = () => {
  return (
    <>
      <Header />
      <div className="max-w-8xl px-4 p-8 text-gray-800 bg-white shadow-md rounded-lg">
        <h1 className="text-3xl font-bold text-center mb-6">Terms of Service – Revision24</h1>
        <p className="text-sm text-gray-500 text-center mb-6">Last Updated: July 1, 2025</p>

        <p className="mb-4">
          Welcome to <strong>Revision24</strong>. These Terms & Conditions ("Terms") govern your use of the platform
          <Link to="https://revision24.com" className="text-blue-600 hover:underline" target="_blank" rel="noreferrer"> https://revision24.com</Link>
          and its mobile/web applications. By registering or using our services, you agree to these Terms.
        </p>

        <ul className="space-y-4">
          <li>
            <h2 className="font-semibold text-lg">1. Registration</h2>
            <p>Users must register using a valid phone number and OTP verification. Once verified, users must enter their name and PIN.</p>
          </li>

          <li>
            <h2 className="font-semibold text-lg">2. Features</h2>
            <ul className="list-disc ml-6">
              <li>Free Quizzes</li>
              <li>Current Affairs</li>
              <li>Topic-Wise Practice Tests</li>
              <li>Previous Papers</li>
              <li>Progress Tracker</li>
              <li>Exam Info</li>
              <li>Study Notes</li>
              <li>Doubt Solving</li>
            </ul>
          </li>

          <li>
            <h2 className="font-semibold text-lg">3. Quiz Game & Rewards</h2>
            <p>Users can enter quiz games with an entry amount. Top performers may win rewards. Cheating will result in disqualification or suspension.</p>
          </li>

          <li>
            <h2 className="font-semibold text-lg">4. Wallet System</h2>
            <p>The wallet is used for participation, rewards, and tracking earnings. Balances are non-transferable and non-refundable.</p>
          </li>

          <li>
            <h2 className="font-semibold text-lg">5. Bank Details & Payouts</h2>
            <p>Bank details are required for reward withdrawals. Payouts are subject to verification and policy compliance.</p>
          </li>

          <li>
            <h2 className="font-semibold text-lg">6. Subscriptions</h2>
            <p>Premium tests require a paid subscription. Fees are non-refundable unless otherwise stated.</p>
          </li>

          <li>
            <h2 className="font-semibold text-lg">7. Referral Program</h2>
            <p>Users may refer others and earn rewards based on successful referrals and their activity.</p>
          </li>

          <li>
            <h2 className="font-semibold text-lg">8. Support</h2>
            <p>Support is available via the app or by emailing <Link to="mailto:support@revision24.com" className="text-blue-600 hover:underline">support@revision24.com</Link>.</p>
          </li>

          <li>
            <h2 className="font-semibold text-lg">9. Collection</h2>
            <p>Allows users to buy test series and save questions for later review.</p>
          </li>

          <li>
            <h2 className="font-semibold text-lg">10. Settings</h2>
            <ul className="list-disc ml-6">
              <li>Profile Edit</li>
              <li>Notifications</li>
              <li>Light/Dark Mode</li>
              <li>Rate App</li>
              <li>Share App</li>
              <li>Access Privacy Policy & Terms</li>
              <li>Send Feedback</li>
            </ul>
          </li>

          <li>
            <h2 className="font-semibold text-lg">11. Prohibited Conduct</h2>
            <p>No bots, no cheating, no shared accounts, and no illegal activity allowed.</p>
          </li>

          <li>
            <h2 className="font-semibold text-lg">12. Termination</h2>
            <p>We may suspend or terminate accounts for any violations of these Terms.</p>
          </li>

          <li>
            <h2 className="font-semibold text-lg">13. Changes to Terms</h2>
            <p>We may update these Terms. Continued use indicates your acceptance.</p>
          </li>

          <li>
            <h2 className="font-semibold text-lg">14. Governing Law</h2>
            <p>These Terms are governed by the laws of your jurisdiction.</p>
          </li>
        </ul>
      </div>
      <Footer />
    </>
  );
};

export default TermsOfServicePage;
