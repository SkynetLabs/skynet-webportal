import items from "./uploads.json";

export default (req, res) => {
  const offset = parseInt(req.query?.offset ?? 0, 10);
  const pageSize = parseInt(req.query?.pageSize ?? 10, 10);

  res.json({ items: items.slice(offset, offset + pageSize), count: items.length, pageSize, offset });
};
