import * as React from "react";
import { Section, SectionTitle, CardWithDescription, CardWithTitle } from "../components/Layout";
import { Carousel } from "../components/Carousel/Carousel";
import Seo from "../components/seo";
import CommunitySection from "../components/CommunitySection";
import Uploader from "../components/Uploader";
import {
  ArrowRight,
  SkynetToolBig,
  SkynetUserBig,
  SkynetPowerBig,
  SkynetMonetizationSmall,
  SkynetPersistenceSmall,
  SkynetSpeedSmall,
  SkynetUsageSmall,
  SkynetSiaSmall,
} from "../components/Icons";
import Link from "../components/Link";

const etosCards = [
  {
    Icon: SkynetToolBig,
    title: "Build a better web",
  },
  {
    Icon: SkynetUserBig,
    title: "Fight corporate control<br />of user data",
  },
  {
    Icon: SkynetPowerBig,
    title: "Empower global citizens",
  },
];

const ecosystemCards = [
  {
    Icon: SkynetUsageSmall,
    title: "Easy to use",
    text:
      "Decentralized storage without needing to run a node or wallet. Skynet also includes SDKs for popular programming languages and APIs that integrate seamlessly with your existing apps.",
  },
  {
    Icon: SkynetSpeedSmall,
    title: "Fast",
    text:
      "Skynet's speeds rival centralized providers and surpass all decentralized offerings. A typical Skynet download starts in under 500 ms and can stream at rates as high as 1 Gbps!",
  },
  {
    Icon: SkynetSiaSmall,
    title: "Free to use",
    text:
      "Focus on building, not overhead server costs. When users own their data, developers aren't asked to pay for it.",
  },
  {
    Icon: SkynetMonetizationSmall,
    title: "Monetization",
    text:
      "Profit directly from the success of your skapp. Now you can truly prioritize your users, instead of advertisers.",
  },
  {
    Icon: SkynetPersistenceSmall,
    title: "Persistence",
    text:
      "Your skapp and data stay live, even if corporations pull your access to their resources. You can also use Skynet as a failover site for when centralized providers go down.",
  },
];

const IndexPage = () => {
  return (
    <>
      <Seo title="Decentralized Internet for a Free Future" />

      <Section first={true}>
        <div className="text-center">
          <h1 className="text-4xl desktop:text-6xl text-white">
            Decentralized Internet
            <br />
            for a <span className="text-primary underline-white">Free Future</span>
          </h1>

          <p className="mt-5 font-light text-lg leading-7 text-palette-300">
            <span className="hidden desktop:block">Skynet is a content and application hosting platform bringing</span>
            <span className="hidden desktop:block">decentralized storage to users, creators and app developers.</span>
            <span className="desktop:hidden text-justify text-sm">
              Skynet is a content and application hosting platform bringing decentralized storage to users, creators and
              app developers.
            </span>
          </p>
        </div>
      </Section>

      <Section marginTop={false} marginBottom={false} className="relative">
        <div className="absolute inset-x-0 bg-white bottom-0" style={{ top: "176px" }}></div>
        <Uploader />
      </Section>

      <Section className="bg-white">
        <SectionTitle className="text-center mb-11">The new decentralized internet is here</SectionTitle>

        <div className="hidden desktop:grid gap-8 grid-cols-3">
          {etosCards.map((card, index) => (
            <CardWithTitle key={index} {...card} />
          ))}
        </div>

        <div className="desktop:hidden">
          <Carousel Component={CardWithTitle} items={etosCards} />
        </div>

        <div className="flex flex-col items-center mt-16">
          <p className="max-w-screen-md text-center text-base font-content text-palette-400">
            Skynet apps pave the way for a new web that priorities the privacy, security, and experience of users. Join
            our decentralized ecosystem and revolution.
          </p>

          <Link
            href="https://skapp.hns.siasky.net/"
            className="mt-6 uppercase flex items-center text-xs text-palette-600 hover:text-primary transition-colors duration-200"
          >
            Try Skynet Apps <ArrowRight className="fill-current" />
          </Link>
        </div>
      </Section>

      <Section className="bg-palette-100">
        <SectionTitle className="mb-7 desktop:hidden">Ready to build your application?</SectionTitle>

        <div className="hidden desktop:grid gap-x-8 gap-y-16 grid-cols-3">
          <div className="hidden desktop:inline-block">
            <SectionTitle>Ready to build your application?</SectionTitle>

            <Link
              href="https://support.siasky.net/the-technology/developing-on-skynet"
              className="button-secondary-dark inline-block px-10 mt-7"
            >
              Learn more
            </Link>
          </div>

          {ecosystemCards.map((card, index) => (
            <CardWithDescription key={index} {...card} />
          ))}
        </div>

        <div className="desktop:hidden">
          <Carousel Component={CardWithDescription} items={ecosystemCards} />
        </div>

        <div className="desktop:hidden mt-12 text-center">
          <Link
            href="https://support.siasky.net/the-technology/developing-on-skynet"
            className="button-secondary-dark inline-block px-10 mt-7"
          >
            Learn more
          </Link>
        </div>
      </Section>

      <Section className="bg-primary">
        <CommunitySection />
      </Section>
    </>
  );
};

export default IndexPage;
