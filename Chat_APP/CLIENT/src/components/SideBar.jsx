import React, { useState } from 'react'
import Search from './Search';
import UsersList from './UsersList';

const SideBar = ({socket, onlineUser}) => {
  //for getting & setting up the particular user searched
  const [searchKey, setSearchKey] = useState("");

  return (
    <div className='app-sidebar'>
      {/* SEARCH USER */}
      <Search
       searchKey = {searchKey}
       setSearchKey = {setSearchKey}
        ></Search>
      {/* USER LIST*/}
      <UsersList searchKey = {searchKey} socket = {socket} onlineUser = {onlineUser}></UsersList>
    </div>
  )
}
export default SideBar;