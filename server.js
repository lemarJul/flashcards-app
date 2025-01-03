// Load environment variables and expand nested values
const { expand } = require("dotenv-expand");
const { config: loadEnv } = require("dotenv");
const isDev = process.env.NODE_ENV === "development";
const debug = isDev ? { debug: true } : {};
expand(loadEnv(debug)).parsed;

//Load server configuration from .env file
const { port } = require("config").get("server");

const App = require("./app.js");
const app = new App();

app.listen(port, () => console.log(`Listening on port ${port}, url: http://localhost:${port}`));

module.exports = app;
