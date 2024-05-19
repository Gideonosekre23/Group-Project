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

export const registerUser = async (userData) => {
  try {
    const response = await axiosInstance.post('/Register/', userData);
    return response.data;
  } catch (error) {
    throw error.response.data;
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
    throw error.response.data;
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

// Function to clear token after a set time (e.g., 1 hour)
export const scheduleTokenDeletion = () => {
  setTimeout(async () => {
    await AsyncStorage.removeItem('token');
    setAuthToken();
  }, 360000); // 1 hour in milliseconds
};