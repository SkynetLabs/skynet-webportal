const db = require("../db");

// returns all health check entries
module.exports = (req, res) => {
  const entries = db.get("entries").orderBy("date", "desc").value();

  res.send(entries);
};
