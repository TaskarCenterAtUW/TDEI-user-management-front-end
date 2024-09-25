import React from "react";
import { AuthContext } from "../../context";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import ReLoginModal from "../ReLoginModal/ReLoginModal"; 
import { setTokenExpiredCallback } from "../../services/tokenEventEmitter";


const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = React.useState(null);
  const [isReLoginOpen, setIsReLoginOpen] = React.useState(false); 
  const origin = location.pathname || "/";

  const decodeToken = (accessToken) => {
    if (accessToken === "undefined" || !accessToken) return;
    try {
      const base64Url = accessToken.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const decodedToken = JSON.parse(window.atob(base64));
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

  // Re-login mechanism
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
    </AuthContext.Provider>
  );
};

export default AuthProvider;