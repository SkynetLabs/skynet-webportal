export default (req, res) => {
  console.log("method", req.method);
  console.log("body", req.body);
  console.log("cookies", req.cookies);

  res.json({ header: req.body ? req.body.header : {}, extra: { foo: "bar" } });
};
