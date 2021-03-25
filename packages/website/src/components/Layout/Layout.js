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
// import { useWindowScroll } from "react-use";
import classnames from "classnames";

const StickyHeader = () => {
  // const { y } = useWindowScroll();

  return (
    <div className={classnames("sticky top-0", { "bg-white border-b border-palette-200": false })}>
      <NewsHeader />
      <Navigation mode={false ? "light" : "dark"} />
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
