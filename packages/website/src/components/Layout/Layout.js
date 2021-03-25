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
import Navigation from "../Navigation/Navigation";
import NewsHeader from "../NewsHeader/NewsHeader";
import Footer from "../Footer/Footer";
import FooterNavigation from "../FooterNavigation/FooterNavigation";
import { useWindowScroll } from "react-use";
import classnames from "classnames";
import { readableColor } from "polished";

const modeMap = { "#fff": "dark", "#000": "light" };

const StickyHeader = () => {
  useWindowScroll();

  const ref = React.useRef(null);
  const element = document.elementFromPoint(0, ref.current?.offsetHeight ?? 0);

  const backgroundColor = window.getComputedStyle(element, null).getPropertyValue("background-color");
  const color = React.useMemo(() => readableColor(backgroundColor), [backgroundColor]);
  const mode = modeMap[color];

  return (
    <div ref={ref} className={classnames("sticky top-0 z-50", { "bg-white border-b border-palette-200": false })}>
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
