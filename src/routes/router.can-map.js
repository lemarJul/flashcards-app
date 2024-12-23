module.exports = (router) => {
  /**
   * Inspired by the Express.js route mapping example:
   * @see https://github.com/expressjs/express/blob/master/examples/route-map/index.js
   */
  router.map = function (routeMap, routePath = "") {
    const isSubRoute = (item) => typeof item === "object";
    const isRouteHandler = (item) => Array.isArray(item) || typeof item === "function";

    for (const [key, value] of Object.entries(routeMap)) {
      if (isRouteHandler(value)) {
        router[key](routePath, value[0] ? [value] : value);
        if (process.env.NODE_ENV !== "production") console.info("%s %s", key, routePath);
        continue;
      }
      if (isSubRoute(value)) {
        router.map(value, routePath + key);
      }
    }
  };

  return router;
};
