export default (req, res) => {
  console.log(Object.keys(req));
  console.log(JSON.stringify(req));

  res.json({ name: "John Doe" });
};
