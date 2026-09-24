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
import { isShareDatasetRoute } from "../../utils";
import {
  getSsoLoginCallbackUri,
  getSsoLogoutCallbackUri,
  SSO_API_URL,
  SSO_CLIENT_ID,
  SSO_LOGIN_CALLBACK_PATH,
  SSO_LOGOUT_CALLBACK_PATH,
} from "../../services/ssoConfig";

const SSO_RETURN_TO_KEY = "tdeiSsoReturnTo";

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [isReLoginOpen, setIsReLoginOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState({ showtoast: false, message: '', type: '' });
  const origin = location.pathname || "/";

  const isAnonymousPath = React.useCallback((pathname = "") => {
    const normalizedPath = String(pathname || "")
      .toLowerCase()
      .replace(/\/+$/, "");

    const anonymousPaths = new Set([
      "/login",
      SSO_LOGIN_CALLBACK_PATH,
      SSO_LOGOUT_CALLBACK_PATH,
      "/register",
      "/forgotpassword",
      "/passwordreset",
      "/emailverify",
      "/invite-instructions",
      "/app-link",
    ]);

    return anonymousPaths.has(normalizedPath)
      || normalizedPath.startsWith("/app-link/")
      || normalizedPath.startsWith("/login/share-dataset/")
      || normalizedPath.startsWith("/register/share-dataset/")
      || isShareDatasetRoute(normalizedPath);
  }, []);

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

    const p = location?.pathname || "/";

    // No access token
    if (!accessToken) {
      // If we had a session and we're on a protected page -> real expiry
      if (refreshToken && !isAnonymousPath(p)) {
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

    // Let the user choose whether to restore or end an expired SSO session.
    setTokenExpiredCallback(() => {
      if (sessionStorage.getItem('handoffInProgress') === '1') return;
      setIsReLoginOpen(true);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, isAnonymousPath, location?.pathname]);

  // Guard on navigation: only act on protected routes; suppress during relogin modal
  React.useEffect(() => {
    const handoffInProgress = sessionStorage.getItem('handoffInProgress') === '1';
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    const p = location?.pathname || "/";
    const onProtected = !isAnonymousPath(p);

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
  }, [isAnonymousPath, isReLoginOpen, location, navigate]);



  React.useEffect(() => {
    //----------------------------
    //Case when the page gets refreshed then we ensure that authenticated page is not displayed to the user without access token
    //----------------------------
    if (sessionStorage.getItem('handoffInProgress') === '1') return;
    const accessToken = localStorage.getItem("accessToken");
    // const relogin = localStorage.getItem("relogin");
    // Anonymous paths
    if (!accessToken && location && !isAnonymousPath(location.pathname) && location.pathname !== '/') {
      setToastMessage({
        showtoast: true,
        message: "Session expired. You have been logged out.",
        type: "warning",
      });
      // window.location.href = "/";
    }
  }, [isAnonymousPath, location]);

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
          window.location.replace("/logout/callback");
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

  const normalizeReturnTo = (returnTo) => {
    let returnPath = "/";

    if (typeof returnTo === "string") {
      returnPath = returnTo;
    } else if (returnTo?.pathname) {
      returnPath = `${returnTo.pathname}${returnTo.search || ""}${returnTo.hash || ""}`;
    }

    return returnPath.startsWith("/") && !returnPath.startsWith("//")
      ? returnPath
      : "/";
  };

  const startSsoLogin = (returnTo = "/") => {
    sessionStorage.setItem(SSO_RETURN_TO_KEY, normalizeReturnTo(returnTo));

    const ssoRedirectUrl = new URL(`${SSO_API_URL}/sso-redirect`);
    ssoRedirectUrl.searchParams.set("redirect_uri", getSsoLoginCallbackUri());

    window.location.assign(ssoRedirectUrl.toString());
  };

  const completeSsoLogin = async (callbackParameters) => {
    const { code, state } = callbackParameters;
    const clientId = callbackParameters.clientId || SSO_CLIENT_ID;

    if (!code || !state) {
      throw new Error("TDEI SSO callback is missing code or state.");
    }

    const loginRequest = { code, state };
    if (clientId) loginRequest.clientId = clientId;

    const response = await axios.post(
      `${SSO_API_URL}/sso-login`,
      loginRequest
    );

    const accessToken = response.data?.access_token;
    const refreshToken = response.data?.refresh_token;

    if (!accessToken || !refreshToken) {
      throw new Error("TDEI SSO response did not include authentication tokens.");
    }

    const tokenDetails = decodeToken(accessToken);
    if (!tokenDetails) {
      throw new Error("TDEI SSO returned an invalid or expired access token.");
    }

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("forceRefresh", Date.now().toString());
    setUserContext(tokenDetails);

    const returnTo = normalizeReturnTo(
      sessionStorage.getItem(SSO_RETURN_TO_KEY) || "/"
    );
    sessionStorage.removeItem(SSO_RETURN_TO_KEY);

    return returnTo;
  };


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
        const from = location.state?.from || "/";
        navigate(from, { replace: true });
      } else {
        signout();
      }
    } catch (err) {
      console.log(err);
      errorCallback?.(err);
    }
  };


  const beginSignout = () => {
    const logoutUrl = new URL(`${SSO_API_URL}/sso-logout`);
    logoutUrl.searchParams.set("redirect_uri", getSsoLogoutCallbackUri());
    if (SSO_CLIENT_ID) {
      logoutUrl.searchParams.set("client_id", SSO_CLIENT_ID);
    }

    window.location.assign(logoutUrl.toString());
  };

  const handleSessionRestore = () => {
    setIsReLoginOpen(false);
    startSsoLogin(location);
  };

  const handleExpiredSessionLogout = () => {
    setIsReLoginOpen(false);

    // Keep other tabs on the same origin in sync with this logout.
    localStorage.setItem("forceLogout", Date.now().toString());
    setTimeout(() => {
      localStorage.removeItem("forceLogout");
    }, 0);

    beginSignout();
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
    setUser(null);
    dispatch(clear());
    localStorage.removeItem("selectedProjectGroup"); 
    window.location.replace("/login");
  };

  const handleCloseToast = () => {
    setToastMessage({ ...toastMessage, showtoast: false });
  };

  let value = {
    user,
    signin,
    signout,
    beginSignout,
    startSsoLogin,
    completeSsoLogin,
    setIsReLoginOpen,
    isReLoginOpen,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      <ReLoginModal
        open={isReLoginOpen}
        onLogout={handleExpiredSessionLogout}
        onReLogin={handleSessionRestore}
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
