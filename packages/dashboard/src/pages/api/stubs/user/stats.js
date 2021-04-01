import stats from "./stats.json";

export default (req, res) => {
  res.json(stats);
};
