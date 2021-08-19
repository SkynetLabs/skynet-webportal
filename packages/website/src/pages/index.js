import * as React from "react";
import { graphql } from "gatsby";
import { Section, SectionTitle, CardWithDescription, CardWithTitle } from "../components/Layout";
import { Carousel } from "../components/Carousel/Carousel";
import Seo from "../components/seo";
import CommunitySection from "../components/CommunitySection";
import Uploader from "../components/Uploader";
import { ArrowRight } from "../components/Icons";
import Link from "../components/Link";

const IndexPage = ({ data }) => {
  const etosCards = React.useMemo(
    () =>
      data.allPagesIndexYaml.edges[0].node.etosCards.map((card) => ({
        ...card,
        src: card.src.publicURL,
      })),
    [data]
  );
  const ecosystemCards = React.useMemo(
    () =>
      data.allPagesIndexYaml.edges[1].node.ecosystemCards.map((card) => ({
        ...card,
        src: card.src.publicURL,
      })),
    [data]
  );

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
            <span className="hidden desktop:block">
              Skynet is a hosting platform that makes it easy to join the decentralized
            </span>
            <span className="hidden desktop:block">internet movement. Start your free account today.</span>
            <span className="desktop:hidden text-justify text-sm">
              Skynet is a hosting platform that makes it easy to join the decentralized internet movement. Start your
              free account today.
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
            Skynet apps pave the way for a new web that prioritizes the privacy, security, and experience of users. Join
            our decentralized internet ecosystem and revolution.
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
              href="https://docs.siasky.net"
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
            href="https://docs.siasky.net"
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

export const query = graphql`
  query MainPageQuery {
    allPagesIndexYaml {
      edges {
        node {
          etosCards {
            title
            alt
            src {
              publicURL
            }
          }
          ecosystemCards {
            title
            alt
            text
            src {
              publicURL
            }
          }
        }
      }
    }
  }
`;

export default IndexPage;
