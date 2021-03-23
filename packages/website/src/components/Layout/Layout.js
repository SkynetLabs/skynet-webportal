/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import * as React from "react";
import PropTypes from "prop-types";
import { useStaticQuery, graphql } from "gatsby";
import BackgroundImage from "gatsby-background-image";
import Navigation from "../Navigation/Navigation";
import NewsHeader from "../NewsHeader/NewsHeader";
import Footer from "../Footer/Footer";
import FooterNavigation from "../FooterNavigation/FooterNavigation";

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

  const data = useStaticQuery(graphql`
    query {
      ripple: file(relativePath: { eq: "ripple.png" }) {
        childImageSharp {
          fluid(maxWidth: 1440) {
            ...GatsbyImageSharpFluid
          }
        }
      }
    }
  `);

  return (
    <>
      <NewsHeader />
      <BackgroundImage fluid={data.ripple.childImageSharp.fluid} className="bg-palette-600">
        <Navigation mode="dark" />

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
