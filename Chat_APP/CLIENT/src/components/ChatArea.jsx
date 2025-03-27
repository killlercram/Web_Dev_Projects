/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { hideLoader, showLoader } from "../redux/loaderSlice";
import { createNewMessage, getAllMessages } from "../apiCalls/message";
import { clearUnreadMessageCount } from "../apiCalls/chat";
import moment from "moment";
import store from "../redux/store"
import { setAllChats } from "../redux/userSlice";
import EmojiPicker from "emoji-picker-react";

const ChatArea = ({socket}) => {
  const { selectedChat, user, allChats } = useSelector((state) => state.userReducer);
  //finding details of selectedUser,with whom user want to chat.
  const selectedUser = selectedChat.members.find((u) => u._id !== user._id);

  const dispatch = useDispatch();
  const [message, setMessage] = useState(" ");
  const [allMessage, setAllMessage] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [data, setData] = useState(null);

  //Sending Messages to backend
  const sendMessage = async (image) => {
    try {
      const newMessage = {
        chatId: selectedChat._id,
        sender: user._id,
        text: message,
        image: image
      };
      socket.emit("send-message",{
        ...newMessage,
        members: selectedChat.members.map(m => m._id),
        read: false,
        createdAt: moment().format("YYYY-MM-DD hh:mm:ss")
      })

      const response = await createNewMessage(newMessage);
      // console.log(response);

      if (response.success) {
        setMessage("");
        setShowEmojiPicker(false);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  //getting All messages
  const getMessage = async () => {
    try {
      dispatch(showLoader());
      const response = await getAllMessages(selectedChat._id);
      dispatch(hideLoader());
      // console.log(response);

      if (response.success) {
        setAllMessage(response.data);
        // console.log(allMessage);
      }
    } catch (error) {
      dispatch(hideLoader());
      toast.error(error.message);
    }
  };

  //Adding time stamps in the chat
  const formatTime = (timestamp) => {
    const now = moment();
    const diff = now.diff(moment(timestamp), "days");

    if (diff < 1) {
      return `Today ${moment(timestamp).format("hh:mm A")}`;
    } else if (diff === 1) {
      return `Yesterday ${moment(timestamp).format("hh:mm A")}`;
    } else {
      return moment(timestamp).format("MMM D, hh:mm A");
    }
  };

  //Creating  format for displaying username
  function formatName(user) {
    let fname =
      user.firstname.at(0).toUpperCase() +
      user.firstname.slice(1).toLowerCase();
    let lname =
      user.lastname.at(0).toUpperCase() + user.lastname.slice(1).toLowerCase();
    return fname + " " + lname;
  }
  //Clearing the unread Message Count
  const clearUnreadMessages = async () => {
    try {
      socket.emit("clear-unread-messages", {
        chatId: selectedChat._id,
        members: selectedChat.members.map(m => m._id)
      })
      const response = await clearUnreadMessageCount(selectedChat._id);

      if (response.success) {
        // console.log(allChats);
        allChats.map(chat => {
          if(chat._id === selectedChat._id){
            return response.data;
          }
          return chat;
        })
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  //sending image as file
  const sendImage = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader(file);
    reader.readAsDataURL(file);

    reader.onloadend= async () => {
      sendMessage(reader.result);
    }
  }


  //Receiving the message and then transfering it to the user.
  useEffect(() => {
    getMessage();
    //clearing message count if selected user sees it
    if(selectedChat?.lastMessage?.sender !== user._id){
      clearUnreadMessages();
    }
    //listening to the receive message event and clearing the unread messages
    socket.off("receive-message").on("receive-message", (message) => {
      const selectedChat =store.getState().userReducer.selectedChat;
      if(selectedChat._id === message.chatId){
        setAllMessage(prevmsg => [...prevmsg, message]);
      }

      //calling the Clear unreadMessageCount function 
      if(selectedChat._id === message.chatId && message.sender !==user._id ){
        clearUnreadMessages();
      }
    })

    //Listening to the message count cleared event from teh server
    socket.on("message-count-cleared", data => {
      const selectedChat =store.getState().userReducer.selectedChat;
      const allChats =store.getState().userReducer.allChats;
      if(selectedChat._id === data.chatId){
        //Updating unread message count in chat object
        const updateChats = allChats.map(chat => {
          if(chat._id == data.chatId){
            return {...chat, unreadMessageCount: 0}
          }
          return chat;
        })
        //updating this change in all chats
        dispatch(setAllChats(updateChats));

        //Updating Read Property of the message object to true
        setAllMessage(prevMsgs => {
          return prevMsgs.map(msg => {
            return {...msg, read: true}
          })
        })
      }

    })

    //Listening to the event sent by the serve in response to our user-typing event
    socket.on("started-typing", (data) => {
      // if the user is not the logged in user
      if(selectedChat._id === data.chatId && data.sender !== user._id){
        setData(data);
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
        },2000);
      }
    });
  },[selectedChat]);

  //getting the scrollbar at the bottom
  useEffect(() => {
    const msgContainer = document.getElementById("main-chat-area");
    msgContainer.scrollTop = msgContainer.scrollHeight;
  },[allMessage,isTyping]);

  return (
    <>

      {selectedChat && (
        <div className="app-chat-area" >
          <div className="app-chat-area-header">
            {/* RECEIVER DATA */}
            {formatName(selectedUser)}
          </div>
          <div className="main-chat-area" id="main-chat-area">
            {/* CHAT AREA  */}
            {allMessage.map((msg) => {
              const isCurrentUserSender = msg.sender === user._id;
              return (
                <div
                  key={Math.random()}
                  className="message-container"
                  style={
                    isCurrentUserSender
                      ? { justifyContent: "end" }
                      : { justifyContent: "start" }
                  }
                >
                  <div>
                    <div
                      className={
                        isCurrentUserSender
                          ? "send-message"
                          : "received-message"
                      }
                    >
                      <div>{msg.text}</div>
                      <div>{msg.image && <img src={msg.image} alt="image" height="120" width="120"></img>}</div>
                    </div>
                    <div
                      className="message-timestamp"
                      style={
                        isCurrentUserSender
                          ? { float: " right" }
                          : { float: "left" }
                      }
                    >
                      {formatTime(msg.createdAt)}
                      {isCurrentUserSender && msg.read && 
                      <i className="fa fa-check-circle" aria-hidden= "true" style={{color: "#e74c3c"}}></i>}
                    </div>
                  </div>
                </div>
              );
            })}
            <div className="typing-indicator">
              {isTyping && selectedChat?.members.map(m => m._id).includes(data?.sender) && <i>typing...</i>}</div>
          </div>
          {showEmojiPicker && <div style={{width: '100%', display: 'flex', padding: '0px 20px', justifyContent: 'right'}}><EmojiPicker style={{width: "300px", height: "400px"}} onEmojiClick={(e) => setMessage(message + e.emoji)}></EmojiPicker></div>}
          <div className="send-message-div">
            <input
              type="text"
              className="send-message-input"
              placeholder="Type a message"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                // sending the event to the server of type usertyping
                socket.emit("user-typing", {
                  chatId: selectedChat._id,
                  members: selectedChat.members.map(m => m._id),
                  sender: user._id
                })
              }}
            />
            <label htmlFor="file">
            <i className="fa fa-picture-o send-image-btn"></i>
            <input type="file" name="file" id="file" style={{display: "none"}}
            accept="image/jpg, image/png, image/jpeg, image/gif"
            onChange={sendImage}/>
            </label>
            <button
              className="fa fa-smile-o send-emoji-btn"
              aria-hidden="true"
              onClick= { () => {setShowEmojiPicker(!showEmojiPicker)}}

            ></button>
            <button
              className="fa fa-paper-plane send-message-btn"
              aria-hidden="true"
              onClick={() => sendMessage("")}
            ></button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatArea;
