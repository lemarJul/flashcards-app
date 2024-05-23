/**
 *  Prevents the update of a field, except if it is null or undefined. useful as setter in a model definition
 * @example set: noUpdate("id")
 * @param {String} attName
 * @returns
 */
function noUpdate(attName) {
  return function (val) {
    // console.log("[NOUPDATE]", attName, val);
    // console.log(`this.getDataValue(${attName})`, this.getDataValue(attName));
    // ! Issue: problem with this.getDataValue method. except on creation (returns null the first time), I couldn't get it to work normally. It always returns undefined.
    this.setDataValue(attName, this.getDataValue(attName) ?? val);
    // console.log(`this.getDataValue(${attName})`, this.getDataValue(attName));
  };
}

module.exports = { noUpdate };
