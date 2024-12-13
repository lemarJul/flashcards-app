const dotenv = require('dotenv')
const dotenvExpand = require('dotenv-expand')
dotenvExpand.expand(dotenv.config())

const port = process.env.PORT || 3000;
const App = require("./app.js");

const app = new App();

app.listen(port, () =>
  console.log(`Listening on port ${port}, url: http://localhost:${port}`)
);

module.exports = app;
