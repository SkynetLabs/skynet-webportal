import React from "react";
import PropTypes from "prop-types";
import SEO from "../components/seo";
import { App } from "../components";
import "../global.scss";
import LocationContext from "../LocationContext";

export default function IndexPage({ location }) {
  return (
    <LocationContext.Provider value={location}>
      <SEO />
      <App />
    </LocationContext.Provider>
  );
}

IndexPage.propTypes = {
  location: PropTypes.object.isRequired
};
