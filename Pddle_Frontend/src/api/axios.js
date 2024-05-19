import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { resetTo } from '../services/NavigationService';
import { Alert } from 'react-native';

const axiosInstance = axios.create({
  baseURL: 'http://192.168.0.105:8000', // Replace with your Django backend URL
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