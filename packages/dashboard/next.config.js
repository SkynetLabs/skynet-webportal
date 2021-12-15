module.exports = {
  async redirects() {
    const redirects = [];

    if (process.env.ACCOUNTS_MAINTENANCE === "true") {
      redirects.push({
        source: "/((?!maintenance$).*)",
        destination: "/maintenance",
        permanent: false,
      });
    }

    return redirects;
  },
};
