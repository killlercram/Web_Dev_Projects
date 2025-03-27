require("dotenv").config();
const server = require("./app");
// const app = require("./app");

const dbConfig = require("./config/dbConfig");

const PORT=process.env.PORT_NUMBER || 8000 ;

server.listen(PORT,() => {
  console.log(`Server started at port ${PORT}`);
});