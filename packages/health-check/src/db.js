const fs = require("graceful-fs");
const low = require("lowdb");
const FileSyncAtomic = require("./adapters/FileSyncAtomic");

if (!fs.existsSync(process.env.STATE_DIR)) fs.mkdirSync(process.env.STATE_DIR);

const adapter = new FileSyncAtomic(`${process.env.STATE_DIR}/state.json`);
const db = low(adapter);

db.defaults({ disabled: false, critical: [], extended: [] }).write();

module.exports = db;
