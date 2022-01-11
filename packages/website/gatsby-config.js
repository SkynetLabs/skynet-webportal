const { defaultIcons } = require("gatsby-plugin-manifest/common");

module.exports = {
  siteMetadata: {
    title: `Skynet`,
    description: `Skynet is a decentralized file sharing and content distribution protocol`,
    author: `Skynet Labs`,
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
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/data/news`,
        name: `news`,
      },
    },
    `gatsby-plugin-postcss`,
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-image`,
    `gatsby-plugin-sharp`,
    `gatsby-plugin-svgr`,
    `gatsby-plugin-robots-txt`,
    `gatsby-transformer-sharp`,
    `gatsby-transformer-json`,
    `gatsby-transformer-yaml`,
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-classes`,
            options: {
              classMap: {
                heading: "font-semibold text-palette-600",
                paragraph: "font-content text-base text-palette-400",
                strong: "font-semibold",
                link: "text-primary hover:underline transition-colors duration-200",
                "heading[depth=1]": "text-4xl",
                "heading[depth=2]": "text-3xl",
                "paragraph + paragraph": "mt-8",
                "paragraph + heading": "mt-20",
                "heading + paragraph": "mt-12",
              },
            },
          },
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 630,
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          `gatsby-remark-prismjs`,
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-smartypants`,
        ],
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
        skylink: `AQBG8n_sgEM_nlEp3G0w3vLjmdvSZ46ln8ZXHn-eObZNjA`,
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
            allMarkdownRemark {
              nodes {
                frontmatter {
                  date,
                  hidden
                },
                fields {
                  slug
                }
              }
            }
          }
        `,
        resolvePages: ({ allSitePage: { nodes: allPages }, allMarkdownRemark: { nodes: allNews } }) => {
          const pathToDateMap = {};

          allNews.map((post) => {
            pathToDateMap[post.fields.slug] = { date: post.frontmatter.date, hidden: post.frontmatter.hidden };
          });

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
  // mapping: {
  //   "MarkdownRemark.frontmatter.author": `teamYaml`,
  // },
};
