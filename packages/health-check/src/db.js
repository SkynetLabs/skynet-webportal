const fs = require("fs");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const Memory = require("lowdb/adapters/Memory");

if (!fs.existsSync("state")) fs.mkdirSync("state");

const adapter = process.env.NODE_ENV === "production" ? new FileSync("state/state.json") : new Memory();
const db = low(adapter);

db.defaults({ disabled: false, entries: [] }).write();

module.exports = db;
