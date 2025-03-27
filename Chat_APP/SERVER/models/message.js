const { model, Schema } = require("mongoose");

const messageSchema = new Schema(
  {
    chatId: {
      type: Schema.Types.ObjectId,
      ref: "chats",
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    text: {
      type: String,
      required: false,
    },
    image:{
      type: String,
      required:false
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Message = model("messages", messageSchema);
module.exports = Message;
