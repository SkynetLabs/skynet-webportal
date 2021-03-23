import * as React from "react";
import { Link } from "gatsby";

import Layout from "../components/Layout/Layout";
import SEO from "../components/seo";

const SecondPage = () => (
  <Layout>
    <SEO title="Page two" />
    <Link to="/">Go back to the homepage</Link>
  </Layout>
);

export default SecondPage;
