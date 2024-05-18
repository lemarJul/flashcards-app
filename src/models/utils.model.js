/**
 *  Prevents the update of a field, except if it is null or undefined. useful as setter in a model definition
 * @example set: noUpdate("id")
 * @param {String} attName
 * @returns
 */
function noUpdate(attName) {
  return function (val) {
    this.setDataValue(attName, this.getDataValue(attName) ?? val);
  };
}

module.exports = { noUpdate };
