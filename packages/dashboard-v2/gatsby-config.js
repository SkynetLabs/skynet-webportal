module.exports = {
  siteMetadata: {
    title: `Accounts Dashboard`,
    siteUrl: `https://www.yourdomain.tld`,
  },
  plugins: [
    "gatsby-plugin-image",
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-sharp",
    "gatsby-transformer-sharp",
    "gatsby-plugin-postcss",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "images",
        path: "./src/images/",
      },
      __key: "images",
    },
    {
      resolve: `gatsby-plugin-alias-imports`,
      options: {
        alias: {
          // Allows npm link-ing skynet-storybook during development.
          "styled-components": "./node_modules/styled-components",
        },
        extensions: ["js"],
      },
    },
  ],
};
