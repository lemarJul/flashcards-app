const path = require("path");
const fs = require("fs");
const accessLogStream = fs.createWriteStream(path.join(__dirname, "logs", "access.log"), {
  flags: "a",
});

module.exports = { 
  database: {
    options: {
      sync: {
        force: process.env.DB_SYNC_FORCE || false,
        alter: process.env.DB_SYNC_ALTER || false,
      },
    },
  },
  logging: ["combined", { stream: accessLogStream }],
};
