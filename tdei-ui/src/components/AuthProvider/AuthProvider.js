import React, { useState } from "react";
import { AuthContext } from "../../context";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import ReLoginModal from "../ReLoginModal/ReLoginModal";
import { setTokenExpiredCallback } from "../../services/tokenEventEmitter";
import ResponseToast from "../ToastMessage/ResponseToast";

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [isReLoginOpen, setIsReLoginOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState({ showtoast: false, message: '', type: '' }); 
  const origin = location.pathname || "/";

  const decodeToken = (accessToken) => {
    if (accessToken === "undefined" || !accessToken) return;
    try {
      const base64Url = accessToken.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const decodedToken = JSON.parse(window.atob(base64));
      // Check if the token is expired
      const currentTime = Math.floor(Date.now() / 1000);
      if (decodedToken.exp < currentTime) {
        // Show a toast message for token expiration
        setToastMessage({
          showtoast: true,
          message: "Session expired. You have been logged out.",
          type: "warning",
        });
        setTimeout(() => {
          signout(); 
        }, 2000); 
        return;
      }
      const userObj = {
        name:
          decodedToken.name ||
          decodedToken.email ||
          decodedToken.preferred_username,
        roles: decodedToken.realm_access.roles,
        isAdmin: decodedToken.realm_access.roles?.includes("tdei-admin"),
        userId: decodedToken.sub,
        emailId: decodedToken.preferred_username,
      };
      setUser(userObj);
    } catch (error) {
      console.error("Failed to decode token:", error);
      setUser(null);
    }
  };

  React.useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    decodeToken(accessToken);
    // Register the token expired event handler
    setTokenExpiredCallback(() => {
      setIsReLoginOpen(true);
    });
  }, []);

  const signin = async (
    { username, password },
    successCallback,
    errorCallback
  ) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_URL}/authenticate`,
        {
          username,
          password,
        }
      );
      const accessToken = response.data.access_token;
      const refreshToken = response.data.refresh_token;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      decodeToken(accessToken);
      successCallback(response);
      navigate(origin);
    } catch (err) {
      console.log(err);
      errorCallback(err);
    }
  };

  const handleReLogin = async (password) => {
    const email = user?.emailId; 
    if (!email) return;

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_URL}/authenticate`,
        { username: email, password }
      );
      const accessToken = response.data.access_token;
      const refreshToken = response.data.refresh_token;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      decodeToken(accessToken);
      setIsReLoginOpen(false);  
    } catch (err) {
      console.error("Re-login failed", err);
    }
  };

  const signout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
    navigate("/login");
  };

  const handleCloseToast = () => {
    setToastMessage({ ...toastMessage, showtoast: false });
  };

  let value = { user, signin, signout, setIsReLoginOpen };
  

  return (
    <AuthContext.Provider value={value}>
      {children}
      <ReLoginModal
        open={isReLoginOpen}
        onClose={() => setIsReLoginOpen(false)}
        onReLogin={handleReLogin}
        email={user?.emailId}
      />
      <ResponseToast
        showtoast={toastMessage.showtoast}
        handleClose={handleCloseToast}
        type={toastMessage.type}
        message={toastMessage.message}
      />
    </AuthContext.Provider>
  );
};

export default AuthProvider;