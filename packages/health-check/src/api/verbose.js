const db = require("../db");

// returns all verbose health check entries
module.exports = (req, res) => {
  const entries = db.get("verbose").orderBy("date", "desc").value();

  res.send(entries);
};
