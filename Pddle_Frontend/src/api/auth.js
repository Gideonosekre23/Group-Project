import axios, { setAuthToken } from './axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getCustomerInfo = async () => {
    try {
      const response = await axios.get('/customer');
      return response.data;
    } catch (error) {
      console.error('Error fetching customer info:', error.response || error.message || error);
      throw error.response ? error.response.data : error;
    }
  };

export const registerUser = async (userData) => {
  try {
    const response = await axios.post('/Register', userData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await axios.post('/Login', credentials);
    const { token } = response.data;
    await AsyncStorage.setItem('token', token);
    setAuthToken();
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const logoutUser = async () => {
  try {
    await axios.post('/Logout');
    await AsyncStorage.removeItem('token');
    setAuthToken();
  } catch (error) {
    throw error.response.data;
  }
};

// Function to clear token after a set time (e.g., 1 hour)
export const scheduleTokenDeletion = () => {
  setTimeout(async () => {
    await AsyncStorage.removeItem('token');
    setAuthToken();
  }, 3600000); // 1 hour in milliseconds
};