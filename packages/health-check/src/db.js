const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const Memory = require("lowdb/adapters/Memory");

const adapter = process.env.NODE_ENV === "production" ? new FileSync("state/state.json") : new Memory();
const db = low(adapter);

db.defaults({ entries: [] }).write();

module.exports = db;
