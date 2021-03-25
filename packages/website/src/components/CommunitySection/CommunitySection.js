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

const social = [
  { name: "Discord", Icon: DiscordSmall, href: "https://discordapp.com/invite/sia" },
  { name: "Twitter", Icon: TwitterSmall, href: "/" },
  { name: "Reddit", Icon: RedditSmall, href: "/" },
  { name: "Medium", Icon: MediumSmall, href: "/" },
  { name: "Youtube", Icon: YoutubeSmall, href: "/" },
  { name: "Tik Tok", Icon: TikTokSmall, href: "/" },
];

const SectionHeader = ({ children }) => <h3 className="uppercase text-xs text-palette-600 desktop:mb-1">{children}</h3>;
const SectionTitle = ({ children }) => (
  <h3 className="text-lg desktop:text-3xl font-semibold mb-4 desktop:mb-6">{children}</h3>
);

const CommunitySection = () => {
  const [experienced, setExperienced] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const onSubscribe = (event) => {
    event.preventDefault();

    alert(`this will subscribe ${email} for a newsletter`);

    setEmail("");
  };

  return (
    <div className="grid gap-y-12 desktop:grid-cols-3 desktop:gap-x-8">
      <div>
        <SectionHeader>Newsletter</SectionHeader>
        <SectionTitle>Stay up to date</SectionTitle>

        <form onSubmit={onSubscribe} className="flex flex-col">
          <label htmlFor="newsletter-email" className="sr-only">
            Email
          </label>
          <div className="relative rounded-md shadow-sm">
            <input
              type="text"
              name="email"
              id="newsletter-email"
              className="block w-full rounded pr-10 pl-4 py-2 bg-transparent border-2 border-palette-600 text-sm placeholder-palette-600"
              placeholder="Email address"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <button type="submit" className="absolute inset-y-0 right-0 px-2 flex items-center">
              <ArrowRight />
            </button>
          </div>

          <div className="flex items-center mt-4">
            <input
              type="checkbox"
              id="newsletter-experience"
              className="sr-only"
              value={experienced}
              onChange={() => setExperienced(!experienced)}
            />
            <button type="button" onClick={() => setExperienced(!experienced)}>
              <CheckActive
                className={classnames("bg-palette-600 rounded-full h-6 w-6", { "opacity-20": !experienced })}
              />
            </button>
            <label htmlFor="newsletter-experience" className="text-xs font-content pl-2 leading-6 cursor-pointer">
              Do you have previous experience using Skynet?
            </label>
          </div>
        </form>
      </div>

      <div className="desktop:col-span-2">
        <SectionHeader>Community</SectionHeader>
        <SectionTitle>Join our community</SectionTitle>
        <div className="grid grid-cols-2 desktop:grid-cols-6 max-w-column desktop:max-w-full">
          {social.map(({ name, Icon, href }) => (
            <a
              key={name}
              href={href}
              className="text-palette-600 text-sm font-light flex items-center flex-shrink-0 flex-grow-0 whitespace-nowrap leading-10"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon className="mr-2 fill-current" />
              <span>{name}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

CommunitySection.propTypes = {};

CommunitySection.defaultProps = {};

export default CommunitySection;
