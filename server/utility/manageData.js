const fs = require("fs");
const dbPath = "./db/";

exports.read = (dbIndex, callback, defaultValue = []) => {
  fs.readFile(dbPath + dbIndex + ".json", (err, data) => {
    if (!err) {
      callback(JSON.parse(data.toString()));
    } else if (err.code === "ENOENT") {
      callback(defaultValue);
    } else {
      throw err;
    }
  });
}

exports.write = (dbIndex, newData, callback) => {
  fs.writeFile(dbPath + dbIndex + ".json", JSON.stringify(newData), (err) => {
    if (!err) {
      callback();
    } else {
      throw err;
    }
  });
}