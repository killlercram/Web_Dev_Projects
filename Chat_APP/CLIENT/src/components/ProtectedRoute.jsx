/* eslint-disable no-unused-vars */

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLoggedinUser, getAllUsers } from "../apiCalls/users";
import { useDispatch, useSelector } from "react-redux";
import { hideLoader, showLoader } from "../redux/loaderSlice";
import toast from "react-hot-toast";
import { setAllChats, setAllUsers, setUser } from "../redux/userSlice";
import { getAllChats } from "../apiCalls/chat";

const ProtectedRoute = ({ children }) => {
  // const [user, setUser] = useState(null);
  const { user } = useSelector((state) => state.userReducer);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  //getting and setting user with logged in details
  const getLoggedInUser = async () => {
    let response = null;
    try {
      dispatch(showLoader());
      response = await getLoggedinUser();
      dispatch(hideLoader());

      if (response.success) {
        dispatch(setUser(response.data));
        // console.log("PR", user);
      } else {
        // console.log("PR er1", user);
        toast.error(response.message);
        navigate("/login");
      }
    } catch (error) {
      // console.log("PR er2", user);
      dispatch(hideLoader());
      navigate("/login");
    }
  };

  //Getting details of all the users
  const getAllUsersFromDb = async () => {
    let response = null;
    try {
      dispatch(showLoader());
      response = await getAllUsers();
      dispatch(hideLoader());
      // console.log("REsponse", response);
      if (response.success) {
        // console.log("response: ",response);
        dispatch(setAllUsers(response.data));
      } else {
        //  console.log("PR er1", user);
        toast.error(response.message);
        navigate("/login");
      }
    } catch (error) {
      // console.log("PR err2:" ,user);
      dispatch(hideLoader());
      navigate("/login");
    }
  };

  //Getting all the chats of the loggedin User
  const getCurrentUserChats = async () =>{
    let response = null;
    try {
      dispatch(showLoader());
      response = await getAllChats();
      dispatch(hideLoader());
      // console.log("REsponse", response);
      if (response.success) {
        // console.log("response: ",response);
        dispatch(setAllChats(response.data));
      } else {
        //  console.log("PR er1", user);
        toast.error(response.message);
        navigate("/login");
      }
    } catch (error) {
      dispatch(hideLoader());
      navigate("/login");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      // getting user's details
      getLoggedInUser();
      getAllUsersFromDb();
      getCurrentUserChats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <>{children}</>;
};

export default ProtectedRoute;
