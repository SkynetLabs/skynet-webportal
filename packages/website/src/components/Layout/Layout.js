/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import * as React from "react";
import PropTypes from "prop-types";
import { useStaticQuery, graphql } from "gatsby";
import { getImage } from "gatsby-plugin-image";
import { convertToBgImage } from "gbimage-bridge";
import BackgroundImage from "gatsby-background-image";
import Navigation from "../Navigation";
import NewsHeader from "../NewsHeader";
import Footer from "../Footer";
import FooterNavigation from "../FooterNavigation";
import { useWindowScroll } from "react-use";
import { readableColor } from "polished";

const StickyHeader = () => {
  const { y } = useWindowScroll();
  const ref = React.useRef(null);
  const [mode, setMode] = React.useState();

  React.useLayoutEffect(() => {
    const element = document.elementFromPoint(0, ref.current.offsetHeight);
    const backgroundColor = window.getComputedStyle(element, null).getPropertyValue("background-color");
    const color = readableColor(backgroundColor); // returns either #fff or #000
    const mode = { "#fff": "dark", "#000": "light" }[color];

    setMode(mode);
  }, [setMode, y]);

  return (
    <div ref={ref} className="sticky top-0 z-50">
      <NewsHeader />
      <Navigation mode={mode} />
    </div>
  );
};

const Layout = ({ children }) => {
  // const data = useStaticQuery(graphql`
  //   query SiteTitleQuery {
  //     site {
  //       siteMetadata {
  //         title
  //       }
  //     }
  //   }
  // `);

  const { ripple } = useStaticQuery(graphql`
    query {
      ripple: file(relativePath: { eq: "ripple.png" }) {
        childImageSharp {
          gatsbyImageData(layout: FULL_WIDTH)
        }
      }
    }
  `);
  const background = convertToBgImage(getImage(ripple));

  return (
    <>
      <BackgroundImage
        {...background}
        className="bg-palette-600"
        style={{ backgroundPosition: "center top", backgroundSize: "contain" }}
      >
        <StickyHeader />
        <main>{children}</main>
      </BackgroundImage>
      <FooterNavigation />
      <Footer />
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
