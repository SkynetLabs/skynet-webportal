const db = require("../db");

// returns all critical health check entries
module.exports = (req, res) => {
  const entries = db.get("critical").orderBy("date", "desc").value();

  res.send(entries);
};
