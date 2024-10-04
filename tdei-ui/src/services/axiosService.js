import axios from "axios";
import { url, osmUrl } from "./apiServices";
import { onTokenExpired } from "./tokenEventEmitter";
let isRefreshing = false;

function getRefreshToken() {
  const token = localStorage.getItem("refreshToken");
  if (token && token !== "undefined")
    return token;
  else
    return undefined;
}
/**
 * Function to refresh the access token using the refresh token.
 */
async function refreshRequest(originalRequest) {
  // To prevent multiple refresh attempts
  if (isRefreshing) return;

  isRefreshing = true;
  try {
    const token = localStorage.getItem("refreshToken");
    // if (!token) {
    let data = { refresh_token: token };
    // let info = {};
    // if (originalRequest.session_timeout_login) {
    //   info.session_timeout_login = originalRequest.session_timeout_login;
    // }
    // if (originalRequest._retry) {
    //   info._retry = originalRequest._retry;
    // }
    // console.log("Attempting to refresh token...");
    // const response = await axios({
    //   url: `${osmUrl}/refresh-token`,
    //   method: "POST",
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   data
    // });

    const response = await axios.post(
      `${osmUrl}/refresh-token`,
      token,
      {
        headers: {
          "Content-Type": "application/json",
        },
        session_timeout_login: originalRequest.session_timeout_login ?? false,
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
        if (refreshError.status === 401 || refreshError.response?.status === 401) {
          console.log("Token refresh failed (401), triggering the re-login modal");
          if (originalRequest.session_timeout_login != undefined && originalRequest.session_timeout_login) {
            return Promise.reject(error);
          }
          else {
            onTokenExpired();
          }
        } else {
          // If it's a different error (not related to token refresh), remove tokens and reload the page
          console.log("Non-401 error while refreshing token, session expiry token removal");
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          window.location.reload();
        }
      }
    } else if ((error.status === 401 || error.response?.status === 401) && originalRequest._retry) {
      // If refreshing the token also fails with a 401, trigger the re-login modal
      if (error.status === 401 || error.response?.status === 401) {
        console.log("Token refresh failed (401), triggering the re-login modal");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        if (originalRequest.session_timeout_login != undefined && originalRequest.session_timeout_login) {
          return Promise.reject(error);
        }
        else {
          onTokenExpired();
        }
      } else {
        // If it's a different error (not related to token refresh), remove tokens and reload the page
        console.log("Non-401 error while refreshing token, session expiry token removal");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.reload();
      }
    } else {
      // If it's a non-401 error, throw the error as-is
      return Promise.reject(error);
    }
    // Final fallback in case of unhandled errors
    return Promise.reject(error);
  }
);