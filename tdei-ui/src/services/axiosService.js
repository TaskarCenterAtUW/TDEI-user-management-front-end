import axios from "axios";
import { url } from "./apiServices";

async function refreshRequest() {
  try {
    const token = localStorage.getItem("refreshToken");
    if(token){
      const response = await axios.post(`${url}/refresh-token`, {
        token,
      });
      localStorage.setItem("accessToken", response.data.access_token);
      localStorage.setItem("refreshToken", response.data.refresh_token);
      return response.data.access_token;
    }
  } catch (e) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.reload();
  }
}

axios.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const newToken = await refreshRequest();
      if (newToken) {
        axios.defaults.headers.common.Authorization = `Bearer ${newToken}`;
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axios(originalRequest);
      }
    }
    return Promise.reject(error);
  }
);