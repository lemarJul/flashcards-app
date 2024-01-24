const { initTables, sequelize } = require("./src/db");
const MnemoniacApp = require("./app.js");
const port = process.env.PORT || 3000;

initTables(sequelize)
  .then(() => {
   new MnemoniacApp().listen(port, () => console.log(`Listening on port ${port} `));
  });
