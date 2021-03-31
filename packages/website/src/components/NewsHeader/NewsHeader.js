import * as React from "react";
import Link from "../Link";
import { ArrowRight, DiscordSmallWhite } from "../Icons";

const NewsHeader = () => {
  return (
    <div className="bg-palette-500 px-8 p-3">
      <div className="max-w-layout mx-auto">
        <div className="flex justify-between">
          <Link
            to="/news"
            className="text-palette-300 font-content leading-8 flex items-center overflow-hidden text-base hover:text-primary transition-colors duration-200"
          >
            <ArrowRight className="mr-2 flex-shrink-0 fill-current text-primary" />
            <span className="truncate">Skynet Announces SkyDB, Unlocking Fully Decentralized Internet</span>
          </Link>

          <div className="ml-auto items-center pl-8 hidden desktop:block">
            <Link
              href="https://discordapp.com/invite/sia"
              className="text-palette-300 leading-8 font-content flex items-center flex-shrink-0 whitespace-nowrap"
            >
              <DiscordSmallWhite className="mr-2" />
              <span>Join our Discord</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

NewsHeader.propTypes = {};

NewsHeader.defaultProps = {};

export default NewsHeader;
