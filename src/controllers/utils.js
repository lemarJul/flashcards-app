const { Api400Error } = require("../errors/api-errors");

/**
 * Creates a proxy object that throws an error if a property is accessed but not defined.
 *
 * @param {object} obj - The object to create a proxy for.
 * @returns {object} - The proxy object.
 * @throws {Api400Error} - Throws an error if a property is accessed but not defined.
 */
function requireDefinedProps(obj) {
  return new Proxy(obj, {
    get(target, prop) {
      if (prop in target) {
        return target[prop];
      } else {
        throw new Api400Error(`No ${prop} provided`);
      }
    },
  });
}

module.exports = { requireDefinedProps };
