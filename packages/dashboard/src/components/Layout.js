import Link from "next/link";
import Head from "next/head";
import { useState } from "react";
import config from "../../src/config";

const signOutUrl = `${config.kratos.browser}/self-service/browser/flows/logout`;

export default function Layout({ title, children }) {
  const [menuOpen, openMenu] = useState(false);
  const [avatarDropdownOpen, openAvatarDropdown] = useState(false);

  return (
    <div>
      <Head>
        <title>Skynet - {title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="bg-gray-800 pb-32">
        <nav className="bg-gray-800">
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="border-b border-gray-700">
              <div className="flex items-center justify-between h-16 px-4 sm:px-0">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg
                      viewBox="0 0 66 66"
                      width={33}
                      height={33}
                      className="mx-auto h-12 w-auto"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M52 52V33.287C52 22.784 43.599 14.052 33.096 14 22.544 13.948 13.948 22.543 14 33.096 14.052 43.599 22.784 52 33.287 52H52zM33 1c17.673 0 32 14.326 32 32v32H33C15.326 65 1 50.673 1 33 1 15.326 15.326 1 33 1z"
                        fillRule="nonzero"
                        stroke="green"
                        strokeWidth="2"
                        fill="none"
                      />
                    </svg>
                  </div>
                  <div className="hidden md:block">
                    <div className="ml-10 flex items-baseline space-x-4">
                      {/* Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" */}
                      <Link href="/">
                        <a className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                          Dashboard
                        </a>
                      </Link>
                      <Link href="/uploads">
                        <a className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                          Your uploads
                        </a>
                      </Link>
                      <Link href="/downloads">
                        <a className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                          Your downloads
                        </a>
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="ml-4 flex items-center md:ml-6">
                    {/* Profile dropdown */}
                    <div className="ml-3 relative">
                      <div>
                        <button
                          className="max-w-xs bg-gray-800 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                          id="user-menu"
                          aria-haspopup="true"
                          onClick={() => openAvatarDropdown(!avatarDropdownOpen)}
                        >
                          <span className="sr-only">Open user menu</span>
                          <span className="inline-block h-8 w-8 rounded-full overflow-hidden bg-gray-100">
                            <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                          </span>
                        </button>
                      </div>
                      {/*
                      Profile dropdown panel, show/hide based on dropdown state.
        
                      Entering: "transition ease-out duration-100"
                        From: "transform opacity-0 scale-95"
                        To: "transform opacity-100 scale-100"
                      Leaving: "transition ease-in duration-75"
                        From: "transform opacity-100 scale-100"
                        To: "transform opacity-0 scale-95"
                    */}
                      {avatarDropdownOpen && (
                        <div
                          className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5"
                          role="menu"
                          aria-orientation="vertical"
                          aria-labelledby="user-menu"
                        >
                          <a
                            href="#"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            role="menuitem"
                          >
                            Settings (coming soon)
                          </a>
                          <Link href="/payments">
                            <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                              Payments
                            </a>
                          </Link>
                          <a
                            href={signOutUrl}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            role="menuitem"
                          >
                            Sign out
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="-mr-2 flex md:hidden">
                  {/* Mobile menu button */}
                  <button
                    className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                    onClick={() => openMenu(!menuOpen)}
                  >
                    <span className="sr-only">Open main menu</span>
                    <svg
                      className={`${menuOpen ? "hidden" : "block"} h-6 w-6`}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                    <svg
                      className={`${menuOpen ? "block" : "hidden"} h-6 w-6`}
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
              </div>
            </div>
          </div>
          <div className={`${menuOpen ? "block" : "hidden"} border-b border-gray-700 md:hidden`}>
            <div className="px-2 py-3 space-y-1 sm:px-3">
              {/* Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" */}
              <a href="#" className="bg-gray-900 text-white block px-3 py-2 rounded-md text-base font-medium">
                Dashboard
              </a>
              <a
                href="#"
                className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              >
                Your uploads (coming soon)
              </a>
              <a
                href="#"
                className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              >
                Your downloads (coming soon)
              </a>
            </div>
            <div className="pt-4 pb-3 border-t border-gray-700">
              <div className="flex items-center px-5">
                <div className="flex-shrink-0">
                  <span className="inline-block h-10 w-10 rounded-full overflow-hidden bg-gray-100">
                    <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </span>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium leading-none text-white">John Doe</div>
                  <div className="text-sm font-medium leading-none text-gray-400">john@example.com</div>
                </div>
              </div>
              <div className="mt-3 px-2 space-y-1">
                <a
                  href="#"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
                >
                  Settings (coming soon)
                </a>
                <Link href="/payments">
                  <a className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700">
                    Payments
                  </a>
                </Link>
                <a
                  href={signOutUrl}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
                >
                  Sign out
                </a>
              </div>
            </div>
          </div>
        </nav>
        <header className="py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-white">{title}</h1>
          </div>
        </header>
      </div>
      <main className="-mt-32">
        <div className="max-w-7xl mx-auto pb-12 px-4 sm:px-6 lg:px-8">
          {/* Replace with your content */}
          {children || (
            <div className="bg-white rounded-lg shadow px-5 py-6 sm:px-6">
              <div className="border-4 border-dashed border-gray-200 rounded-lg h-96" />
            </div>
          )}
          {/* /End replace */}
        </div>
      </main>
    </div>
  );
}
