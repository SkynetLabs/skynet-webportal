/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/browser-apis/
 */

import "normalize.css";
import "@fontsource/sora/300.css"; // light
import "@fontsource/sora/400.css"; // normal
import "@fontsource/sora/500.css"; // medium
import "@fontsource/sora/600.css"; // semibold
import "@fontsource/source-sans-pro/400.css"; // normal
import "@fontsource/source-sans-pro/600.css"; // semibold
import "./src/styles/global.css";

import * as React from "react";
import Layout from "./src/components/Layout";

export const wrapPageElement = ({ element, props }) => {
  // props provide same data to Layout as Page element will get
  // including location, data, etc - you don't need to pass it
  return <Layout {...props}>{element}</Layout>;
};
