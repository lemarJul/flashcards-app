const categoriesController = require('../../controllers/categories');
const rsc = '/categories';
const rscId = rsc + '/:id';

module.exports = (app, controller = categoriesController) => {
    
    app.get(rsc, controller.findAll);
}