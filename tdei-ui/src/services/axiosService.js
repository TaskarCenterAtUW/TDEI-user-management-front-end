import axios from "axios";
import { url, osmUrl } from "./apiServices";
import { onTokenExpired } from "./tokenEventEmitter";
let isRefreshing = false;

/**
 * Function to refresh the access token using the refresh token.
 */
async function refreshRequest() {
  // To prevent multiple refresh attempts
  if (isRefreshing) return; 

  isRefreshing = true; 
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
    if(e.status === 401){
      onTokenExpired(); 
    }else{
      localStorage.removeItem("accessToken"); 
      localStorage.removeItem("refreshToken");
      // Reload the page to redirect the user
      window.location.reload(); 
    }
    throw e; 
  } finally {
    isRefreshing = false; 
  }
}

/**
 * Function to check if a token is expiring soon.
 * @param {string} token - The JWT token to check.
 * @param {number} threshold - Time in milliseconds before expiry to consider as "expiring soon".
 * @returns {boolean} - True if the token is expiring soon, false otherwise.
 */
function isTokenExpiring(token, threshold = 60 * 1000) {
  if (!token) return false;
  const decodedToken = JSON.parse(window.atob(token.split(".")[1])); 
  // Convert expiry time to milliseconds
  const expTime = decodedToken.exp * 1000; 
  // Get current time
  const currentTime = Date.now(); 
  // Check if the token is expiring soon
  return expTime - currentTime < threshold; 
}

/**
 * Function to check if the refresh token is expiring soon.
 * @returns {boolean} - True if the refresh token is expiring soon, false otherwise.
 */
function isRefreshTokenExpiring() {
  const refreshToken = localStorage.getItem("refreshToken");
  return isTokenExpiring(refreshToken);
}

axios.interceptors.request.use(
  async (config) => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`; 
      }
    return config;
  },
  (error) => Promise.reject(error.response ?? error) 
);

axios.interceptors.response.use(
  (response) => {
    return response; 
  },
  async (error) => {
    const originalRequest = error.config; 
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Check if the error is a 401 and the request has not been retried yet
      // Mark the request as retried
      originalRequest._retry = true; 
      try {
        console.log("401 error received. Attempting to refresh token...");
          try {
            await refreshRequest(); 
            return await axios(originalRequest);
          } catch (error) { 
            // Emit event for token expiration
            onTokenExpired(); 
            return Promise.reject(new Error("Session expired. Please log in again."));
          } 
      } catch (e) {
        console.error("Error retrying request after refreshing token", e);
        if(e.status === 401){
          onTokenExpired(); 
        }else{
          return Promise.reject(e); 
        }
      }
    }
    return Promise.reject(error.response ?? error); 
  }
);