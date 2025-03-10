import axios from "axios";
import { url, osmUrl } from "./apiServices";
import { onTokenExpired } from "./tokenEventEmitter";
let isRefreshing = false;

/**
 * Function to refresh the access token using the refresh token.
 */
async function refreshRequest(originalRequest) {
  // To prevent multiple refresh attempts
  if (isRefreshing) return;

  isRefreshing = true;
  try {
    const token = localStorage.getItem("refreshToken");
    const response = await axios.post(
      `${osmUrl}/refresh-token`,
      token,
      {
        headers: {
          "Content-Type": "application/json",
        },
        session_timeout_login_request: originalRequest.session_timeout_login_request ?? false,
        _retry: originalRequest._retry ?? false
      }
    );

    const { access_token, refresh_token } = response.data;
    localStorage.setItem("accessToken", access_token);
    localStorage.setItem("refreshToken", refresh_token);
    console.log("Token refreshed successfully");
    // Return new access token to use it for retrying
    return access_token;
    // }
  } catch (error) {
    console.error("Error refreshing token", error);
    // Let the error be caught in the response interceptor
    throw error;
  } finally {
    console.log("Token refreshing finally");
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
    // If the response is successful, just return it
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Check if the error is 401 and the request hasn't been retried
    if ((error.status === 401 || error.response?.status === 401) && !originalRequest._retry) {
      //----------------------------
      // Case when  access token is expired
      //--------------------------
      // Mark the request as retried
      originalRequest._retry = true;

      try {
        console.log("401 error received. Attempting to refresh token...");
        // Attempt to refresh the token

        const newAccessToken = await refreshRequest(originalRequest);
        if (newAccessToken) {
          // Set the new token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          // Retry the original request
          return await axios(originalRequest);
        }

      } catch (refreshError) {
        // If refreshing the token also fails with a 401, trigger the re-login modal
        console.log(originalRequest)
        if ((refreshError.status === 401 || refreshError.response?.status === 401) && originalRequest.url.indexOf("/authenticate") === -1 && window.location.pathname.indexOf("/login") === -1) {
          console.log("Token refresh failed (401), triggering the re-login modal");
          if (originalRequest.session_timeout_login_request != undefined && originalRequest.session_timeout_login_request) {
            return Promise.reject(error);
          }
          else {
            onTokenExpired();
          }
        } else {
          //----------------------------
          //Case when bad request is made after refresh token
          //----------------------------
          return Promise.reject(refreshError);
        }
      }
    } else if ((error.status === 401 || error.response?.status === 401) && originalRequest._retry && originalRequest.url.indexOf("/authenticate") == -1 && window.location.pathname.indexOf("/login") === -1) {
      //----------------------------
      //Case when both access token and refresh token are expired
      //----------------------------

      // If refreshing the token also fails with a 401, trigger the re-login modal
      //----------------------------
      //Removing local storage items so that when user refreshes or clicks on back button, user will be logged out
      //----------------------------
      localStorage.removeItem("accessToken");
      // localStorage.removeItem("refreshToken");
      localStorage.removeItem("selectedProjectGroup");
      if (originalRequest.session_timeout_login_request != undefined && originalRequest.session_timeout_login_request) {
        //----------------------------
        //Case when re login fails on session timeout popup
        //----------------------------
        return Promise.reject(error);
      }
      else {
        //----------------------------
        //Case when both access token and refresh token are expired
        //----------------------------
        console.log("Token refresh failed (401), triggering the re-login modal");
        onTokenExpired();
      }
    } else {
      // If it's a non-401 error, throw the error as-is
      return Promise.reject(error);
    }
    // Final fallback in case of unhandled errors
    return Promise.reject(error);
  }
);