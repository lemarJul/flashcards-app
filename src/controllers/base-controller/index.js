module.exports = class BaseController {
  constructor(resource, sequelizeModel) {
    this.resourceName = resource;
    this.model = sequelizeModel;
    //this.findByPk = require("./find-by-pk.js");
    this.sendLoadedResource = require("./send-loaded-resource.js");
  }
  
  async findByPk(req, res, next, id) {
    try {
      const loaded = await this.model.findByPk(id);

      if (!loaded)
        throw new Api404Error(
          `Requested ${this.resourceName} with id ${id} doesn't exist.`
        );

      req[this.resourceName] = loaded;
      next();
    } catch (error) {
      next(error);
    }
  };
};
