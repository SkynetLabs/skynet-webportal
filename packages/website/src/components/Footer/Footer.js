import * as React from "react";
import { LogoWhiteText } from "../Icons";
import Link from "../Link";

// const hostname = typeof window !== "undefined" ? window.location.hostname : "";
// const domain = hostname.substring(hostname.lastIndexOf(".", hostname.lastIndexOf(".") - 1) + 1);
// const emails = domain ? [`hello@${domain}`, `report@${domain}`] : [];

// temporary hardcode siasky.net emails until we have environment
// variables for them and we can reflect that in the terms of service
const emails = ["hello@siasky.net", "report@siasky.net"];

const Footer = () => {
  return (
    <div className="bg-palette-600 px-8 py-12">
      <div className="max-w-content mx-auto">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <LogoWhiteText />
            <span className="ml-8 text-palette-300 text-sm font-content hidden desktop:inline">
              {new Date().getFullYear()} Skynet Labs
            </span>
          </div>

          {emails.length > 0 && (
            <div className="flex flex-col text-right space-y-2">
              {emails.map((email) => (
                <Link
                  key={email}
                  href={`mailto:${email}`}
                  className="font-content text-palette-300 text-base underline-primary hover:text-primary transition-colors duration-200"
                >
                  {email}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

Footer.propTypes = {};

Footer.defaultProps = {};

export default Footer;
