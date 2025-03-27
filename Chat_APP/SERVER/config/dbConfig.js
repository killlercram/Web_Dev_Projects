require("dotenv").config();
const mongoose = require("mongoose");

// mongoose.connect(process.env.MONGO_URL)
// .then((e) => console.log("MongoDB Connected!!"))
// .catch((err) =>console.log("MongoDB Failed!!") );

//connection logic
mongoose.connect(process.env.MONGO_URL);

//conection state
const db = mongoose.connection;

//checking state
db.on("connected", ()=> {
console.log("DB Connection successful!")
});
db.on("err", ()=> {
console.log("DB Connection Failed!")
});
module.exports = db;