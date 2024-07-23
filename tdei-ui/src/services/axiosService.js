import axios from "axios";
import { url } from "./apiServices";

async function refreshRequest() {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
      const response = await axios.post(`${url}/refresh-token`,refreshToken);
      localStorage.setItem("accessToken", response.data.access_token);
      localStorage.setItem("refreshToken", response.data.refresh_token);
      return response.data.access_token;
    }
  } catch (e) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.reload();
    throw e;
  }
}
function isTokenExpiring(token, threshold = 60 * 1000) {
  if (!token) return false;
  const decodedToken = JSON.parse(window.atob(token.split(".")[1]));
  const expTime = decodedToken.exp * 1000;
  const currentTime = Date.now();
  return expTime - currentTime < threshold; 
}

function isRefreshTokenExpiring() {
  const refreshToken = localStorage.getItem("refreshToken");
  return isTokenExpiring(refreshToken);
}

axios.interceptors.request.use(
  async (config) => {
    if (isRefreshTokenExpiring()) {
      try {
        await refreshRequest();
      } catch (error) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.reload();
        return Promise.reject(new Error("Session expired. Please log in again."));
      }
    }
    
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error.response ?? error);
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
      try {
        const newToken = await refreshRequest();
        if (newToken) {
          axios.defaults.headers.common.Authorization = `Bearer ${newToken}`;
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axios(originalRequest);
        }
      } catch (refreshError) {
        return Promise.reject(refreshError.response ?? refreshError);
      }
    }
    return Promise.reject(error.response ?? error);
  }
);