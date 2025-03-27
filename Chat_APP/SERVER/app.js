require("dotenv").config();
const authRouter = require("./controllers/authController");
const userRouter = require("./controllers/userController");
const chatRouter = require("./controllers/chatController");
const messageRouter = require("./controllers/messageController");
const cors = require("cors");


const express = require("express");
const { Socket } = require("socket.io");
const app = express();
//use auth controller routers
app.use(cors());
app.use(express.json({
    limit: "50mb"
}))
app.use(express.urlencoded({ extended: true, limit: "10mb" }));


//creating socket with app object
const server = require("http").createServer(app);
const io = require("socket.io")(server, {cors: {
  origin: process.env.FRONT_END_KEY,
  methods: ["GET", "POST"]
}})



//routers
app.use("/api/auth",authRouter);
app.use("/api/user",userRouter);
app.use("/api/chat",chatRouter);
app.use("/api/message",messageRouter);

//handling the data coming from the client and sending back to the clients.
// io.on("connection", socket => {
//   socket.on("send-message-all",data => {
//     socket.emit("send-message-by-server", "Message from server: " +data.text);
//   });
// });

const onlineUser = [];

io.on("connection", socket => {
  //Creating a socket room
  socket.on("join-room", userid => {
    socket.join(userid);
  });
  //send to specific user and sending some text back to client
  socket.on("send-message", (message) => {
    io
    .to(message.members[0])
    .to(message.members[1])
    .emit("receive-message", message);
    io
    .to(message.members[0])
    .to(message.members[1])
    .emit("set-message-count", message);
  })


  //Clearing the unread messages from the database
  socket.on("clear-unread-messages", data => {
    io
    .to(data.members[0])
    .to(data.members[1])
    .emit("message-count-cleared", data)
  })

  //listening the event of user typing and send one event back to client
  socket.on("user-typing", (data) =>{
    io
    .to(data.members[0])
    .to(data.members[1])
    .emit("started-typing", data);
  });

  //Handling user loggin event and send back an event 
  socket.on("user-login", userId => {
    if(!onlineUser.includes(userId)){
      onlineUser.push(userId)
    }
    socket.emit("online-users", onlineUser);
  })

  //listening to logout event and change the online user array 
  socket.on("user-offline", userId => {
   onlineUser.splice(onlineUser.indexOf(userId), 1);
    io.emit("online-users-updated", onlineUser);

  })
})


module.exports = server;
// module.exports = app;
