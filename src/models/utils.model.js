function noUpdate(attName) {
  return function (val) {
    this.setDataValue(attName, this.getDataValue(attName) ?? val);
  };
}

module.exports = { noUpdate };
