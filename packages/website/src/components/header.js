import * as React from "react";
import PropTypes from "prop-types";
import { Link } from "gatsby";
import LogoWhiteText from "./Icons/LogoWhiteText.svg";

const Header = () => (
  <nav className="bg-gray-800">
    <div className="max-w-desktop mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-16">
        <div className="flex">
          <div className="-ml-2 mr-2 flex items-center desktop:hidden">
            {/* Mobile menu button */}
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {/*
        Icon when menu is closed.

        Heroicon name: outline/menu

        Menu open: "hidden", Menu closed: "block"
      */}
              <svg
                className="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              {/*
        Icon when menu is open.

        Heroicon name: outline/x

        Menu open: "block", Menu closed: "hidden"
      */}
              <svg
                className="hidden h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex-shrink-0 flex items-center">
            <LogoWhiteText className="h-8 w-auto" />
          </div>
        </div>
        <div className="flex items-center">
          <div className="hidden desktop:ml-6 desktop:flex desktop:items-center desktop:space-x-4">
            {/* Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" */}
            <Link to="/" className="text-white px-3 py-2 text-sm font-medium">
              Home
            </Link>
            <Link to="/about" className="text-white px-3 py-2 text-sm font-medium">
              About
            </Link>
            <a href="#" className="text-white px-3 py-2 text-sm font-medium">
              Developers
            </a>
            <a href="#" className="text-white px-3 py-2 text-sm font-medium">
              News
            </a>
            <a href="#" className="text-white px-3 py-2 rounded-md text-sm font-medium uppercase">
              Log in
            </a>
            <a
              href="#"
              className="bg-green-500 text-black hover:bg-green-600 px-3 py-2 rounded-full text-sm font-medium uppercase"
            >
              Sign up
            </a>
          </div>
        </div>
      </div>
    </div>
    {/* Mobile menu, show/hide based on menu state. */}
    <div className="desktop:hidden" id="mobile-menu">
      <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        {/* Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" */}
        <a href="#" className="bg-gray-900 text-white block px-3 py-2 rounded-md text-base font-medium">
          Dashboard
        </a>
        <a
          href="#"
          className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
        >
          Team
        </a>
        <a
          href="#"
          className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
        >
          Projects
        </a>
        <a
          href="#"
          className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
        >
          Calendar
        </a>
      </div>
      <div className="pt-4 pb-3 border-t border-gray-700">
        <div className="flex items-center px-5 sm:px-6">
          <div className="flex-shrink-0">
            <img
              className="h-10 w-10 rounded-full"
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixqx=KSH2sjxhcz&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt
            />
          </div>
          <div className="ml-3">
            <div className="text-base font-medium text-white">Tom Cook</div>
            <div className="text-sm font-medium text-gray-400">tom@example.com</div>
          </div>
          <button className="ml-auto flex-shrink-0 bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
            <span className="sr-only">View notifications</span>
            {/* Heroicon name: outline/bell */}
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </button>
        </div>
        <div className="mt-3 px-2 space-y-1 sm:px-3">
          <a
            href="#"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
          >
            Your Profile
          </a>
          <a
            href="#"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
          >
            Settings
          </a>
          <a
            href="#"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
          >
            Sign out
          </a>
        </div>
      </div>
    </div>
  </nav>
);

Header.propTypes = {
  siteTitle: PropTypes.string,
};

Header.defaultProps = {
  siteTitle: ``,
};

export default Header;
