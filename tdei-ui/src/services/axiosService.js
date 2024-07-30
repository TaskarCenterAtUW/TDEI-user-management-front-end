import axios from "axios";
import { url, osmUrl } from "./apiServices";


async function refreshRequest() {
  try {
    const token = localStorage.getItem("refreshToken");
    if (token && token !== "undefined") {
      console.log("Attempting to refresh token...");
      const response = await axios({
        url: `${osmUrl}/refresh-token`,
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        data: token
      });
      const { access_token, refresh_token } = response.data;
      localStorage.setItem("accessToken", access_token);
      localStorage.setItem("refreshToken", refresh_token);
      console.log("Token refreshed successfully");
    }
  } catch (e) {
    console.error("Error refreshing token", e);
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
        console.error("Error refreshing the token", error);
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
        console.log("401 error received. Attempting to refresh token...");
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
        return await axios(err.config);
      } catch (e) {
        console.error("Error retrying request after refreshing token", e);
        return Promise.reject(e);
      }
    }
    return Promise.reject(error.response ?? error);
  }
);

