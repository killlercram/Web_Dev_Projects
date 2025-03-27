import { axiosInstance } from ".";
export const createNewMessage = async ( message ) => {
  try {
    const response = await axiosInstance.post("/api/message/new-message", message);
    return response.data;
    
  } catch (error) {
    return error.message;
  }
}

export const getAllMessages = async (chatId) => {
  try {
    const response = await axiosInstance.get(`/api/message/get-all-messages/${chatId}`);
    return response.data;
  } catch (error) {
    return error.message;
  }
}