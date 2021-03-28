import * as React from "react";
import Layout, { Section, SectionTitle } from "../components/Layout";
import SEO from "../components/seo";
const NewsPage = () => (
  <Layout>
    <SEO title="News" />

    <Section className="bg-white">
      <SectionTitle className="text-center py-48">News section coming soon!</SectionTitle>
    </Section>
  </Layout>
);

export default NewsPage;
