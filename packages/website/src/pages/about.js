import * as React from "react";
import { StaticImage } from "gatsby-plugin-image";
import Layout, { Section, SectionTitle, SectionTitleCaption } from "../components/Layout";
import SEO from "../components/seo";
import {
  ArrowRight,
  Join,
  UserAtom,
  Shield,
  Fingerprint,
  UserArrows,
  ComputerScreen,
  Cogs,
  TwitterSmall,
  GithubSmall,
  GitlabSmall,
  LinkedinSmall,
} from "../components/Icons";

const aboutCards = [
  {
    Icon: UserAtom,
    title: "Own your data",
    text:
      "No one owns or controls your account data except for you. Ownership extends to original blogs, music, and videos too. This is all possible through decentralized apps built on decentralized storage.",
  },
  {
    Icon: Shield,
    title: "Censorship-resistant content",
    text:
      "Today, censorship can come arbitrarily, top-down, and as a tool to silence expression. Post and share content on Skynet, or use Skynet as a fail-over for your website if a service provider goes down.",
  },
  {
    Icon: Fingerprint,
    title: "One universal digital identity",
    text:
      "Log into any Skynet app with just one ID. Once logged in, your storage and data can follow you across the ecosystem. Access your friend lists, followers, and content from any Skynet app.",
  },
  {
    Icon: UserArrows,
    title: "Innovation built for users",
    text:
      "All Skynet apps are open-source. If you dislike an app’s feature or want to make your own improvements, you’re welcome to do so. (We of course encourage collaboration and hope you chat with the developer first!) Existing users can then consent to the migration of all their account data to the latest version. ",
  },
  {
    Icon: ComputerScreen,
    label: "Coming soon",
    title: "Control your content feed",
    text:
      "We believe that users, not tech platforms should fully control how content is moderated. A decentralized internet is not an information free-for-all. It means that the individual holds the power to personalize their online experiences. For example, users will decide what content appears in their social media feeds, not a corporate algorithm.",
  },
  {
    Icon: Cogs,
    label: "Coming soon",
    title: "Developer and Creator-centric monetization",
    text:
      "As a content creator, set your own terms and price for your art. You and your collaborators can get paid directly, fairly, and automatically in crypto without relying on advertising as a sole source of income.",
  },
];

const teamCards = [
  {
    name: "David Vorick",
    position: "CEO and Lead Developer",
    Image: <StaticImage src="../images/team/david-vorick.png" alt="David Vorick" />,
    social: {
      github: "https://github.com/DavidVorick",
      gitlab: "https://gitlab.com/DavidVorick",
      twitter: "https://twitter.com/davidvorick",
    },
  },
  {
    name: "Chris Schinnerl",
    position: "VP of Technology",
    Image: <StaticImage src="../images/team/chris-schinnerl.png" alt="Chris Schinnerl" />,
    social: {
      github: "https://github.com/ChrisSchinnerl",
      gitlab: "https://gitlab.com/ChrisSchinnerl",
      twitter: "https://twitter.com/ChrisSchinnerl",
    },
  },
  {
    name: "Steve Funk",
    position: "Head of Support",
    Image: <StaticImage src="../images/team/steve-funk.png" alt="Steve Funk" />,
    social: {
      linkedin: "https://www.linkedin.com/in/stevengfunk",
    },
  },
  {
    name: "Matt Sevey",
    position: "Engineering Manager",
    Image: <StaticImage src="../images/team/matt-sevey.png" alt="Matt Sevey" />,
    social: {
      github: "https://github.com/MSevey",
      gitlab: "https://gitlab.com/MSevey",
      linkedin: "https://www.linkedin.com/in/sevey",
      twitter: "https://twitter.com/MJSevey",
    },
  },
  {
    name: "Manasi Vora",
    position: "VP of Strategy and Ops",
    Image: <StaticImage src="../images/team/manasi-vora.png" alt="Manasi Vora" />,
    social: {
      linkedin: "https://linkedin.com/in/manasi-vora-cfa-bb9a1715",
      twitter: "https://twitter.com/manasilvora",
    },
  },
  {
    name: "PJ Brone",
    position: "Core Developer",
    Image: <StaticImage src="../images/team/pj-brone.png" alt="PJ Brone" />,
    social: {
      github: "https://github.com/peterjan",
      gitlab: "https://gitlab.com/pjbrone",
      linkedin: "https://www.linkedin.com/in/peterjanbrone",
      twitter: "https://twitter.com/peterjanbrone",
    },
  },
  {
    name: "Marcin Swieczkowski",
    position: "Core Developer",
    Image: <StaticImage src="../images/team/marcin-swieczkowski.png" alt="Marcin Swieczkowski" />,
    social: {
      github: "https://github.com/m-cat",
      gitlab: "https://gitlab.com/m-cat",
    },
  },
  {
    name: "Karol Wypchlo",
    position: "Full Stack Developer",
    Image: <StaticImage src="../images/team/karol-wypchlo.png" alt="Karol Wypchlo" />,
    social: {
      github: "https://github.com/kwypchlo",
      gitlab: "https://gitlab.com/kwypchlo",
      linkedin: "https://www.linkedin.com/in/karolwypchlo/",
      twitter: "https://twitter.com/kwypchlo",
    },
  },
  {
    name: "Ivaylo Novakov",
    position: "Core Developer",
    Image: <StaticImage src="../images/team/ivaylo-novakov.png" alt="Ivaylo Novakov" />,
    social: {
      github: "https://github.com/ro-tex",
      gitlab: "https://gitlab.com/kwypchlo",
      linkedin: "https://www.linkedin.com/in/karolwypchlo/",
      twitter: "https://twitter.com/kwypchlo",
    },
  },
  {
    name: "Filip Rysavy",
    position: "Testing Developer",
    Image: <StaticImage src="../images/team/filip-rysavy.png" alt="Filip Rysavy" />,
    social: {
      linkedin: "https://www.linkedin.com/in/filiprysavy/",
    },
  },
  {
    name: "Nicole Tay",
    position: "Head of Marketing",
    Image: <StaticImage src="../images/team/nicole-tay.png" alt="Nicole Tay" />,
    social: {},
  },
  {
    name: "Daniel Helm",
    position: "Developer Evangelist",
    Image: <StaticImage src="../images/team/daniel-helm.png" alt="Daniel Helm" />,
    social: {},
  },
];

const Label = ({ children }) => (
  <span className="inline-flex items-center px-3 leading-5 rounded-full text-xxs bg-palette-200 text-palette-600 lowercase">
    {children}
  </span>
);

const EcosystemCard = ({ Icon, label, title, text }) => (
  <div className="flex flex-col">
    <div className="flex items-center space-x-4">
      <Icon />
      {label && <Label>{label}</Label>}
    </div>
    <h3 className="font-light text-lg mt-6">{title}</h3>
    <p className="text-palette-400 font-content mt-6">{text}</p>
  </div>
);

const SocialIcon = ({ name }) => {
  switch (name) {
    case "twitter":
      return <TwitterSmall />;
    case "linkedin":
      return <LinkedinSmall />;
    case "github":
      return <GithubSmall />;
    case "gitlab":
      return <GitlabSmall />;
    default:
      throw new Error(`Cannot find an icon for "${name}"`);
  }
};

const TeamCard = ({ Image, name, position, social }) => (
  <div className="flex">
    {Image}
    <div className="flex flex-col justify-between ml-3">
      <div className="flex flex-col">
        <span className="font-light text-lg">{name}</span>
        <span className="text-palette-400 text-xs">{position}</span>
      </div>
      {social && (
        <div className="flex flex-row">
          {Object.entries(social).map(([platform, href]) => (
            <a href={href} title={platform}>
              <SocialIcon name={platform} />
            </a>
          ))}
        </div>
      )}
    </div>
  </div>
);

const AboutPage = () => (
  <Layout>
    <SEO title="About" />
    <Section className="bg-palette-100">
      <div className="grid grid-cols-1 gap-x-16 gap-y-16 desktop:grid-cols-3">
        <div className="col-span-3">
          <h1 className="font-semibold text-3xl desktop:text-6xl desktop:leading-16">
            Skynet is the foundation for a new, <span className="underline text-primary">decentralized internet</span>
          </h1>
        </div>

        <div className="col-span-3 desktop:col-start-2 desktop:col-span-2 space-y-12">
          <p className="text-palette-600 font-light text-lg">
            Skynet is an open protocol and toolkit for creating a better web-one built on decentralized storage and
            applications.
          </p>

          <p className="font-content text-palette-400">
            Skynet apps transform what’s possible on the web. Beyond protecting privacy, decentralization enables
            application, integration, and innovation that simply cannot be replicated by the centralized world. Now, we
            can break free of the walled gardens and data silos that have constricted invention and interoperability.
            Key features of decentralization such as user-owned personal data, persistent identity across apps, and
            censorship-resistance will be the new standards of the digital world.
          </p>

          <a href="/" className="uppercase inline-flex items-center text-xs text-palette-600">
            Learn more about how our technology works <ArrowRight />
          </a>
        </div>
      </div>
    </Section>

    <Section className="bg-white">
      <div className="grid grid-cols-1 gap-x-16 gap-y-16 desktop:grid-cols-3 my-20">
        <div className="desktop:col-span-2">
          <SectionTitle>What does the decentralized future look like?</SectionTitle>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-x-16 gap-y-16 desktop:grid-cols-2">
        {aboutCards.map((card, index) => (
          <EcosystemCard key={index} {...card} />
        ))}
      </div>

      <div className="mt-14 text-center space-y-6">
        <p className="font-light text-lg text-palette-600">Want to build apps with these features?</p>
        <a
          href="https://secure.siasky.net"
          className="inline-block border-2 border-palette-600 text-palette-600 px-10 leading-10 rounded-full text-xs uppercase text-center"
        >
          Get started here
        </a>
      </div>
    </Section>

    <Section className="bg-palette-600">
      <SectionTitle className="text-white my-20">
        Skynet Labs builds uncompromising software infrastructure for the{" "}
        <span className="underline text-primary">decentralized internet</span>
      </SectionTitle>

      <div className="grid grid-cols-1 gap-x-16 gap-y-16 desktop:grid-cols-3">
        <div className="col-span-3 desktop:col-start-2 desktop:col-span-2 space-y-12">
          <p className="text-white font-light text-lg">
            Skynet is an open protocol and toolkit for creating a better web-one built on decentralized storage and
            applications.
          </p>

          <p className="font-content text-palette-300">
            Skynet apps transform what’s possible on the web. Beyond protecting privacy, decentralization enables
            application, integration, and innovation that simply cannot be replicated by the centralized world. Now, we
            can break free of the walled gardens and data silos that have constricted invention and interoperability.
            Key features of decentralization such as user-owned personal data, persistent identity across apps, and
            censorship-resistance will be the new standards of the digital world.
          </p>

          <h3 className="text-lg desktop:text-3xl font-semibold text-white">
            Decentralization isn’t just what we do, <span className="underline text-primary">it’s how we do it</span>
          </h3>

          <p className="font-content text-palette-300">
            Our commitment to decentralization is at our core. With this ethos in mind, we believe in empowering local
            leaders to decide what is best for their communities in adoption of this technology. Individuals and
            communities deserve self-determination.
          </p>
        </div>
      </div>
    </Section>

    <Section className="bg-white">
      <div className="grid grid-cols-1 gap-x-16 gap-y-16 desktop:grid-cols-3 my-20">
        <div className="desktop:col-span-2">
          <SectionTitleCaption>Team</SectionTitleCaption>
          <SectionTitle>Skynet stands with you in the fight for a freer future</SectionTitle>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-16 desktop:grid-cols-3">
        {teamCards.map((card, index) => (
          <TeamCard key={index} {...card} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-x-16 gap-y-16 desktop:grid-cols-3 my-20">
        <div className="desktop:col-span-2 flex items-center space-x-8">
          <Join className="flex-shrink-0" />
          <p className="font-light text-lg">
            Join us! We're looking for talented &amp; passionate individuals to join our team. Check out our job
            postings today.
          </p>
        </div>
      </div>
    </Section>

    <Section className="bg-palette-100">
      <div className="grid grid-cols-1 gap-x-16 gap-y-16 desktop:grid-cols-3 my-20">
        <div className="desktop:col-span-2">
          <SectionTitleCaption>Investors</SectionTitleCaption>
          <SectionTitle>Support for the Skynet Vision</SectionTitle>
        </div>
      </div>

      <div className="text-center p-10">quotes</div>

      <div className="grid grid-cols-2 gap-4 desktop:grid-cols-4">
        <StaticImage src="../images/investors/investors-logo-1.png" alt="A.Capital Ventures" />
        <StaticImage src="../images/investors/investors-logo-2.png" alt="Bain Capital" />
        <StaticImage src="../images/investors/investors-logo-3.png" alt="Bessemer Venture Partners" />
        <StaticImage src="../images/investors/investors-logo-4.png" alt="Collab" />
        <StaticImage src="../images/investors/investors-logo-5.png" alt="Dragonfly Capital" />
        <StaticImage src="../images/investors/investors-logo-6.png" alt="Fenbushi Capital" />
        <StaticImage src="../images/investors/investors-logo-7.png" alt="First Star Ventures" />
        <StaticImage src="../images/investors/investors-logo-8.png" alt="Hack VC" />
        <StaticImage src="../images/investors/investors-logo-9.png" alt="INBlockchain" />
        <StaticImage src="../images/investors/investors-logo-10.png" alt="Paradigm" />
        <StaticImage src="../images/investors/investors-logo-11.png" alt="SV Angel" />
      </div>
    </Section>
  </Layout>
);

export default AboutPage;
