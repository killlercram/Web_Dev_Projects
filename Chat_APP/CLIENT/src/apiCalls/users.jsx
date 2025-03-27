import { axiosInstance } from "./index";
// Getting all the user details from the backend api
export const getLoggedinUser = async () => {
  try {
   const response = await axiosInstance.get("/api/user/get-logged-user");
   return response.data;

  } catch (error) {
    return error;
  }

}
//getting all the user details accept logged in user.
export const getAllUsers = async () => {
  try {
   const response = await axiosInstance.get("/api/user/get-all-users");
   return response.data;
  } catch (error) {
    return error;
  }
}

//Function for calling api of uploading profile pic
export const uploadProfilePic = async (image) => {
  try {
   const response = await axiosInstance.post("/api/user/upload-profile-pic",{image});
   return response.data;
  } catch (error) {
    return error;
  }

}