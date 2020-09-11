const fs = require("fs");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const Memory = require("lowdb/adapters/Memory");

if (!fs.existsSync("state")) fs.mkdirSync("state");

const adapter = new FileSync("state/state.json");
const db = low(adapter);

db.defaults({ disabled: false, critical: [], verbose: [] }).write();

module.exports = db;
