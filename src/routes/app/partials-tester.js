const fs = require("fs");
const path = require("path");
const { dirname } = path
const appDir = dirname((require.main.filename))
const partials = fs
  .readdirSync(appDir + "/views/partials")
  .map((file) => path.basename(file, ".ejs"));

module.exports = (app) => {
    for (const partial of partials) {
        console.log(`partials/${partial}`);
        app.get(`/partials/${partial}`, (req, res) => {
            res.render(`partials/test`, { locals: { partial }});
        });
    }
}

