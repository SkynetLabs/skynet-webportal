import * as React from "react";
import { Section } from "../components/Layout";
import Seo from "../components/seo";
import CommunitySection from "../components/CommunitySection";
import Uploader from "../components/Uploader";

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
            <span className="hidden desktop:block">
              Skynet is a hosting platform that makes it easy to join the decentralized
            </span>
            <span className="hidden desktop:block">internet movement. Create your account today.</span>
            <span className="desktop:hidden text-justify text-sm">
              Skynet is a hosting platform that makes it easy to join the decentralized internet movement. Create your
              account today.
            </span>
          </p>
        </div>
      </Section>

      <Section marginTop={false} marginBottom={false} className="relative">
        <div className="absolute inset-x-0 bg-white bottom-0" style={{ top: "176px" }}></div>
        <Uploader />
      </Section>

      <Section className="bg-white">
        <CommunitySection />
      </Section>
    </>
  );
};

export default IndexPage;
