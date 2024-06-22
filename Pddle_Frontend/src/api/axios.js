import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { resetTo } from '../services/NavigationService';
import { Alert } from 'react-native';

const axiosInstance = axios.create({
  baseURL: 'https://223a-86-125-92-84.ngrok-free.app', // Replace with your Django backend URL
  timeout: 15000
});

// Add a request interceptor to include the token in headers
axiosInstance.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        console.log("In error interceptor");
        if (error.response) {
            if (error.response.status == 401 || error.response.status == 404)
            {
                const url = error.config ? error.config.url : 'Url not available';
                if (url && url != "/token_valid")
                {
                    Alert.alert("Session expired", "You have been logged out. Please log in again");
                }
                AsyncStorage.removeItem('token');
                resetTo('LandingScreen');
            }
        }
        return Promise.reject(error);
    });

export default axiosInstance;

export const handleApiError = error => {
  if (error.response) {
    const {status, data} = error.response;
    let message = 'An error occurred. Please try again.';
    switch (status) {
      case 400:
        message = data.error || 'Bad Request';
        break;
      case 401:
        message = data.error || 'Unauthorized. Please log in again.';
        break;
      case 404:
        message = data.error || 'Resource not found.';
        break;
      case 500:
        message = 'Internal Server Error. Please try again later.';
        break;
      default:
        message = data.error || 'An error occurred. Please try again.';
    }
    Alert.alert('Error', message);
  } else if (error.request) {
    Alert.alert(
      'Error',
      'No response from the server. Please check your network connection.',
    );
  } else {
    Alert.alert('Error', error.message);
  }
};