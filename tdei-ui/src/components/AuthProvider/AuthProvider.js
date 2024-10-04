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
      return decodedToken;
    } catch (error) {
      console.error("Failed to decode token:", error);
    }
  };

  const setUserContext = (tokenDetails) => {
    const userObj = {
      name:
        tokenDetails.name ||
        tokenDetails.email ||
        tokenDetails.preferred_username,
      roles: tokenDetails.realm_access.roles,
      isAdmin: tokenDetails.realm_access.roles?.includes("tdei-admin"),
      userId: tokenDetails.sub,
      emailId: tokenDetails.preferred_username,
    };
    setUser(userObj);
  };


  React.useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      setToastMessage({
        showtoast: true,
        message: "Session expired. You have been logged out.",
        type: "warning",
      });
      setTimeout(() => {
        signout();
      }, 2000);
    }
    else {
      let tokenDetails = decodeToken(accessToken);
      setUserContext(tokenDetails);
    }
    // Register the token expired event handler
    setTokenExpiredCallback(() => {
      setIsReLoginOpen(true);
    });
  }, []);

  React.useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    // anonymous paths
    const excludePaths = ["/login", "/register", "/ForgotPassword", "/passwordReset", "/emailVerify"];
    if (!accessToken && !excludePaths.includes(location.pathname)) {
      setToastMessage({
        showtoast: true,
        message: "Session expired. You have been logged out.",
        type: "warning",
      });
      window.location.href = "/login";
    }
  }, [location]);

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

      let tokenDetails = decodeToken(accessToken);
      setUserContext(tokenDetails);
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
        { username: email, password },
        {
          session_timeout_login: true
        }
      );
      const accessToken = response.data.access_token;
      const refreshToken = response.data.refresh_token;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      let tokenDetails = decodeToken(accessToken);
      setUserContext(tokenDetails);
      setIsReLoginOpen(false);
    } catch (err) {
      console.error("Re-login failed", err);
      setToastMessage({
        showtoast: true,
        message: "Error while trying to re-login. Please verify your credentials and try again!",
        type: "warning",
      });
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