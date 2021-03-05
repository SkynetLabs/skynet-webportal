export default (req, res) => {
  res.json([
    {
      id: "initial_free",
      tier: 1,
      stripe: null,
      name: "Free",
      price: 0,
      description: "Unlimited bandwidth with throttled speed",
    },
    {
      id: "initial_plus",
      tier: 2,
      stripe: "price_1IO6DLIzjULiPWN6ix1KyCtf",
      name: "Skynet Plus",
      price: 5,
      description: "1 TB premium bandwidth with full speed",
    },
    {
      id: "initial_pro",
      tier: 3,
      stripe: "price_1IO6DgIzjULiPWN6NiaSLEKa",
      name: "Skynet Pro",
      price: 20,
      description: "5 TB premium bandwidth with full speed",
    },
    {
      id: "initial_extreme",
      tier: 4,
      stripe: "price_1IO6DvIzjULiPWN6wHgK35J4",
      name: "Skynet Extreme",
      price: 80,
      description: "20 TB premium bandwidth with full speed",
    },
  ]);
};
