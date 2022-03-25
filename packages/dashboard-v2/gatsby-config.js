const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = {
  siteMetadata: {
    title: `Accounts Dashboard`,
    siteUrl: `https://www.yourdomain.tld`,
  },
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
        path: "./src/images/",
      },
      __key: "images",
    },
  ],
  developMiddleware: (app) => {
    app.use(
      "/api/",
      createProxyMiddleware({
        target: "https://account.skynetpro.net",
        secure: false, // Do not reject self-signed certificates.
        changeOrigin: true,
      })
    );
  },
};
