const db = require("../db");

// returns a disabled flag status
module.exports = (req, res) => {
  const disabled = db.get("disabled").value();

  res.send({ disabled });
};
