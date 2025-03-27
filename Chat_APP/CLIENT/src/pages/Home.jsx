
import React, { useEffect,useState } from 'react'
import HomeHeader from '../components/HomeHeader';
import SideBar from '../components/SideBar';
import ChatArea from '../components/ChatArea';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';

const socket = io("http://localhost:5000");
const Home = () => {
  const { selectedChat , user} = useSelector( state => state.userReducer );
  const [onlineUser, setOnlineUser] = useState([]);


  //Sending a broadCast message to all the chatters
  // useEffect(() => {
  //   //sending Event to the server
  //   socket.emit("send-message-all", {text: "Hi from detactive!"});
    
  //   //listening Event from the server
  //   socket.on("send-message-by-server", data =>{
  //     console.log(data);
  //   })

  //  // Cleanup when component unmounts
  //   return () => {
  //     socket.disconnect(); 
  //   };
  // },[])

  //Create socket room
  useEffect(()=>{
    if(user){
      socket.emit("join-room", user._id);
      /*socket.emit("send-message",{text: "Hello! Shashwat", recipient: "67dbba251354cde3123dd93d"});
      //handling event from server
      socket.on("received-message", data => {
        console.log(data);
      })*/

      // Handling the user logged in for showing them online 
      socket.emit("user-login", user._id);
      //adding online users in online users array
      socket.on("online-users", onlineusers => {
        setOnlineUser(onlineusers);
      });
      //removing online user from online users array
      socket.on("online-users-updated", onlineusers => {
        setOnlineUser(onlineusers);
      });
    }

  },[user,onlineUser]);

  return (
    <div className="home-page">
      <HomeHeader socket = {socket}></HomeHeader>
      <div className="main-content">
        {/* SideBar layout */}
        <SideBar socket={socket} onlineUser = {onlineUser}></SideBar>
        {/* Chat Area layout */}
        {selectedChat && <ChatArea socket={socket}></ChatArea>}
      </div>
    </div>
  );
}

export default Home;