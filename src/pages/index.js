import React from "react";
import SEO from "../components/seo";
import { App } from "../components";
import "../global.scss";
import LocationContext from "../LocationContext";

const IndexPage = ({ location }) => (
  <LocationContext.Provider value={location}>
    <SEO />
    <App />
  </LocationContext.Provider>
);

export default IndexPage;
