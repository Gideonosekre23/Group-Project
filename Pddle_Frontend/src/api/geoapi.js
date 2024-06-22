import axios from 'axios';
import axiosInstance from './axios';
// import {GOOGLE_MAPS_API_KEY, API_BASE_URL} from '@env';
const GOOGLE_MAPS_API_KEY = 'AIzaSyDlCyKdmCGWS9d0Ryu3YQZ4HOc6Ut_65gc'


export const getGeocode = async address => {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${GOOGLE_MAPS_API_KEY}`;
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const getDistanceMatrix = async (origin, destination) => {
  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${origin}&destinations=${destination}&key=${GOOGLE_MAPS_API_KEY}`;
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};
