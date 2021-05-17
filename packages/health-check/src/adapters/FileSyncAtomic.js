const fs = require("graceful-fs");
const Base = require("lowdb/adapters/Base");
const { sync: writeFileAtomicSync } = require("write-file-atomic");

class FileSyncAtomic extends Base {
  read() {
    if (fs.existsSync(this.source)) {
      try {
        const data = fs.readFileSync(this.source, "utf-8").trim();
        return data ? this.deserialize(data) : this.defaultValue;
      } catch (e) {
        if (e instanceof SyntaxError) {
          e.message = `Malformed JSON in file: ${this.source}\n${e.message}`;
        }
        throw e;
      }
    } else {
      writeFileAtomicSync(this.source, this.serialize(this.defaultValue));
      return this.defaultValue;
    }
  }

  write(data) {
    return writeFileAtomicSync(this.source, this.serialize(data));
  }
}

module.exports = FileSyncAtomic;
