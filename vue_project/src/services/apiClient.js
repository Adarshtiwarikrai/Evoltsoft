import axios from 'axios';
import store from '../store';


const API_BASE_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:5001/api';


const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = store.getters['auth/token'];
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("API Request Interceptor Error:", error);
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response, config: originalRequest } = error;

    if (response) {
      if (response.status === 401) {
        
        const isAuthRoute = originalRequest.url === '/users/login' || originalRequest.url === '/users/register';
        const isAlreadyLoggingOut = store.getters['auth/isLoggingOut']; 

        if (!isAuthRoute && !isAlreadyLoggingOut) {
          console.warn('Unauthorized (401) response. Dispatching logout.');
          
          
          store.dispatch('auth/logout');
          
        }
      }
    } else if (error.request) {
      console.error('Network Error or No Response from Server:', error.request);
      
      
    } else {
      console.error('Error setting up API request:', error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;