import Link from "next/link";
import { useRouter } from "next/router";
import Head from "next/head";
import { useState } from "react";
import accountsApi from "../services/accountsApi";

export default function Layout({ title, children }) {
  const [menuOpen, openMenu] = useState(false);
  const [avatarDropdownOpen, openAvatarDropdown] = useState(false);
  const router = useRouter();
  const handleSignOut = async (e) => {
    e.preventDefault();

    try {
      await accountsApi.post("logout");
      router.push("/auth/login");
    } catch (error) {
      console.log(error); // todo: handle errors with a message
    }
  };

  return (
    <div>
      <Head>
        <title key="title">Skynet - {title}</title>
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
                        role="img"
                        width="33"
                        height="33"
                        fill="#00C65E"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <title>Skynet</title>
                        <path d="m-.0004 6.4602 21.3893 11.297c.561.2935.6633 1.0532.1999 1.4846h-.011a10.0399 10.0399 0 0 1-2.2335 1.5307c-6.912 3.4734-14.9917-1.838-14.5438-9.5605l2.8601 1.9752c.856 4.508 5.6187 7.1094 9.8742 5.3932zm8.6477 3.1509 14.3661 5.6785a.8704.8704 0 0 1 .5197 1.0466v.0182c-.1537.5377-.7668.7938-1.2575.5252zm5.2896-7.4375c2.7093-.2325 6.0946.7869 8.1116 3.3871 1.699 2.1951 2.0497 4.8772 1.9298 7.6465v-.007c-.0478.5874-.6494.9616-1.1975.745l-9.7652-3.8596 9.0656 2.4313a7.296 7.296 0 0 0-1.0677-4.5631c-2.9683-4.7678-9.9847-4.5344-12.6297.4201a7.5048 7.5048 0 0 0-.398.8831L5.5546 7.9614c.069-.1017.1417-.198.2144-.2962.1163-.2416.2417-.487.3798-.7268 1.6118-2.7911 4.3102-4.4338 7.1558-4.6973.2108-.0182.4215-.049.6323-.0672z" />
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
                      <a
                        href={process.env.NEXT_PUBLIC_SKYNET_PORTAL_API}
                        className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Upload files
                        <svg
                          className="flex-shrink-0 h-4 w-4 ml-2"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </a>
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
                          <Link href="/user/settings">
                            <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                              Settings
                            </a>
                          </Link>
                          <Link href="/payments">
                            <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                              Payments
                            </a>
                          </Link>
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
              <a
                href={process.env.NEXT_PUBLIC_SKYNET_PORTAL_API}
                className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium flex items-center"
                target="_blank"
                rel="noopener noreferrer"
              >
                Upload files
                <svg
                  className="flex-shrink-0 h-4 w-4 ml-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
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
                <Link href="/user/settings">
                  <a className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700">
                    Settings
                  </a>
                </Link>
                <Link href="/payments">
                  <a className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700">
                    Payments
                  </a>
                </Link>
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
          {children || (
            <div className="bg-white rounded-lg shadow px-5 py-6 sm:px-6">
              <div className="border-4 border-dashed border-gray-200 rounded-lg h-96" />
            </div>
          )}
        </div>
      </main>

      <footer className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
        <p className="text-center text-sm text-gray-400">© 2021 Skynet Labs Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}
