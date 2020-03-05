import React, { useMemo } from "react";
import PropTypes from "prop-types";
import SEO from "../components/seo";
import { App } from "../components";
import "../global.scss";
import AppContext from "../AppContext";

export default function IndexPage({ location }) {
  const context = useMemo(
    () => ({
      apiUrl: process.env.GATSBY_API_URL || location.origin
    }),
    [location.origin]
  );

  return (
    <AppContext.Provider value={context}>
      <SEO />
      <App />
    </AppContext.Provider>
  );
}

IndexPage.propTypes = {
  location: PropTypes.object.isRequired
};
