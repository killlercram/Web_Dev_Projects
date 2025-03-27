import { axiosInstance } from "./index";

//signup User function
export const signupUser = async (user) =>{
  try {
    const response = await axiosInstance.post("/api/auth/signup", user);
    return response.data;
    
  } catch (error) {
    const errorMessage = error.response?.data?.message;
    return {success: false, message: errorMessage};
  }
};

//Sending a Login Request
export const loginUser = async (user) =>{
  try {
    const response = await axiosInstance.post("/api/auth/login",user);
    //  console.log("Auth Response",response.data);
    return response.data;
    
  } catch (error) {
    // console.log("Auth Error",error);
    const errMsg = error.response?.data?.message;
    // console.log("errMsg",errMsg);
    return {success: false, message: errMsg};
  }
};

