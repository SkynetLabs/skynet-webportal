import * as React from "react";
import { LogoWhiteText } from "../Icons";
import Link from "../Link";
import emails from "../../services/emails";

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

          <div className="flex flex-col text-right space-y-2">
            <div>
              <span className="font-content text-palette-300 text-base mr-2">contact us at</span>
              <Link
                href={`mailto:${emails.contact}`}
                className="font-content text-palette-300 text-base underline-primary hover:text-primary transition-colors duration-200"
              >
                {emails.contact}
              </Link>
            </div>

            <div>
              <span className="font-content text-palette-300 text-base mr-2">report abuse at</span>
              <Link
                href={`mailto:${emails.report}`}
                className="font-content text-palette-300 text-base underline-primary hover:text-primary transition-colors duration-200"
              >
                {emails.report}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Footer.propTypes = {};

Footer.defaultProps = {};

export default Footer;
