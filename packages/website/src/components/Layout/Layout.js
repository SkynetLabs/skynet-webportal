/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import * as React from "react";
import PropTypes from "prop-types";
import Navigation from "../Navigation";
import NewsHeader from "../NewsHeader";
import Footer from "../Footer";
import FooterNavigation from "../FooterNavigation";
import { useWindowScroll } from "react-use";
import { readableColor } from "polished";

const FixedHeader = () => {
  const { y } = useWindowScroll();
  const ref = React.useRef(null);
  const [mode, setMode] = React.useState();

  React.useLayoutEffect(() => {
    const offset = ref.current.offsetHeight;
    const element = document.elementFromPoint(0, offset);
    const backgroundColor = window.getComputedStyle(element, null).getPropertyValue("background-color");
    const color = readableColor(backgroundColor); // returns either #fff or #000
    const calculated = { "#fff": "dark", "#000": "light" }[color];

    if (mode !== calculated) {
      setMode(calculated);
    }
  }, [setMode, mode, y]);

  return (
    <div ref={ref} className="fixed inset-x-0 top-0 z-50">
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

  return (
    <>
      <FixedHeader />
      <main>{children}</main>
      <FooterNavigation />
      <Footer />
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
