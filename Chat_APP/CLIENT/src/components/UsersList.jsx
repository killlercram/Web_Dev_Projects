/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { createNewChat } from "../apiCalls/chat";
import { hideLoader, showLoader } from "../redux/loaderSlice";
import { setAllChats, setSelectedChat } from "../redux/userSlice";
import moment from "moment";
import store from "../redux/store";

const UsersList = ({ searchKey , socket, onlineUser}) => {
 
  //importing all users from database
  const {
    allUsers,
    allChats,
    user: currentUser,
    selectedChat,
  } = useSelector((state) => state.userReducer);
  const dispatch = useDispatch();

  //Creating new Chat
  const startNewChat = async (searchedUserId) => {
    let response = null;
    try {
      dispatch(showLoader());
      // console.log("CU",currentUser);
      response = await createNewChat([currentUser._id, searchedUserId]);
      dispatch(hideLoader());
      // console.log("res",response);

      if (response.success) {
        toast.success(response.message);
        //getting the new chat
        const newChat = response.data;
        //adding new Chats with previous chats
        const updatedChat = [...allChats, newChat];
        //updating store with newly added chat
        dispatch(setAllChats(updatedChat));
        dispatch(setSelectedChat(newChat));
      }
    } catch (error) {
      toast.error(response?.message || error.message);
    }
  };

  //Opening chat for the selected user:
  const openChat = (selectedUser) => {
    //getting selected userid and logged user id from members arr
    const chat = allChats.find(
      (chat) =>
        chat.members.map((m) => m._id).includes(currentUser._id) &&
        chat.members.map((m) => m._id).includes(selectedUser._id)
    );
    if (chat) {
      dispatch(setSelectedChat(chat));
      // console.log("Chat Selected:", chat);
    } else {
      console.log("No chat found with this user!");
    }
  };

  //taking only the selected chat for highlighting
  const IsSelectedChat = (user) => {
    if (selectedChat) {
      return selectedChat.members.map((m) => m._id).includes(user._id);
    }
    return false;
  };

  //Getting Last Message in the sidebar with the users
  const getLastMessage = (userId) => {
    const chat = allChats.find((chat) =>
      chat.members.map((m) => m._id).includes(userId)
    );
    if (!chat || !chat.lastMessage) {
      return "";
    } else {
      const msgPrefix =
        chat?.lastMessage?.sender === currentUser._id ? "You:" : "";
      return msgPrefix + chat.lastMessage?.text?.substring(0, 25);
    }
  };

  //Getting the lastmessage time
  const getLastMessageTimeStamp = (userId) => {
    const chat = allChats.find((chat) =>
      chat.members.map((m) => m._id).includes(userId)
    );
    if (!chat || !chat?.lastMessage) {
      return "";
    } else {
      return moment(chat?.lastMessage?.createdAt).format("hh:mm A");
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

  useEffect(() => {
    //listening to receive-message event from the backend
    socket.off("set-message-count").on("set-message-count", (message) => {
      const selectedChat = store.getState().userReducer.selectedChat;
      let allChats = store.getState().userReducer.allChats;

      //uread Message count with socket
        if(selectedChat?._id !== message.chatId){
          const updatedChats = allChats.map(chat => {
            if(chat._id === message.chatId) {
              return {
                ...chat,
                unreadMessageCount: (chat?.unreadMessageCount || 0) +1,
                lastMessage: message
              };
            }
            return chat;
          });
          allChats = updatedChats;
        }

        //Sorting the Chat List as per the message received.
        //1.Find the lastest Chats
        const latestChat = allChats.find(chat => chat._id === message.chatId);
       
        //2. Get all other Chats
        const otherChats = allChats.filter(chat => chat._id !== message.chatId);

        //3.Create a new array latest chat on top and then other chats

        allChats = [latestChat, ...otherChats];

        dispatch(setAllChats(allChats));
      });
    },[]);

  //Getting the count for unread message
  const getUnreadMessageCount = (userId) => {
    const chat = allChats.find((chat) =>
      chat.members.map((m) => m._id).includes(userId)
    );

    if (
      chat &&
      chat.unreadMessageCount &&
      chat.lastMessage?.sender !== currentUser._id
    ) {
      return (
        <div className="unread-message-counter">
          {" "}
          {chat.unreadMessageCount}{" "}
        </div>
      );
    } else {
      return "";
    }
  };

  //Function for filtering the chats search and return
  function getData() {
    if (searchKey === "") {
      return allChats;
    } else {
      return allUsers.filter(user => {
        return user.firstname?.toLowerCase().includes(searchKey?.toLowerCase()) ||
            user.lastname?.toLowerCase().includes(searchKey?.toLowerCase());
    });
    }
  }

  //we will filter name with all name entered
  //then display all those in side bar
  return getData().map((obj) => {
    let user = obj;
    if (obj.members) {
      user = obj.members.find((mem) => mem._id !== currentUser._id);
    }
    return (
      <div
        key={user._id}
        className="user-search-filter"
        onClick={() => openChat(user)}
      >
        <div
          className={IsSelectedChat(user) ? "selected-user" : "filtered-user"}
        >
          <div className="filter-user-display">            
            {user.profilePic && (
              <img
                src={user.profilePic}
                alt="Profile Pic"
                className="user-profile-image"
                style={onlineUser.includes(user._id) ? {border: "#82e0aa 3px solid"}: {}}
              />
            )}
            {!user.profilePic && (
              <div
                className={
                  IsSelectedChat(user)
                    ? "user-selected-avatar"
                    : "user-default-avatar"
                }
                style={onlineUser.includes(user._id) ? {border: "#82e0aa 3px solid"}: {}}
              >
                {user.firstname.charAt(0).toUpperCase() +
                  user.lastname.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="filter-user-details">
              <div className="user-display-name">{formatName(user)}</div>

              <div className="user-display-email">
                {getLastMessage(user._id) || user.email}
              </div>
            </div>
            <div>
              {getUnreadMessageCount(user._id)}
              <div className="last-message-timestamp">
                {getLastMessageTimeStamp(user._id)}
              </div>
            </div>
            {!allChats.find((chat) =>
              chat.members.map((m) => m._id).includes(user._id)
            ) && (
              <div className="user-start-chat">
                <button
                  className="user-start-chat-btn"
                  onClick={() => startNewChat(user._id)}
                >
                  Start Chat
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  });
};

export default UsersList;
