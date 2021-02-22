import Link from "next/link";
import { useRouter } from "next/router";
import Head from "next/head";
import ky from "ky/umd";
import { useState } from "react";
import config from "../../src/config";

export default function Layout({ title, children }) {
  const [menuOpen, openMenu] = useState(false);
  const [avatarDropdownOpen, openAvatarDropdown] = useState(false);
  const router = useRouter();
  const handleSignOut = async (e) => {
    e.preventDefault();

    try {
      await ky.post("/logout");

      window.location = `${config.kratos.browser}/self-service/browser/flows/logout`;
    } catch (error) {
      console.log(error); // todo: handle errors with a message
    }
  };

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
                  <Link href="/">
                    <a className="flex-shrink-0">
                      <svg
                        viewBox="19.88800048828125 37.1175193787 132.07760620117188 132.07760620117188"
                        width={33}
                        height={33}
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M 116.388 139.371 C 92.969 148.816 66.759 134.5 62.048 109.691 L 46.308 98.821 C 43.843 141.32 88.308 170.55 126.346 151.435 C 130.805 149.195 134.94 146.361 138.638 143.011 L 138.698 143.011 C 141.248 140.637 140.685 136.456 137.598 134.841 L 19.888 72.671 Z"
                          style={{ fill: "rgb(88, 181, 96)" }}
                        />
                        <path
                          d="M 149.398 127.121 L 149.398 127.021 C 150.067 124.651 148.83 122.161 146.538 121.261 L 67.478 90.011 L 142.478 130.011 C 145.178 131.489 148.552 130.08 149.398 127.121 Z"
                          style={{ fill: "rgb(88, 181, 96)" }}
                        />
                        <path
                          d="M 151.848 109.801 C 152.508 94.561 150.578 79.801 141.228 67.721 C 130.128 53.411 111.498 47.801 96.588 49.081 C 95.428 49.181 94.268 49.351 93.108 49.451 C 77.448 50.901 62.598 59.941 53.728 75.301 C 52.968 76.621 52.278 77.971 51.638 79.301 C 51.238 79.841 50.838 80.371 50.458 80.931 L 63.838 88.061 C 64.463 86.395 65.194 84.772 66.028 83.201 C 80.584 55.935 119.197 54.651 135.532 80.889 C 140.199 88.386 142.264 97.212 141.408 106.001 L 91.518 92.621 L 145.258 113.861 C 148.274 115.053 151.585 112.994 151.848 109.761 Z"
                          style={{ fill: "rgb(88, 181, 96)" }}
                        />
                      </svg>
                    </a>
                  </Link>
                  <div className="hidden md:block">
                    <div className="ml-10 flex items-baseline space-x-4">
                      {/* Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" */}
                      <Link href="/">
                        <a
                          className={`${
                            router.pathname === "/"
                              ? "bg-gray-900 text-white"
                              : "text-gray-300 hover:bg-gray-700 hover:text-white"
                          } px-3 py-2 rounded-md text-sm font-medium`}
                        >
                          Dashboard
                        </a>
                      </Link>
                      <Link href="/uploads">
                        <a
                          className={`${
                            router.pathname === "/uploads"
                              ? "bg-gray-900 text-white"
                              : "text-gray-300 hover:bg-gray-700 hover:text-white"
                          } px-3 py-2 rounded-md text-sm font-medium`}
                        >
                          Your uploads
                        </a>
                      </Link>
                      <Link href="/downloads">
                        <a
                          className={`${
                            router.pathname === "/downloads"
                              ? "bg-gray-900 text-white"
                              : "text-gray-300 hover:bg-gray-700 hover:text-white"
                          } px-3 py-2 rounded-md text-sm font-medium`}
                        >
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
                          <Link href="/settings">
                            <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                              Settings
                            </a>
                          </Link>
                          <a
                            href="#"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            role="menuitem"
                          >
                            Payments (coming soon)
                          </a>
                          <a
                            href="#"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                            role="menuitem"
                            onClick={handleSignOut}
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
              <Link href="/">
                <a
                  className={`${
                    router.pathname === "/"
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  } block px-3 py-2 rounded-md text-base font-medium`}
                >
                  Dashboard
                </a>
              </Link>
              <Link href="/uploads">
                <a
                  className={`${
                    router.pathname === "/uploads"
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  } block px-3 py-2 rounded-md text-base font-medium`}
                >
                  Your uploads
                </a>
              </Link>
              <Link href="/downloads">
                <a
                  className={`${
                    router.pathname === "/downloads"
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  } block px-3 py-2 rounded-md text-base font-medium`}
                >
                  Your downloads
                </a>
              </Link>
            </div>
            <div className="pt-4 pb-3 border-t border-gray-700">
              {/* <div className="flex items-center px-5">
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
              </div> */}
              <div className="mt-3 px-2 space-y-1">
                <Link href="/">
                  <a className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700">
                    Settings
                  </a>
                </Link>
                <a
                  href="#"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
                >
                  Payments (coming soon)
                </a>
                <a
                  href="#"
                  onClick={handleSignOut}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700 cursor-pointer"
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

      <footer className="mb-4 sm:mb-6">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 lg:max-w-7xl text-sm text-gray-500 text-center sm:text-left">
          <span className="block sm:inline">© 2021 Skynet Labs Inc.</span>{" "}
          <span className="block sm:inline">All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
