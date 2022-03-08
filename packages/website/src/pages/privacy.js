import * as React from "react";
import { DomainName } from "../components/DomainName";
import { Section } from "../components/Layout";
import Seo from "../components/seo";

const P = ({ className, ...props }) => <p className={`my-4 leading-relaxed ${className}`} {...props} />;

const PrivacyPolicyPage = () => (
  <>
    <Seo title="Privacy Policy" />

    <Section first={true} className="bg-white">
      <h1 className="capitalize">
        <DomainName /> Privacy Policy
      </h1>
      <P className="text-palette-300">Last Updated: February 19, 2021</P>
      <P>
        We are committed to protecting your privacy. That is because we base our business on trust you place in us. This
        policy describes our practices regarding personal and account information collected through our website.
      </P>
      <P>
        We will periodically review the appropriateness of this privacy policy and may make, in our discretion, such
        changes as are necessary. If we decide to change this privacy policy, we will post those changes here so that
        you will always know what information we gather, how we might use that information, and whether we will disclose
        it to anyone. You should visit our web site periodically to review any changes.
      </P>
      <h2>Can Nebulous access uploaded data?</h2>
      <P>
        Yes – Skynet is designed as a publishing platform, so files are unencrypted by default. While we will not
        analyze or look at files stored via the <DomainName />, we (and anyone else) have the capability to view any
        file uploaded to Skynet.
      </P>
      <h2>What if I want to encrypt my files?</h2>
      <P>
        If you want to encrypt your files to ensure privacy, you should do so before uploading to
        <DomainName />.
      </P>
      <P>
        We plan to add future support for encryption groups, which would allow you to create your own encryption groups
        and publish files on Skynet that can only be accessed within that group.
      </P>
      <h2>What personal information do we collect?</h2>
      <P>
        The amount and type of personal and account information we collect from you depends on your activities and use
        of our website. Below, we explain what information we collect under specific contexts.
      </P>
      <h2>What measures do we use to protect your personal information?</h2>
      <ul className="list-inside list-disc indent-6">
        <li className="my-2">We use secure, encrypted mechanisms (SSL) when accepting and transmitting information.</li>
        <li className="my-2">We regularly perform security audits and updates on our servers</li>
      </ul>
      <h2>When you browse our website we can see:</h2>
      <ul className="list-inside list-disc indent-6">
        <li className="my-2">
          <strong>IP address</strong> – We see your IP address to measure our web site traffic and to help prevent
          malicious use.
        </li>
        <li className="my-2">
          <strong>Referral website</strong> – If you come to our web site via a link, we see the location of the link
          that referred you.
        </li>
        <li className="my-2">
          <strong>Browser and platform</strong> – We see information about the browser you are using to help optimize
          our web site for visitors.
        </li>
      </ul>
    </Section>
  </>
);

export default PrivacyPolicyPage;
