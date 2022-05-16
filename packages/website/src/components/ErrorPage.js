import * as React from "react";
import { LogoBlackText } from "./Icons";
import Seo from "./seo";

export default function ErrorPage({ statusCode, statusReason, header, subheader, redirect, more }) {
  React.useEffect(() => {
    if (redirect && typeof window !== "undefined") {
      setTimeout(() => {
        window.location.href = redirect;
      }, 3000); // 3s
    }
  }, [redirect]);

  return (
    <>
      <Seo title={`${statusCode}: ${statusReason}`} />

      <div className="bg-white min-h-full px-4 py-16 sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8">
        <div className="max-w-max mx-auto">
          <main className="sm:flex-col sm:max-w-3xl space-y-4 sm:space-y-6">
            <LogoBlackText className="h-10 ml-[-10px]" />

            <div className="flex-col space-y-1 sm:space-y-2">
              <h1 className="text-lg sm:text-2xl">{header}</h1>

              <p className="text-sm sm:text-md text-palette-400">{subheader}</p>
            </div>

            {more && <p className="text-sm text-palette-300">{more}</p>}

            {redirect && (
              <p className="text-xs text-palette-300">
                If you're not redirected automatically,{" "}
                <a href={redirect} className="text-primary hover:text-primary-light transition-colors duration-200">
                  click here
                </a>
              </p>
            )}
          </main>
        </div>
      </div>
    </>
  );
}
