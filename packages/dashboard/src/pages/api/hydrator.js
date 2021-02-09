export default (req, res) => {
  console.log("method", req.method);
  console.log("body", req.body);
  console.log("cookies", req.cookies);

  res.status(200).json({ name: "John Doe", extra: { foo: "bar" }, header: { foo: ["bar1", "bar2"] } });
};
