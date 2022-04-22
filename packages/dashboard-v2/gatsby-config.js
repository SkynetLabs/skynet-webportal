require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
});

const { createProxyMiddleware } = require("http-proxy-middleware");

const { GATSBY_PORTAL_DOMAIN } = process.env;

module.exports = {
  siteMetadata: {
    title: `Account Dashboard`,
    siteUrl: `https://account.${GATSBY_PORTAL_DOMAIN}`,
  },
  pathPrefix: "/v2",
  trailingSlash: "never",
  plugins: [
    "gatsby-plugin-image",
    "gatsby-plugin-provide-react",
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-sharp",
    "gatsby-transformer-sharp",
    "gatsby-plugin-styled-components",
    "gatsby-plugin-postcss",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "images",
        path: "./static/images/",
      },
      __key: "images",
    },
  ],
  developMiddleware: (app) => {
    // Proxy Accounts service API requests:
    app.use(
      "/api/",
      createProxyMiddleware({
        target: `https://account.${GATSBY_PORTAL_DOMAIN}`,
        secure: false, // Do not reject self-signed certificates.
        changeOrigin: true,
      })
    );

    // Proxy /skynet requests (e.g. uploads)
    app.use(
      ["/skynet", "/__internal/"],
      createProxyMiddleware({
        target: `https://${GATSBY_PORTAL_DOMAIN}`,
        secure: false, // Do not reject self-signed certificates.
        changeOrigin: true,
        pathRewrite: {
          "^/skynet": "",
        },
      })
    );
  },
};
