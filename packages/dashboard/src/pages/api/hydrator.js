export default (req, res) => {
  const data = req.body;

  console.log("method", req.method);
  console.log("body", req.body);
  console.log("cookies", req.cookies);

  res.json({ ...data, cookies: { ...data.cookies, foo: "bar" } });
};
