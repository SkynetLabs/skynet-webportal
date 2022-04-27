import * as React from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import { Metadata } from "../components/Metadata";
import HighlightedLink from "../components/HighlightedLink";

const NotFoundPage = () => {
  return (
    <div>
      <Metadata>
        <title>Not found</title>
      </Metadata>
      <section className="mt-12">
        <h1>Oops! 😔</h1>
        <p>Whatever you're looking for is not here.</p>
        <p>
          Would you like to <HighlightedLink to="/">go back to homepage</HighlightedLink>?
        </p>
      </section>
    </div>
  );
};

NotFoundPage.Layout = DashboardLayout;

export default NotFoundPage;
