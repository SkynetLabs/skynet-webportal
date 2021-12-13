import * as React from "react";
import classnames from "classnames";
import {
  ArrowRight,
  CheckActive,
  DiscordSmall,
  TwitterSmall,
  RedditSmall,
  MediumSmall,
  YoutubeSmall,
  TikTokSmall,
} from "../../components/Icons";
import useSubscribe from "./useSubscribe";
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
  const [experienced, setExperienced] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const { subscribe, complete, success, message, pending } = useSubscribe();

  const onSubscribe = async (event) => {
    event.preventDefault();

    subscribe(email, experienced);
  };

  return (
    <div className="grid gap-y-12 desktop:grid-cols-3 desktop:gap-x-8 max-w-column desktop:max-w-full">
      <div>
        <SectionHeader>Newsletter</SectionHeader>
        <SectionTitle>Stay up to date</SectionTitle>

        <form onSubmit={onSubscribe} className="flex flex-col space-y-4">
          <div className="relative rounded-md shadow-sm">
            <label htmlFor="newsletter-email" className="sr-only">
              Email
            </label>
            <input
              type="text"
              name="email"
              id="newsletter-email"
              className="block w-full rounded pr-10 pl-4 py-2 bg-transparent border-2 border-palette-600 text-sm placeholder-palette-600"
              placeholder="Email address"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <button type="submit" className="absolute inset-y-0 right-0 px-2 flex items-center" disabled={pending}>
              <ArrowRight />
            </button>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="newsletter-experience"
              className="sr-only"
              value={experienced}
              onChange={() => setExperienced(!experienced)}
            />
            <button type="button" onClick={() => setExperienced(!experienced)}>
              <CheckActive
                className={classnames("bg-palette-600 rounded-full h-8 w-8", { "opacity-20": !experienced })}
              />
            </button>
            <label htmlFor="newsletter-experience" className="text-xs font-content pl-2 leading-6 cursor-pointer">
              Do you have previous experience using Skynet?
            </label>
          </div>

          {complete && message && (
            <div
              className={classnames(
                "newsletter-message text-left desktop:text-center py-2 px-4 rounded bg-palette-600 font-semibold font-content text-white",
                {
                  "text-error": !success,
                }
              )}
              dangerouslySetInnerHTML={{ __html: message }}
            ></div>
          )}
        </form>
      </div>

      <div className="desktop:col-span-2">
        <SectionHeader>Community</SectionHeader>
        <SectionTitle>Join our community</SectionTitle>
        <div className="grid grid-cols-2 desktop:grid-cols-6 max-w-column desktop:max-w-full">
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
