const { Api404Error } = require("../errors/api-errors");

function attachResourceToRequest(service) {
  return (req, res, next, id) => {
    service
      .findById(id)
      .then((resource) => {
        if (!resource) {
          throw new Api404Error(
            `Requested ${service.name} with id ${id} doesn't exist.`
          );
        }

        req[service.name.toLowerCase()] = resource;
        next();
      })
      .catch((error) => {
        next(error);
      });
  };
}

module.exports = { attachResourceToRequest };
