const fs = require("fs");
const path = require("path");

module.exports.isDevENV = process.env.NODE_ENV === "development";

module.exports.requireAllFilesInDirectory = function (directory) {
  const files = fs.readdirSync(directory);
  const modules = {};

  files.forEach((file) => {
    if (file === "index.js") return;
    const filename = path
      .parse(file)
      .name.replace(/(-\w)/g, (m) => m[1].toUpperCase());
    modules[filename] = require(path.join(directory, file));
  });

  return modules;
};

module.exports.httpStatusCodes = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

module.exports.parseHyphenatedString = (str) => str.replace(/-/g, " ");
