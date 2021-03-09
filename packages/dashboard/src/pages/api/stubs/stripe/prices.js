export default (req, res) => {
  res.json([
    {
      id: "price_1IReYFIzjULiPWN6DqN2DwjN",
      name: "Skynet Extreme",
      description: "Skynet Extreme description",
      tier: 4,
      price: 80,
      currency: "usd",
      stripe: "price_1IReYFIzjULiPWN6DqN2DwjN",
      productId: "prod_J3m6IuVyh3XOc5",
      livemode: false,
    },
    {
      id: "price_1IReY5IzjULiPWN6AxPytHEG",
      name: "Skynet Pro",
      description: "Skynet Pro description",
      tier: 3,
      price: 20,
      currency: "usd",
      stripe: "price_1IReY5IzjULiPWN6AxPytHEG",
      productId: "prod_J3m6ioQg90kZj5",
      livemode: false,
    },
    {
      id: "price_1IReXpIzjULiPWN66PvsxHL4",
      name: "Skynet Plus",
      description: "Skynet Plus description",
      tier: 2,
      price: 5,
      currency: "usd",
      stripe: "price_1IReXpIzjULiPWN66PvsxHL4",
      productId: "prod_J3m6xMfDiz2LGE",
      livemode: false,
    },
  ]);
};
