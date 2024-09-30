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
    // if(e.status === 401){
    //   onTokenExpired(); 
    // }else{
    //   localStorage.removeItem("accessToken"); 
    //   localStorage.removeItem("refreshToken");
    //   // Reload the page to redirect the user
    //   window.location.reload(); 
    // }
    throw e; 
  } finally {
    isRefreshing = false; 
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
  (error) => Promise.reject(error.response ?? error) 
);

axios.interceptors.response.use(
  (response) => {
    return response; 
  },
  async (error) => {
    const originalRequest = error.config; 
    if (error.status === 401 && !originalRequest._retry) {
      // Check if the error is a 401 and the request has not been retried yet
      // Mark the request as retried
      originalRequest._retry = true; 
      // try {
      //   console.log("401 error received. Attempting to refresh token...");
      //     try {
      //       await refreshRequest(); 
      //       return await axios(originalRequest);
      //     } catch (error) { 
      //       // Emit event for token expiration
      //       onTokenExpired(); 
      //       return Promise.reject(new Error("Session expired. Please log in again."));
      //     } 
      // } catch (e) {
      //   console.error("Error retrying request after refreshing token", e);
      //   if(e.status === 401){
      //     onTokenExpired(); 
      //   }else{
      //     return Promise.reject(e); 
      //   }
      // }
      try {
        //refreshing the token and retrying the request
        await refreshRequest();
        return await axios(originalRequest);
      } catch (error) {
        if (error.status === 401) {
          // If token refresh also fails (another 401), trigger the re-login modal
          onTokenExpired();
        } else {
          // If it's another error, clear tokens and reload
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          window.location.reload();
        }
        return Promise.reject(error);
      }
    
    }
    return Promise.reject(error.response ?? error); 
  }
);