import * as React from "react";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import { Section, SectionTitle, SectionTitleCaption, CardWithDescription } from "../components/Layout";
import { Carousel } from "../components/Carousel/Carousel";
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
import Link from "../components/Link";
import { graphql } from "gatsby";

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

const careers = { href: "https://jobs.lever.co/nebulous", target: "_blank", rel: "noopener noreferrer" };

const paginate = (array, size) =>
  array.reduce((acc, item, index) => {
    const chunkIndex = Math.floor(index / size);
    if (!acc[chunkIndex]) acc[chunkIndex] = { cards: [] }; // start a new chunk
    acc[chunkIndex].cards.push(item);
    return acc;
  }, []);

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

const TeamCard = ({ image, name, position, social }) => (
  <div className="flex">
    <GatsbyImage image={getImage(image)} alt={name} />
    <div className="flex flex-col justify-between ml-3">
      <div className="flex flex-col">
        <span className="font-light text-lg">{name}</span>
        <span className="text-palette-400 text-xs">{position}</span>
      </div>
      {social && (
        <div className="flex flex-row">
          {Object.entries(social)
            .filter(([platform, href]) => href)
            .map(([platform, href]) => (
              <Link key={platform} href={href} title={platform}>
                <SocialIcon name={platform} />
              </Link>
            ))}
        </div>
      )}
    </div>
  </div>
);

const TeamCardPage = ({ cards }) => (
  <div className="flex flex-col space-y-16">
    {cards.map((card, index) => (
      <TeamCard key={index} {...card} />
    ))}
  </div>
);

const AboutPage = ({ ...props }) => {
  const investors = props.data.allInvestorsYaml.nodes;
  const teamCards = props.data.allTeamYaml.nodes;
  const teamCardsPaginated = paginate(teamCards, 3);

  return (
    <>
      <SEO title="About" />

      <Section className="bg-palette-100" marginBottom={true} first={true}>
        <div className="grid grid-cols-1 gap-x-16 gap-y-16 desktop:grid-cols-3">
          <div className="col-span-3">
            <h1>
              Skynet is the foundation for a new,{" "}
              <span className="text-primary underline-dark">decentralized internet</span>
            </h1>
          </div>

          <div className="col-span-3 desktop:col-start-2 desktop:col-span-2 space-y-12">
            <p className="text-palette-600 font-light text-lg">
              Skynet is an open protocol and toolkit for creating a better web — one built on decentralized storage and
              applications.
            </p>

            <p className="font-content text-palette-400">
              Skynet apps transform what’s possible on the web. Beyond protecting privacy, decentralization enables
              application, integration, and innovation that simply cannot be replicated by the centralized world. Now,
              we can break free of the walled gardens and data silos that have constricted invention and
              interoperability. Key features of decentralization such as user-owned personal data, persistent identity
              across apps, and censorship-resistance will be the new standards of the digital world.
            </p>

            <Link
              href="https://support.siasky.net"
              className="hidden sm:inline-flex items-center text-xs text-palette-600 uppercase hover:text-primary transition-colors duration-200"
            >
              Learn more about how our technology works <ArrowRight className="fill-current" />
            </Link>

            <Link
              href="https://support.siasky.net"
              className="inline-flex sm:hidden flex-col text-xs text-palette-600 uppercase"
            >
              Learn more about how our{" "}
              <span className="inline-flex items-center">
                technology works <ArrowRight />
              </span>
            </Link>
          </div>
        </div>
      </Section>

      <Section className="bg-palette-100 desktop:bg-white">
        <div className="space-y-8">
          <SectionTitle>What does the decentralized future look like?</SectionTitle>

          <div>
            <div className="hidden desktop:grid gap-x-16 gap-y-16 grid-cols-2">
              {aboutCards.map((card, index) => (
                <CardWithDescription key={index} {...card} />
              ))}
            </div>

            <div className="desktop:hidden">
              <Carousel Component={CardWithDescription} items={aboutCards} />
            </div>

            <div className="mt-14 text-center space-y-6">
              <p className="font-light text-lg text-palette-600">Want to build apps with these features?</p>
              <Link to="/developers" className="button-secondary-dark inline-block px-10">
                Get started here
              </Link>
            </div>
          </div>
        </div>
      </Section>

      <Section className="background bg-top bg-cover">
        <SectionTitle className="text-white">
          Skynet Labs builds uncompromising software infrastructure for the{" "}
          <span className="text-primary underline-white">decentralized internet</span>
        </SectionTitle>

        <div className="grid grid-cols-1 gap-x-16 gap-y-16 desktop:grid-cols-3 mt-10">
          <div
            className="hidden desktop:block"
            style={{ background: "url(/logo-symbol.svg) no-repeat left center / contain" }}
          ></div>

          <div className="col-span-3 desktop:col-start-2 desktop:col-span-2 space-y-12">
            <p className="text-white font-light text-lg">
              Skynet is an open protocol and toolkit for creating a better web — one built on decentralized storage and
              applications.
            </p>

            <p className="font-content text-palette-300">
              Skynet apps transform what’s possible on the web. Beyond protecting privacy, decentralization enables
              application, integration, and innovation that simply cannot be replicated by the centralized world. Now,
              we can break free of the walled gardens and data silos that have constricted invention and
              interoperability. Key features of decentralization such as user-owned personal data, persistent identity
              across apps, and censorship-resistance will be the new standards of the digital world.
            </p>

            <h3 className="text-lg desktop:text-3xl font-semibold text-white">
              Decentralization isn’t just what we do,
              <br />
              <span className="text-primary">it’s how we do it</span>
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
        <div className="space-y-10 desktop:space-y-20 flex flex-col">
          <div>
            <SectionTitleCaption>Team</SectionTitleCaption>
            <SectionTitle>Skynet stands with you in the fight for a freer future</SectionTitle>
          </div>

          <div className="hidden desktop:grid gap-y-8 gap-16 grid-cols-3">
            {teamCards.map((card, index) => (
              <TeamCard key={index} {...card} />
            ))}
          </div>

          <div className="desktop:hidden">
            <Carousel Component={TeamCardPage} items={teamCardsPaginated} fullWidth={true} />
          </div>

          <div className="desktop:col-span-2 flex flex-col desktop:flex-row items-center desktop:space-x-8 space-y-8 desktop:space-y-0 hidden">
            <Link className="flex-shrink-0 hidden desktop:inline-block" {...careers}>
              <Join />
            </Link>
            <p className="font-light text-lg text-center desktop:text-left">
              Join us! We're looking for talented &amp; passionate individuals to join our team. Check out our job
              postings today.
            </p>
            <Link className="flex-shrink-0 desktop:hidden" {...careers}>
              <Join />
            </Link>
          </div>
        </div>
      </Section>

      <Section className="bg-palette-100">
        <SectionTitleCaption>Investors</SectionTitleCaption>
        <SectionTitle>Support for the Skynet Vision</SectionTitle>

        <div className="grid grid-cols-2 gap-4 desktop:grid-cols-4 mt-20">
          {investors.map(({ name, image }) => (
            <GatsbyImage key={name} image={getImage(image)} alt={name} />
          ))}
        </div>
      </Section>
    </>
  );
};

export const query = graphql`
  query MyQuery {
    allTeamYaml {
      nodes {
        name
        position
        social {
          github
          gitlab
          linkedin
          twitter
        }
        image {
          childImageSharp {
            gatsbyImageData(width: 80, placeholder: BLURRED, formats: [AUTO, WEBP, AVIF])
          }
        }
      }
    }
    allInvestorsYaml {
      nodes {
        name
        image {
          childImageSharp {
            gatsbyImageData(width: 320, placeholder: BLURRED, formats: [AUTO, WEBP, AVIF])
          }
        }
      }
    }
  }
`;

export default AboutPage;
