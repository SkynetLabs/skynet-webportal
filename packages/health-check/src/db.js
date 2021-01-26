const fs = require("fs");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

if (!fs.existsSync(process.env.STATE_DIR)) fs.mkdirSync(process.env.STATE_DIR);

const adapter = new FileSync(`${process.env.STATE_DIR}/state.json`);
const db = low(adapter);

db.defaults({ disabled: false, critical: [], verbose: [] }).write();

module.exports = db;
