import React, { useState } from "react";
import { AuthContext } from "../../context";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import ReLoginModal from "../ReLoginModal/ReLoginModal";
import { setTokenExpiredCallback } from "../../services/tokenEventEmitter";
import ResponseToast from "../ToastMessage/ResponseToast";
import { clear } from "../../store";
import { useDispatch } from "react-redux";
import { useQueryClient } from "react-query";

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
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
      if (decodedToken.exp * 1000 < Date.now()) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        sessionStorage.removeItem("inviteHandoffDone");
        sessionStorage.removeItem("inviteRegPayload");
        dispatch(clear());
        return null;
      }
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


  // Init on mount: set user context or handle expired tokens; register relogin callback
  React.useEffect(() => {
    const handoffInProgress = sessionStorage.getItem('handoffInProgress') === '1';
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    const p = (location?.pathname || "/").toLowerCase();
    const anon = new Set([
      "/login",
      "/register",
      "/forgotpassword",
      "/passwordreset",
      "/emailverify",
      "/invite-instructions",
      "/app-link/",
    ]);

    // No access token
    if (!accessToken) {
      // If we had a session and we're on a protected page -> real expiry
      if (refreshToken && !anon.has(p)) {
        if (handoffInProgress) return; 
        setToastMessage({
          showtoast: true,
          message: "Session expired. You have been logged out.",
          type: "warning",
        });
        setTimeout(() => {
          signout(); // your signout navigates to /login
        }, 2000);
      }
      // If no tokens at all (first visit / anonymous), just allow public routes like /register
    } else {
      // We have an access token -> try to decode and set user
      const details = decodeToken(accessToken);
      if (details) {
        setUserContext(details);
      } else {
        // Expired/invalid token -> clear and treat as anonymous.
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        sessionStorage.removeItem("inviteHandoffDone");
        sessionStorage.removeItem("inviteRegPayload");
        dispatch(clear());
        setUser(null);
      }
    }

    // Relogin: when token-expired event fires (e.g., 401 during API), open modal.
    setTokenExpiredCallback(() => {
      if (sessionStorage.getItem('handoffInProgress') === '1') return;
      setIsReLoginOpen(true);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Guard on navigation: only act on protected routes; suppress during relogin modal
  React.useEffect(() => {
    const handoffInProgress = sessionStorage.getItem('handoffInProgress') === '1';
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    const p = (location?.pathname || "/").toLowerCase();
    const anon = new Set([
      "/login",
      "/register",
      "/forgotpassword",
      "/passwordreset",
      "/emailverify",
      "/invite-instructions",
       "/app-link/",
    ]);

    const onProtected = !anon.has(p);

    if (!accessToken && onProtected) {
      if (handoffInProgress) return;
      // If relogin modal is open, do NOTHING
      if (isReLoginOpen) return;

      if (refreshToken) {
        // Real expiry on a protected page -> show toast, send to login
        setToastMessage({
          showtoast: true,
          message: "Session expired. You have been logged out.",
          type: "warning",
        });
        navigate("/login", { replace: true, state: { from: location } });
      } else {
        // Manual logout removed refresh token → no toast, just ensure we're on /login
        navigate("/login", { replace: true });
      }
    }
  }, [location, isReLoginOpen, navigate]);



  React.useEffect(() => {
    //----------------------------
    //Case when the page gets refreshed then we ensure that authenticated page is not displayed to the user without access token
    //----------------------------
    if (sessionStorage.getItem('handoffInProgress') === '1') return;
    const accessToken = localStorage.getItem("accessToken");
    // const relogin = localStorage.getItem("relogin");
    // Anonymous paths
    const excludePaths = ["/login", "/register", "/ForgotPassword", "/passwordReset", "/emailVerify", "/invite-instructions","/app-link/"];
    if (!accessToken && location && !excludePaths.includes(location.pathname) && location.pathname !== '/') {
      setToastMessage({
        showtoast: true,
        message: "Session expired. You have been logged out.",
        type: "warning",
      });
      // window.location.href = "/";
    }
  }, [location]);

  /**
   * This function is triggered when the "tokenRefreshed" event is dispatched.
   * It forces React Query to re-fetch all queries, ensuring that the UI gets fresh data.
   */
  React.useEffect(() => {
    const handleTokenRefresh = () => {
      queryClient.invalidateQueries();
    };
    // Add event listener that listens for "tokenRefreshed" events
    window.addEventListener("tokenRefreshed", handleTokenRefresh);
    // Remove the event listener when the component unmounts
    return () => window.removeEventListener("tokenRefreshed", handleTokenRefresh);
  }, []);

  // This effect ensures that if any other tab sets the "forceRefresh" key in localStorage,
  // this tab will receive a "storage" event and immediately reload. That way, all tabs
  // stay synchronized whenever a forced refresh is triggered from elsewhere.
  React.useEffect(() => {
    function handleStorageEvent(event) {
      switch (event.key) {
        case "forceRefresh":
          window.location.reload();
          break;
        case "forceLogout":
          window.location.replace("/login");
          break;
        default:
          // do nothing
          break;
      }
    }
    window.addEventListener("storage", handleStorageEvent);
    return () => {
      window.removeEventListener("storage", handleStorageEvent);
    };
  }, []);


  const signin = async ({ username, password }, successCallback, errorCallback) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_URL}/authenticate`, { username, password });

      const accessToken = response.data.access_token;
      const refreshToken = response.data.refresh_token;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      // Force every other tab to refresh.
      localStorage.setItem("forceRefresh", Date.now().toString());

      const tokenDetails = decodeToken(accessToken);
      if (tokenDetails) {
        setUserContext(tokenDetails);
        successCallback?.(response);

        // Prefer the originally requested protected route
        const from = location.state?.from?.pathname || "/";
        navigate(from, { replace: true });
      } else {
        signout();
      }
    } catch (err) {
      console.log(err);
      errorCallback?.(err);
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
          session_timeout_login_request: true
        }
      );
      const accessToken = response.data.access_token;
      const refreshToken = response.data.refresh_token;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      // localStorage.removeItem("relogin");
      let tokenDetails = decodeToken(accessToken);
      setUserContext(tokenDetails);
      setIsReLoginOpen(false);
      /// Reloading the window after successful relogin
      window.location.reload();
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
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem("selectedProjectGroup");
    sessionStorage.removeItem('inviteHandoffDone');
    sessionStorage.removeItem('inviteRegPayload');
    sessionStorage.removeItem('promoSigninPayload');
    sessionStorage.removeItem('handoffFlow');
    sessionStorage.removeItem('handoffInProgress');
    dispatch(clear());
    setUser(null);
    navigate("/login");
  };

  const handleCloseToast = () => {
    setToastMessage({ ...toastMessage, showtoast: false });
  };

  let value = { user, signin, signout, setIsReLoginOpen, isReLoginOpen };

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