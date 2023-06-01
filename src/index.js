const server = require("./app");
const {conn} = require("./db");

server.listen(3000, () => {
  conn.sync({force: false});
  console.log("server is listening on port 3000");
});
