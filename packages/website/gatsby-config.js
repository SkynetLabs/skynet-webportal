const { defaultIcons } = require("gatsby-plugin-manifest/common");

module.exports = {
  siteMetadata: {
    title: `Skynet`,
    description: `Skynet is a decentralized file sharing and content distribution protocol`,
    author: `Skynet Labs Inc`,
    siteUrl: `https://siasky.net`,
    image: `https://siasky.net/icons/icon-512x512.png`,
  },
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `src`,
        path: `${__dirname}/src/`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `data`,
        path: `${__dirname}/data/`,
      },
    },
    `gatsby-plugin-postcss`,
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-image`,
    `gatsby-plugin-sharp`,
    `gatsby-plugin-react-svg`,
    `gatsby-plugin-robots-txt`,
    `gatsby-transformer-sharp`,
    `gatsby-transformer-json`,
    `gatsby-transformer-yaml`,
    `gatsby-transformer-remark`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Skynet`,
        short_name: `Skynet`,
        start_url: `/`,
        background_color: `#f1f7f2`,
        theme_color: `#f1f7f2`,
        display: `minimal-ui`,
        icon: `src/images/logo.svg`, // This path is relative to the root of the site.
        icons: [
          ...defaultIcons,
          // when we're serving content from the portal on our pathnames that do not have
          // favicon defined (basically all non-html content), we want the browsers to be
          // able to fall back to favicon.ico (firefox does that)
          {
            src: `favicon.ico`,
            sizes: `32x32`,
            type: `image/x-icon`,
          },
        ],
      },
    },
    {
      resolve: "gatsby-plugin-matomo",
      options: {
        siteId: 3,
        matomoUrl: "https://surveillance.sia.tech",
        siteUrl: "https://siasky.net",
      },
    },
  ],
};
