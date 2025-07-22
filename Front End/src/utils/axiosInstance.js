import axios from "axios";
const server_url = import.meta.env.VITE_SERVER_URL

const apiClient = axios.create({
    baseURL:server_url
})

apiClient.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token'); 
      if (token) {
        
        config.headers['Authorization'] = `Bearer ${token}`;  
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

export const axiosInstance = apiClient 