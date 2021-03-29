import * as React from "react";
import Layout, { Section, SectionTitle, CardWithDescription } from "../components/Layout";
import { ExternalLink, DataSwap, Encryption, Layers, Mesh, Toolkit, DevBig } from "../components/Icons";
import CodeTerminal from "../components/CodeTerminal";
import SEO from "../components/seo";

const LearnMoreButton = () => (
  <a
    href="https://secure.siasky.net"
    className="inline-block border-2 border-palette-600 text-palette-600 px-10 leading-10 rounded-full text-xs uppercase text-center mt-7"
  >
    Learn more
  </a>
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
  { title: "Skynet Developer Guide", description: "Developer portal for resources and guides.", href: "" },
  { title: "Skynet SDK Docs", description: "SDKs in Javascript, Go, Python and more.", href: "" },
  { title: "Skynet Playground", description: "Interact with the core of Skynet, no code needed. ", href: "" },
  { title: "Skapp.io", description: "Explore webs apps in the ecosystem, many open source.", href: "" },
  { title: "Skynet Core Repo", description: "The code base that makes the rest tick.", href: "" },
  {
    title: "Skynet on Github",
    description: "Includes SDKs, resources, and web portal. PR’s always welcome.",
    href: "",
  },
  {
    title: "Join us on Discord",
    description: "A generous developer community, ready to solve hard problems.",
    href: "",
  },
];

const docs = [
  { name: "Developer Guide", href: "" },
  { name: "Skynet SDK Docs", href: "" },
];

const DevelopersPage = () => (
  <Layout>
    <SEO title="Developers" />

    <Section>
      <div className="flex flex-col desktop:flex-row desktop:space-y-0 space-y-12">
        <div className="space-y-12">
          <h1 className="font-semibold text-4xl desktop:text-6xl desktop:leading-16 text-white">
            Decentralized Apps with speed, confidence, and <span className="text-primary underline">usability</span>
          </h1>

          <ul className="space-y-2">
            {docs.map(({ name, href }, index) => (
              <li key={index}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary font-light text-lg inline-flex"
                >
                  {name} <ExternalLink className="fill-current inline-block ml-2" height={28} />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <CodeTerminal />
      </div>
    </Section>

    <Section className="bg-white">
      <SectionTitle className="mb-7 desktop:hidden">Plenty of reason to use Skynet</SectionTitle>

      <div className="grid grid-cols-1 gap-x-8 gap-y-16 desktop:grid-cols-3">
        <div className="hidden desktop:inline-block">
          <SectionTitle>Plenty of reason to use Skynet</SectionTitle>

          <LearnMoreButton />
        </div>

        {reasonCards.map((card, index) => (
          <CardWithDescription key={index} {...card} />
        ))}
      </div>

      <div className="desktop:hidden mt-12 text-center">
        <LearnMoreButton />
      </div>
    </Section>

    <Section className="bg-palette-100">
      <SectionTitle className="text-center">Join a community of builders already using Skynet</SectionTitle>

      <p className="text-center mt-20">cards</p>
    </Section>

    <Section className="bg-white">
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
              <a
                href={href}
                className="block bg-palette-100 px-8 py-5 rounded border-2 border-palette-600 border-opacity-0 hover:border-opacity-100"
              >
                <div className="font-semibold text-lg">{title}</div>
                <div className="font-content text-palette-400">{description}</div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  </Layout>
);

export default DevelopersPage;
