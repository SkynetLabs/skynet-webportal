import * as React from "react";
import {
  DiscordSmall,
  TwitterSmall,
  RedditSmall,
  MediumSmall,
  YoutubeSmall,
  TikTokSmall,
} from "../../components/Icons";
import Link from "../Link";
const social = [
  { name: "Discord", Icon: DiscordSmall, href: "https://discord.gg/skynetlabs" },
  { name: "Twitter", Icon: TwitterSmall, href: "https://twitter.com/SkynetLabs" },
  { name: "Reddit", Icon: RedditSmall, href: "https://www.reddit.com/r/siacoin" },
  { name: "Medium", Icon: MediumSmall, href: "https://blog.sia.tech" },
  { name: "Youtube", Icon: YoutubeSmall, href: "https://www.youtube.com/c/SiaTVOfficial/featured" },
  { name: "TikTok", Icon: TikTokSmall, href: "https://www.tiktok.com/@decentralizedfuture" },
];

const SectionHeader = ({ children }) => <h3 className="uppercase text-xs text-palette-600 desktop:mb-1">{children}</h3>;
const SectionTitle = ({ children }) => (
  <h3 className="text-lg desktop:text-3xl font-semibold mb-4 desktop:mb-6">{children}</h3>
);

const CommunitySection = () => {
  return (
    <div className="grid gap-y-12 desktop:grid-cols-3 desktop:gap-x-8 max-w-full">
      <div className="tablet:col-span-2">
        <SectionHeader>Community</SectionHeader>
        <SectionTitle>Join Skynet community</SectionTitle>
        <div className="grid grid-cols-2 tablet:grid-cols-6 max-w-full">
          {social.map(({ name, Icon, href }) => (
            <Link
              key={name}
              href={href}
              className="text-palette-600 text-sm font-light flex items-center flex-shrink-0 flex-grow-0 whitespace-nowrap leading-10 space-x-2 hover:text-palette-500 transition-colors duration-200"
            >
              <Icon className="fill-current" />
              <span>{name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

CommunitySection.propTypes = {};

CommunitySection.defaultProps = {};

export default CommunitySection;
