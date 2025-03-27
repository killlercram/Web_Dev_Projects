const { Schema, model } = require("mongoose");
const chatSchema = new Schema(
  {
    members: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "users",
        },
      ],
    },
    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: "messages",
    },
    unreadMessageCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Chat = model("chats", chatSchema);
module.exports = Chat;