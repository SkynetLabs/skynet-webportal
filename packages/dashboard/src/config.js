export default {
  // https://github.com/ory/kratos-selfservice-ui-node#configuration
  kratos: {
    // The URL where ORY Kratos's Public API is located at. If this app and ORY Kratos are running in the same
    // private network, this should be the private network address (e.g. kratos-public.svc.cluster.local)
    public: process.env.NEXT_PUBLIC_KRATOS_PUBLIC_URL,
    // The URL where ORY Kratos's public API is located, when accessible from the public internet via ORY Oathkeeper.
    // This could be for example http://kratos.my-app.com/.
    browser: `https://account.${process.env.DOMAIN_NAME}/.ory/kratos/public`,
  },
  tiers: {
    starter: { id: "starter", tier: 1, name: "Free", description: "Pin up to 100GB" },
  },
};
