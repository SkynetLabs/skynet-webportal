import * as React from "react";
import { Section, SectionTitle, CardWithDescription } from "../components/Layout";
import { Carousel } from "../components/Carousel/Carousel";
import { ExternalLink, DataSwap, Encryption, Layers, Mesh, Toolkit, DevBig } from "../components/Icons";
import CodeTerminal from "../components/CodeTerminal";
import SEO from "../components/seo";
import Link from "../components/Link";

const LearnMoreButton = () => (
  <Link
    href="https://support.siasky.net/the-technology/developing-on-skynet"
    className="button-secondary-dark inline-block px-10 mt-7"
  >
    Learn more
  </Link>
);

const reasonCards = [
  {
    Icon: DataSwap,
    title: "Immutable Data, Globally Available. Trustless",
    text:
      "Our [IGDL] means data is instantly accessible on any device, by any portal and is fully verifiable, but leveraging trustees decentralize storage on the Sia blockchain.",
  },
  {
    Icon: Encryption,
    title: "Dynamic content with a user-focus",
    text:
      "SkyDB enables complex apps by providing a key-value store for mutable data secured by the private key of the user.",
  },
  {
    Icon: Layers,
    title: "BYO Frontend Library",
    text:
      "Our SDKs are built with web2 developers in mind and client-side web apps and static generators are perfect for using Skynet to deploy with.",
  },
  {
    Icon: Mesh,
    title: "Decentralized Stack-Friendly",
    text:
      "With integrations with HNS, ENS and easy use for off-chain storage, Skynet is positioned to connect with the DWeb and web3 technologies you need.",
  },
  {
    Icon: Toolkit,
    title: "Hack Today & Activate an Existing User base",
    text:
      "Start building without worrying about server overhead or where users will come from. Bootstrap the user experience with interoperable storage that costs you nothing and user-identity right out of the box.",
  },
];

const resources = [
  {
    title: "Skynet Developer Guide",
    description: "Developer portal for resources and guides.",
    href: "https://support.siasky.net/the-technology/developing-on-skynet",
  },
  {
    title: "Skynet SDK Docs",
    description: "SDKs in Javascript, Go, Python and more.",
    href: "https://siasky.net/docs/",
  },
  {
    title: "Skynet AppStore",
    description: "Explore webs apps in the ecosystem, many open source.",
    href: "https://skyapps.hns.siasky.net",
  },
  {
    title: "Skynet Core Repo",
    description: "The code base that makes the rest tick.",
    href: "https://gitlab.com/skynetlabs/skyd",
  },
  {
    title: "Skynet on Github",
    description: "Includes SDKs, resources, and web portal. PR’s always welcome.",
    href: "https://github.com/SkynetHQ",
  },
  {
    title: "Join us on Discord",
    description: "A generous developer community, ready to solve hard problems.",
    href: "https://discordapp.com/invite/sia",
  },
];

const docs = [
  { name: "Developer Guide", href: "https://support.siasky.net/the-technology/developing-on-skynet" },
  { name: "Skynet SDK Docs", href: "https://siasky.net/docs/" },
];

const DevelopersPage = () => (
  <>
    <SEO title="Developers" />

    <Section first={true} width="layout">
      <div className="flex flex-col desktop:flex-row desktop:space-y-0 space-y-12 desktop:space-x-12">
        <div className="space-y-12 desktop:w-1/2 desktop:text-right">
          <h1 className="text-white">
            Decentralized Apps with speed, confidence, and <span className="text-primary underline">usability</span>
          </h1>

          <ul className="space-y-2">
            {docs.map(({ name, href }, index) => (
              <li key={index}>
                <Link
                  href={href}
                  className="text-primary font-light text-lg inline-flex hover:text-primary-light transition-colors duration-200"
                >
                  {name} <ExternalLink className="fill-current inline-block ml-2" height={28} />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="desktop:w-1/2">
          <CodeTerminal />
        </div>
      </div>
    </Section>

    <Section className="bg-palette-100">
      <SectionTitle className="mb-7 desktop:hidden">Plenty of reason to use Skynet</SectionTitle>

      <div className="hidden desktop:grid gap-x-8 gap-y-16 grid-cols-3">
        <div className="hidden desktop:inline-block">
          <SectionTitle>Plenty of reason to use Skynet</SectionTitle>

          <LearnMoreButton />
        </div>

        {reasonCards.map((card, index) => (
          <CardWithDescription key={index} {...card} />
        ))}
      </div>

      <div className="desktop:hidden">
        <Carousel Component={CardWithDescription} items={reasonCards} />
      </div>

      <div className="desktop:hidden mt-12 text-center">
        <LearnMoreButton />
      </div>
    </Section>

    {/* <Section className="bg-palette-100">
      <SectionTitle className="text-center mb-20">Join a community of builders already using Skynet</SectionTitle>

      <p className="text-center">cards</p>
    </Section> */}

    <Section className="bg-white">
      <SectionTitle className="text-center mb-20">Join a community of builders already using Skynet</SectionTitle>

      <div className="grid grid-cols-1 gap-x-32 gap-y-10 desktop:grid-cols-3">
        <div className="space-y-8">
          <DevBig width="170" viewBox="90 0 170 142" />

          <SectionTitle>Start building with Skynet</SectionTitle>

          <p className="font-light text-lg">
            Whether hosting your front-end or building a full-scale web app, start here.
          </p>
        </div>

        <ul className="col-span-2 space-y-1">
          {resources.map(({ href, title, description }, index) => (
            <li key={index}>
              <Link
                href={href}
                className="block bg-palette-100 px-8 py-5 rounded border-2 border-transparent hover:border-palette-600 transition-colors duration-200"
              >
                <div className="font-semibold text-lg">{title}</div>
                <div className="font-content text-palette-400">{description}</div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  </>
);

export default DevelopersPage;
