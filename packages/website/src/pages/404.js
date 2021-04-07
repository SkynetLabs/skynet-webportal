import * as React from "react";
import { Link } from "gatsby";
import { Section, SectionTitle } from "../components/Layout";
import Seo from "../components/seo";

const NotFoundPage = () => (
  <>
    <Seo title="404: Not found" />

    <Section className="bg-white text-center">
      <div className="space-y-8 py-40">
        <SectionTitle>404: Not Found</SectionTitle>

        <Link to="/" className="inline-block text-primary text-xs">
          back to homepage
        </Link>
      </div>
    </Section>
  </>
);

export default NotFoundPage;
