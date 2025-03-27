const router = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");
const Chat = require("../models/chat");
const Message = require("../models/message");

//Creating message and saving to database
router.post("/new-message", authMiddleware, async (req, res) => {
  try {
    //1.Storing the message in message collection
    const newMessage = new Message(req.body);
    const savedMessage = await newMessage.save();

    //2.Update the lastMessage in chat collection
    // const currentChat = await Chat.findById(req.body.chatId);
    // currentChat.lastMessage = savedMessage._id;
    // await currentChat.save();

    // console.log("Request", req);
    const currentChat = await Chat.findOneAndUpdate({
      _id: req.body.chatId, //finding current chat id & updating
    }, {
      lastMessage: savedMessage._id,
      $inc: {unreadMessageCount: 1}
    });
    res.status(201).send({
      message: "Message Send Successfully",
      success: true,
      data: savedMessage
    });
  } catch (error) {
    res.status(400).send({
      message: error.message,
      success: false,
    });
  }
});

//Getting all messages of two parties
router.get("/get-all-messages/:chatId", authMiddleware, async (req, res) =>{
  // console.log("Params:" ,req.params);
  // console.log("Body", req.body);
  // console.log("Headers", req.headers);
  try {
    const allMessages = await Message.find({chatId: req.params.chatId}).sort({createdAt: 1});

    res.send({
      message: "Message Fetched successfully",
      success: true,
      data: allMessages
    });
  } catch (error) {
    res.status(400).send({
      message: error.message,
      success: false
    });
    
  }

});
module.exports = router;
