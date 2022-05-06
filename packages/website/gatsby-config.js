const { defaultIcons } = require("gatsby-plugin-manifest/common");

if (!process.env.PORTAL_DOMAIN) {
  throw new Error("PORTAL_DOMAIN cannot be empty");
}

module.exports = {
  siteMetadata: {
    title: `Skynet`,
    description: `Skynet is a decentralized file sharing and content distribution protocol`,
    author: `Skynet Labs`,
    siteUrl: `https://${process.env.PORTAL_DOMAIN}`,
    image: `/icons/icon-512x512.png`,
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
    `gatsby-plugin-svgr`,
    `gatsby-plugin-robots-txt`,
    `gatsby-transformer-sharp`,
    `gatsby-transformer-yaml`,
    {
      resolve: `gatsby-plugin-env-variables`,
      options: {
        allowList: ["PORTAL_DOMAIN", "WEBSITE_CONTACT_EMAIL", "WEBSITE_ABUSE_EMAIL"],
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Skynet`,
        short_name: `Skynet`,
        start_url: `/`,
        background_color: `#f1f7f2`,
        theme_color: `#f1f7f2`,
        display: `minimal-ui`,
        icon: `src/images/logo-sq.svg`, // This path is relative to the root of the site.
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
        description: `Skynet portal homepage and upload widget`,
      },
    },
    {
      resolve: "gatsby-plugin-sitemap",
      options: {
        output: "/",
        createLinkInHead: true,
        excludes: ["/using-typescript/"],
        query: `
          {
            site {
              siteMetadata {
                siteUrl
              }
            }
            allSitePage {
              nodes {
                path
              }
            }
          }
        `,
        resolvePages: ({ allSitePage: { nodes: allPages } }) => {
          const pathToDateMap = {};

          // modify pages to filter out hidden news items and add date
          const pages = allPages
            .filter((page) => {
              if (pathToDateMap[page.path] && pathToDateMap[page.path].hidden) {
                return false;
              }

              return true;
            })
            .map((page) => {
              return { ...page, ...pathToDateMap[page.path] };
            });

          return pages;
        },
        serialize: ({ path, date }) => {
          let entry = {
            url: path,
            changefreq: "daily",
            priority: 0.5,
          };

          if (date) {
            entry.priority = 0.7;
            entry.lastmod = date;
          }

          return entry;
        },
      },
    },
  ],
};
