import { Helmet } from "react-helmet";
import { graphql, useStaticQuery } from "gatsby";

import favicon from "../../../static/favicon.ico";
import favicon16 from "../../../static/favicon-16x16.png";
import favicon32 from "../../../static/favicon-32x32.png";
import appleIcon144 from "../../../static/apple-touch-icon-144x144.png";
import appleIcon152 from "../../../static/apple-touch-icon-152x152.png";
import msTileIcon from "../../../static/mstile-144x144.png";

export const Metadata = ({ children }) => {
  const { site } = useStaticQuery(
    graphql`
      query Q {
        site {
          siteMetadata {
            title
          }
        }
      }
    `
  );

  const { title } = site.siteMetadata;

  return (
    <Helmet htmlAttributes={{ lang: "en" }} titleTemplate={`%s | ${title}`} defaultTitle={title}>
      <meta name="application-name" content="Skynet Account Dashboard" />
      <link rel="icon" type="image/x-icon" href={favicon} />
      <link rel="icon" type="image/png" href={favicon16} sizes="16x16" />
      <link rel="icon" type="image/png" href={favicon32} sizes="32x32" />
      <link rel="apple-touch-icon-precomposed" sizes="144x144" href={appleIcon144} />
      <link rel="apple-touch-icon-precomposed" sizes="152x152" href={appleIcon152} />
      <meta name="msapplication-TileColor" content="#FFFFFF" />
      <meta name="msapplication-TileImage" content={msTileIcon} />

      <meta name="description" content="Manage your Skynet uploads, account subscription, settings and API keys" />
      <link rel="preconnect" href={`https://${process.env.GATSBY_PORTAL_DOMAIN}/`} />
      {children}
    </Helmet>
  );
};
