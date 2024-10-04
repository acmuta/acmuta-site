import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGithub,
  faDiscord,
  faInstagram,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";
const Footer = () => {
  return (
    <footer className=" backdrop-blur-md relative z-40 bg-white/10 text-white py-10 border-t-4 border-white/70">
      <div className="max-w-screen-lg mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 px-6 md:px-12">
        {/* Logo Section */}
        <div className="flex flex-col items-center md:items-start">
          <img
            src="/assets/acm-logos/acm-logo.svg"
            alt="ACM UTA Logo"
            className="h-20 mb-4"
          />
        </div>

        {/* Sections Links */}
        <div className="flex flex-col items-center md:items-start">
          <h2 className="text-lg font-bold mb-3">sections</h2>
          <ul className="space-y-2">
            <li>
              <a href="/about" className="hover:text-white">
                about
              </a>
            </li>
            <li>
              <a href="/officers" className="hover:text-white">
                officers
              </a>
            </li>
            <li>
              <a href="/connect" className="hover:text-white">
                connect
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                events
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                apply
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Section */}
        <div className="flex flex-col items-center md:items-start">
          <h2 className="text-lg font-bold mb-3">contact us at:</h2>
          <p>
            <a href="mailto:acm.uta@gmail.com" className="hover:text-white">
              acm.uta@gmail.com
            </a>
          </p>
        </div>

        {/* Social Links Section */}
        <div className="flex flex-col items-center md:items-start">
          <h2 className="text-lg font-bold mb-3">connect with us</h2>
          <div className="flex space-x-4">
            <a
              href="https://github.com/acmuta"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white"
            >
              <FontAwesomeIcon icon={faGithub} className="h-6 w-6" />
            </a>
            <a
              href="https://discord.gg/WFng29qkR5"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white"
            >
              <FontAwesomeIcon icon={faDiscord} className="h-6 w-6" />
            </a>
            <a
              href="https://www.instagram.com/acmuta/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white"
            >
              <FontAwesomeIcon icon={faInstagram} className="h-6 w-6" />
            </a>
            <a
              href="https://www.linkedin.com/company/acmuta/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white"
            >
              <FontAwesomeIcon icon={faLinkedin} className="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>

      <div className="mt-8  pt-4 text-center text-sm text-white font-medium">
        © ACM at UTA 2024
      </div>
    </footer>
  );
};

export default Footer;
