"use client";
import React, { useState } from "react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const menuItems = [
    { name: "Home", link: "#" },
    { name: "About", link: "#" },
    { name: "Officers", link: "#" },
    { name: "Events", link: "#" },
    { name: "Connect", link: "#" },
  ];

  return (
    <nav className="backdrop-blur-sm bg-white/20 border-gray-200 sticky top-0 z-50">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img
            src="/assets/acm-logo-white.png"
            className="h-9"
            alt="ACM UTA Logo"
          />
          <span className="self-center text-2xl font-semibold whitespace-nowrap"></span>
        </a>
        <button
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-white rounded-lg md:hidden"
          aria-controls="navbar-default"
          aria-expanded={isMenuOpen}
          onClick={toggleMenu}
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>
        <div
          className={`${
            isMenuOpen ? "block" : "hidden"
          } w-full md:block md:w-auto`}
          id="navbar-default"
        >
          <ul className="font-bold flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0">
            {menuItems.map((item, index) => (
              <li key={index}>
                <a
                  href={item.link}
                  className="block py-2 px-3 text-white rounded lg:hover:bg-transparent sm:hover:bg-white/20 md:text-white-700 md:p-0"
                  aria-current={item.name === "Home" ? "page" : undefined}
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
