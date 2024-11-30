require("dotenv").config();
const App = require("./app.js");
const port = process.env.PORT || 3000;

const app = new App();

app.listen(port, () =>
  console.log(`Listening on port ${port}, url: http://localhost:${port}`)
);

module.exports = app;
