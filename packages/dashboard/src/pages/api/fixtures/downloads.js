export default (req, res) => {
  res.statusCode = 200;
  res.json(require("./downloads.json"));
};
