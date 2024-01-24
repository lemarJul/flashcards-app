module.exports = (resourceName, Model) => {
  return async (req, res, next) => {
    try {
      const resource = await Model.create(req.body);
      req[resourceName] = resource; 
      res.status(201).json({
        message: `${resourceName} created successfully`,
        data: resource,
      });
    } catch (error) {
      error.message = `Error in creating new ${resourceName}: ${error.message}`;
      next(error);
    }
  };
};
