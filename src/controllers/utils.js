const { Api400Error } = require("../errors/api-errors");

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
