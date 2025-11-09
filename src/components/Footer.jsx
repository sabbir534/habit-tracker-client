import React from "react";
import {
  FaFacebook,
  FaYoutube,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6"; // Using fa6 for the new X logo
import { Link } from "react-router";
import Logo from "../assets/logo.png"; // Import Link for internal navigation

const Footer = () => {
  return (
    <footer className="bg-linear-to-b from-blue-900 to-blue-700 text-blue-200 ">
      <div className="w-11/12 mx-auto px-4 py-16">
        {/* Updated to 3 columns by removing Newsletter */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
          {/* Section 1: Logo & Website Name */}
          <div className="mb-3 md:mb-0 flex flex-col items-center md:items-start">
            <img src={Logo} alt="HabitTracker Logo" className="w-15 md:w-30 " />

            {/* I changed mt-2 to mt-1 to reduce the space */}
            <p className="text-sm md:text-2xl font-bold mt-1">HabitTracker</p>

            <p className="text-sm">
              Building better habits, one day at a time.
            </p>
          </div>

          {/* Section 2: Contact Info */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-xl font-bold text-white mb-4">Contact Info</h4>{" "}
            <ul className="space-y-3">
              <li className="flex items-start">
                <FaMapMarkerAlt className="mr-3 mt-1 text-blue-100" />{" "}
                <span>
                  123 Habit St,
                  <br />
                  Dhaka, Bangladesh
                </span>
              </li>
              <li className="flex items-center">
                <FaPhoneAlt className="mr-3 text-blue-100" />
                <span>+1 (234) 567-890</span>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="mr-3 text-blue-100" />
                <a
                  href="mailto:contact@habittracker.com"
                  className="hover:text-white transition-colors"
                >
                  contact@habittracker.com
                </a>
              </li>
            </ul>
          </div>

          {/* Section 3: Social Media Links */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-xl font-bold text-white mb-4">Social</h4>
            <div className="flex space-x-4">
              <a
                href="https://x.com"
                aria-label="X (Twitter)"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-300 hover:text-white transition-colors"
              >
                <FaXTwitter size={22} />
              </a>
              <a
                href="https://youtube.com"
                aria-label="YouTube"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-300 hover:text-white transition-colors"
              >
                <FaYoutube size={22} />
              </a>
              <a
                href="https://facebook.com"
                aria-label="Facebook"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-300 hover:text-white transition-colors"
              >
                <FaFacebook size={22} />
              </a>
            </div>
          </div>
        </div>

        {/* Sub-Footer: Copyright and Legal Links */}
        <div className="mt-12 pt-8 border-t border-blue-600 flex flex-col md:flex-row justify-between items-center text-sm">
          {" "}
          <p className="text-center">
            &copy; {new Date().getFullYear()} HabitTracker. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            {/* Changed to React Router <Link> for SPA navigation */}
            <Link to="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-white transition-colors">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
