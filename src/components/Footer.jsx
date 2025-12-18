import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
  FaYoutube,
  FaTelegram,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaClock,
  FaHeart,
  FaRocket,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      icon: FaFacebookF,
      url: "https://www.facebook.com/revision24official",
      label: "Facebook",
      color: "hover:text-blue-500"
    },
    {
      icon: FaTwitter,
      url: "https://x.com/theRevision24",
      label: "Twitter",
      color: "hover:text-blue-400"
    },
    {
      icon: FaInstagram,
      url: "https://instagram.com/revision24official",
      label: "Instagram",
      color: "hover:text-pink-500"
    },
    {
      icon: FaYoutube,
      url: "https://youtube.com/@revision24official",
      label: "YouTube",
      color: "hover:text-red-500"
    },
    {
      icon: FaTelegram,
      url: "https://t.me/revision24official",
      label: "Telegram",
      color: "hover:text-blue-400"
    },
  ];

  const companyLinks = [
    { name: "About Us", url: "/about" },
    {
      name: "Careers",
      url: "https://forms.gle/u3JHMnuZ7NHHUaBs7",
      external: true,
      badge: "We are hiring"
    },
    { name: "Media", url: "#" },
    { name: "Contact", url: "/contact" },
  ];

  const productLinks = [
    { name: "Test Series", url: "/test-series" },
    { name: "Live Tests & Quizzes", url: "/live-tests" },
    { name: "Revision24 Focus+", url: "/subscription", component: Link },
    { name: "Online Videos", url: "https://youtube.com/@revision24official", external: true },
    { name: "Practice", url: "/practice" },
    { name: "Blog", url: "/blog", component: Link },
  ];

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 text-gray-300">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">

          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <img
                src="/logo.jpeg"
                alt="Revision24 Logo"
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl shadow-lg ring-2 ring-blue-500/20"
              />
              <div>
                <h3 className="text-xl font-bold text-white">Revision24</h3>
                <p className="text-sm text-gray-400">Learn • Practice • Excel</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-white font-semibold text-lg">Duharia Enterprises Pvt. Ltd.</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-start space-x-2">
                  <FaMapMarkerAlt className="w-4 h-4 mt-1 text-blue-400 flex-shrink-0" />
                  <span className="leading-relaxed">
                    284,03, SSB Road, Sri Ganganagar, Rajasthan, India-335001
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaEnvelope className="w-4 h-4 text-green-400" />
                  <a href="mailto:info@revision24.com" className="hover:text-white transition-colors">
                    info@revision24.com
                  </a>
                </div>
                <div className="flex items-center space-x-2">
                  <FaPhone className="w-4 h-4 text-orange-400" />
                  <a href="tel:+918306612328" className="hover:text-white transition-colors">
                    +91 8306612328
                  </a>
                </div>
                <div className="flex items-center space-x-2">
                  <FaClock className="w-4 h-4 text-purple-400" />
                  <span>10 AM - 7 PM (All 7 days)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div className="space-y-6">
            <h3 className="text-white font-bold text-lg flex items-center">
              <span className="w-1 h-6 bg-blue-500 rounded-full mr-3"></span>
              Company
            </h3>
            <ul className="space-y-3">
              {companyLinks.map((link, index) => (
                <li key={index}>
                  {link.external ? (
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center text-sm hover:text-white transition-colors duration-300"
                    >
                      <span className="w-0 group-hover:w-2 h-0.5 bg-blue-500 transition-all duration-300 mr-0 group-hover:mr-2 rounded-full"></span>
                      {link.name}
                      {link.badge && (
                        <span className="ml-2 bg-gradient-to-r from-green-500 to-blue-500 text-white text-xs px-2 py-1 rounded-full font-semibold animate-pulse">
                          {link.badge}
                        </span>
                      )}
                    </a>
                  ) : (
                    <a
                      href={link.url}
                      className="group flex items-center text-sm hover:text-white transition-colors duration-300"
                    >
                      <span className="w-0 group-hover:w-2 h-0.5 bg-blue-500 transition-all duration-300 mr-0 group-hover:mr-2 rounded-full"></span>
                      {link.name}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Products Links */}
          <div className="space-y-6">
            <h3 className="text-white font-bold text-lg flex items-center">
              <span className="w-1 h-6 bg-green-500 rounded-full mr-3"></span>
              Products
            </h3>
            <ul className="space-y-3">
              {productLinks.map((link, index) => {
                const LinkComponent = link.component || 'a';
                const linkProps = link.external
                  ? { href: link.url, target: "_blank", rel: "noopener noreferrer" }
                  : { [link.component ? 'to' : 'href']: link.url };

                return (
                  <li key={index}>
                    <LinkComponent
                      {...linkProps}
                      className="group flex items-center text-sm hover:text-white transition-colors duration-300"
                    >
                      <span className="w-0 group-hover:w-2 h-0.5 bg-green-500 transition-all duration-300 mr-0 group-hover:mr-2 rounded-full"></span>
                      {link.name}
                    </LinkComponent>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* App Download & Social */}
          <div className="space-y-6">
            <div>
              <h3 className="text-white font-bold text-lg mb-4 flex items-center">
                <span className="w-1 h-6 bg-purple-500 rounded-full mr-3"></span>
                Get Our App
              </h3>
              <div className="flex flex-wrap gap-3">
                <a
                  href="https://play.google.com/store/apps/details?id=com.edurevision24&pcampaignid=web_share"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <div className="flex items-center bg-gray-800 hover:bg-gray-700 rounded-lg p-3 transition-all duration-300 group-hover:scale-105">
                    <img src="/googlePay.png" alt="Google Play" className="w-8 h-8 mr-3" />
                    <div>
                      <p className="text-xs text-gray-400">Get it on</p>
                      <p className="text-sm font-semibold text-white">Google Play</p>
                    </div>
                  </div>
                </a>
                <a
                  href="https://apps.apple.com/in/app/edurevision24/id6751642229"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <div className="flex items-center bg-gray-800 hover:bg-gray-700 rounded-lg p-3 transition-all duration-300 group-hover:scale-105">
                    <img src="/app_store.png" alt="App Store" className="w-8 h-8 mr-3" />
                    <div>
                      <p className="text-xs text-gray-400">Download on</p>
                      <p className="text-sm font-semibold text-white">App Store</p>
                    </div>
                  </div>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-white font-bold text-lg mb-4 flex items-center">
                <span className="w-1 h-6 bg-pink-500 rounded-full mr-3"></span>
                Follow Us
              </h3>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className={`
                      group w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center 
                      transition-all duration-300 hover:scale-110 ${social.color}
                    `}
                  >
                    <social.icon className="w-4 h-4 group-hover:scale-125 transition-transform duration-300" />
                  </a>
                ))}
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-lg p-4 border border-blue-500/20">
              <h4 className="text-white font-semibold mb-2 flex items-center">
                <FaRocket className="w-4 h-4 mr-2 text-yellow-400" />
                Stay Updated
              </h4>
              <p className="text-sm text-gray-400 mb-3">Get the latest updates and offers</p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 bg-gray-800 text-white px-3 py-2 rounded-l-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 px-4 py-2 rounded-r-lg transition-all duration-300 hover:scale-105">
                  <FaRocket className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 bg-slate-900/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center text-sm text-gray-400">
              <span>Copyright © {currentYear} Revision24. All rights reserved</span>
              <FaHeart className="w-3 h-3 mx-2 text-red-500 animate-pulse" />
              <span>Made in India</span>
            </div>

            <div className="flex items-center space-x-6 text-sm">
              <Link
                to="/terms-of-service"
                className="text-gray-400 hover:text-white transition-colors duration-300 relative group"
              >
                Terms
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link
                to="/privacy-policy"
                className="text-gray-400 hover:text-white transition-colors duration-300 relative group"
              >
                Privacy
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link
                to="/refund-policy"
                className="text-gray-400 hover:text-white transition-colors duration-300 relative group"
              >
                Refund Policy
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <div className="flex items-center text-gray-500">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                <span className="text-xs">All systems operational</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
