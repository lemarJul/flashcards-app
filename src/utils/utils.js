const fs = require("fs");
const path = require("path");

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
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
};

module.exports.isDevENV = process.env.NODE_ENV === "development";

module.exports.parseHyphenatedString = (str) => str.replace(/-/g, " ");

/**
 * Parses a semantic version string into an object with major, minor, and patch properties.
 *
 * @param {string} semver - The semantic version string to parse (e.g. "1.2.3").
 * @returns {{major: number, minor: number, patch: number}} An object containing the parsed major, minor, and patch version numbers.
 */
module.exports.parseSemVer = function parseSemVer(semVer) {
  const regex = /(?<major>\d*).(?<minor>\d*).(?<patch>\d*)/;
  const match = regex.exec(semVer);
  if (match?.groups) {
    return {
      major: parseInt(match.groups.major, 10),
      minor: parseInt(match.groups.minor, 10),
      patch: parseInt(match.groups.patch, 10),
    };
  } else {
    throw new Error(`Invalid semantic version string: ${semVer}`);
  }
};
