import * as React from "react";
import { Link } from "gatsby";
import Layout, { Section, SectionTitle } from "../components/Layout";
import SEO from "../components/seo";

const NotFoundPage = () => (
  <Layout>
    <SEO title="404: Not found" />

    <Section className="bg-white text-center">
      <div className="space-y-8 py-40">
        <SectionTitle>404: Not Found</SectionTitle>

        <Link to="/" className="inline-block text-primary text-xs">
          back to homepage
        </Link>
      </div>
    </Section>
  </Layout>
);

export default NotFoundPage;
