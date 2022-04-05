import { Helmet } from "react-helmet";
import { graphql, useStaticQuery } from "gatsby";

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
      <link rel="icon" href="/favicon.ico" type="image/x-icon" />
      <meta name="description" content="Manage your Skynet uploads, account subscription, settings and API keys" />
      <link rel="preconnect" href={`https://${process.env.GATSBY_PORTAL_DOMAIN}/`} />
      {children}
    </Helmet>
  );
};
