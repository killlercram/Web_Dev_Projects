const router = require("express").Router();
const Chat = require("../models/chat");
const authMiddleware = require("../middlewares/authMiddleware");
const Message =require("../models/message");


//creating a new Chat 
router.post("/create-new-chat", authMiddleware, async (req, res) =>{
  try {
    const chat = new Chat(req.body);
    const savedChat = await chat.save();
    await savedChat.populate("members");

    res.status(201).send({
      message: "Chat created successfully",
      success: true,
      data: savedChat
    });
    
  } catch (error) {
    res.status(400).send({
      message: error.message,
      success: false
    });
  }
});

//Getting all the chats of a particular user
router.get("/get-all-chats", authMiddleware, async (req, res) =>{
  try {
    //finding with filter of user id getting from middleware
    const allChats = await Chat.find({members: {$in: req.body.userId}}).populate("members").populate("lastMessage").sort({updatedAt: -1});

    res.status(200).send({
      message: "Chat fetched successfully",
      success: true,
      data: allChats
    });
    
  } catch (error) {
    res.status(400).send({
      message: error.message,
      success: false
    });
  }
});

//clearing the unread Message Count
router.post("/clear-unread-message", authMiddleware, async (req,res) => {
  try {
    const chatId = req.body.chatId;
    //we will update the unread message count in Chat collection
    const chat = await Chat.findById(chatId);
    if(!chat){
      res.send({
        message: "No Chat found with given chat ID.",
        success: false
      });
    }
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {unreadMessageCount: 0},
      {new: true} //document updated
    ).populate("members").populate("lastMessage");

    //we want to update the read property to true in message collection
    await Message.updateMany(
      {chatId: chatId, read: false},
      {read: true}
    );
    res.send({
      message: "Unread message cleared successfully",
      success: true,
      data: updatedChat
    })
  } catch (error) {
    res.status(400).send({
      message: error.message,
      success: false
    });
  }
})

module.exports = router;

