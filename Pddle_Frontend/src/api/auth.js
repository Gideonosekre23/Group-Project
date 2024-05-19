import axiosInstance from './axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getCustomerInfo = async () => {
    try {
      const response = await axiosInstance.get('/customer');
      return response.data;
    } catch (error) {
      console.warn('Error fetching customer info:', error.response || error.message || error);
      throw error.response ? error.response.data : error;
    }
  };

export const checkTokenValidity = async () => {
    try {
        const response = await axiosInstance.get('/token_valid');
        console.log("Success check, with response: ", JSON.stringify(response, null, 2));
        return response.status;
      } catch (error) {
        console.log("Error check, with error: ", JSON.stringify(error, null, 2));
        
        // Check if the error object has a response property
        if (error.response) {
          const reqStatus = error.response.status;
          console.log("Request status: ", reqStatus);
          return reqStatus;
        } else {
          // If no response property, log and handle as needed
          console.log("No response received, error message: ", error.message);
          return null;
        }
      }
};

export const registerUser = async (userData) => {
  try {
    const response = await axiosInstance.post('/Register/', userData);
    return response.data;
  } catch (error) {
    console.warn('Error registering user:', error.response || error.message || error);
    throw error;
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await axiosInstance.post('/Login/', credentials);
    const token = response.data.user.token;
    console.log(token);
    await AsyncStorage.setItem('token', token);
    return response.data;
  } catch (error) {
    console.warn('Error logging in user:', error.response || error.message || error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await axiosInstance.post('/Logout/');
    await AsyncStorage.removeItem('token');
  } catch (error) {
    console.log("Logout Error: ", JSON.stringify(error, null, 2));
    throw error.response.data;
  }
};

export const updateProfile = async () => {
    try {
      await axiosInstance.put('/Update/', { phone_number: "0722999888" });
      console.log("Succsesfull update")
    } catch (error) {
        console.log("Error update, with error: ", JSON.stringify(error, null, 2));
    }
};