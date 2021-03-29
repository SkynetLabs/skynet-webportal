import * as React from "react";
import { LogoWhiteText } from "../Icons";
import Link from "../Link";

const Footer = () => {
  return (
    <div className="bg-palette-600 px-8 py-12">
      <div className="max-w-content mx-auto">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <LogoWhiteText />
            <span className="ml-8 text-palette-300 text-sm font-content hidden desktop:inline">
              2021 Skynet Labs Inc. | All rights reserved
            </span>
          </div>

          <Link
            href="mailto:hello@siasky.net"
            className="font-content text-palette-300 text-base border-b-2 border-primary"
          >
            hello@siasky.net
          </Link>
        </div>
      </div>
    </div>
  );
};

Footer.propTypes = {};

Footer.defaultProps = {};

export default Footer;
