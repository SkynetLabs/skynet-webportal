/**
 * SEO component that queries for data with
 *  Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import * as React from "react";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";
import { useStaticQuery, graphql } from "gatsby";

// todo: this should come from environment variable, matomo should not be initialised if this is not defined
const matomoTagManagerScript = `
var _mtm = window._mtm = window._mtm || [];
_mtm.push({'mtm.startTime': (new Date().getTime()), 'event': 'mtm.Start'});
var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
g.async=true; g.src='https://cdn.matomo.cloud/skynetlabs.matomo.cloud/container_4pSej4LD.js'; s.parentNode.insertBefore(g,s);
`;

function SEO({ description, lang, meta, title }) {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
            author
            image
          }
        }
      }
    `
  );

  const { title: siteTitle, description: siteDescription } = site.siteMetadata;
  const pageDescription = description || siteDescription;

  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={title}
      titleTemplate={`%s | ${siteTitle}`}
      meta={[
        {
          name: `description`,
          content: pageDescription,
        },
        {
          property: `og:title`,
          content: `${title} | ${siteTitle}`,
        },
        {
          property: `og:description`,
          content: pageDescription,
        },
        {
          property: `og:type`,
          content: `website`,
        },
        {
          property: `og:image`,
          content: site.siteMetadata?.image || "",
        },
        {
          name: `twitter:card`,
          content: `summary`,
        },
        {
          name: `twitter:creator`,
          content: site.siteMetadata?.author || ``,
        },
        {
          name: `twitter:title`,
          content: title,
        },
        {
          name: `twitter:description`,
          content: pageDescription,
        },
        // do not index public portal pages until we switch to dedicated portal landing page
        // otherwise skynetlabs.com and all its copies will be marked as duplicates by crawlers
        {
          name: "robots",
          content: "noindex",
        },
        {
          name: "googlebot",
          content: "noindex",
        },
      ].concat(meta)}
    >
      <script type="text/javascript">{matomoTagManagerScript}</script>
    </Helmet>
  );
}

SEO.defaultProps = {
  lang: `en`,
  meta: [],
  description: ``,
};

SEO.propTypes = {
  description: PropTypes.string,
  lang: PropTypes.string,
  meta: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string.isRequired,
};

export default SEO;
