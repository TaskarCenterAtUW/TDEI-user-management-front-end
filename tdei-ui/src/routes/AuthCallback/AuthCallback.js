import React from "react";
import { Button, Card, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import style from "../LoginPage/style.module.css";
import tempLogo from "../../assets/img/tdei-logo.png";
import { isShareDatasetRoute } from "../../utils";
import { getReferralCodeDetails, postAssignReferralCode } from "../../services";

const SSO_CALLBACK_PARAMETERS_KEY = "tdeiSsoCallbackParameters";

const getCallbackParameters = () => {
  const callbackUrl = new URL(window.location.href);
  const queryParameters = Object.fromEntries(callbackUrl.searchParams.entries());
  const fragment = callbackUrl.hash.replace(/^#/, "");
  const fragmentQuery = fragment.includes("?")
    ? fragment.slice(fragment.indexOf("?") + 1)
    : fragment.replace(/^\?/, "");
  const fragmentParameters = Object.fromEntries(
    new URLSearchParams(fragmentQuery).entries()
  );
  const callbackParameters = {
    ...fragmentParameters,
    ...queryParameters,
  };

  if (callbackParameters.code || callbackParameters.state) {
    sessionStorage.setItem(
      SSO_CALLBACK_PARAMETERS_KEY,
      JSON.stringify(callbackParameters)
    );
    return callbackParameters;
  }

  // Restore the callback after a Safari reload.
  try {
    return JSON.parse(
      sessionStorage.getItem(SSO_CALLBACK_PARAMETERS_KEY) || "{}"
    );
  } catch {
    return {};
  }
};

const clearCallbackParameters = () => {
  sessionStorage.removeItem(SSO_CALLBACK_PARAMETERS_KEY);
  if (window.location.search || window.location.hash) {
    window.history.replaceState(
      window.history.state,
      "",
      window.location.pathname
    );
  }
};

const AuthCallback = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [error, setError] = React.useState("");
  const submitted = React.useRef(false);
  const callbackParameters = React.useRef(getCallbackParameters()).current;

  React.useEffect(() => {
    if (submitted.current) return;
    submitted.current = true;

    const finishLogin = async () => {
      try {
        const returnTo = await auth.completeSsoLogin(callbackParameters);
        clearCallbackParameters();
        const referralCode = (
          sessionStorage.getItem("referralCode") || ""
        ).trim();
        const isShareDatasetReturn = isShareDatasetRoute(returnTo);

        if (isShareDatasetReturn) {
          sessionStorage.removeItem("referralCode");
          navigate(returnTo, { replace: true });
          return;
        }

        if (referralCode) {
          // Match the referral code to the logged-in user and prepare for mobile app handoff
          await postAssignReferralCode(referralCode);
          const referralDetails = await getReferralCodeDetails(referralCode);
          const refreshToken = localStorage.getItem("refreshToken") || "";
          const instructionsUrl =
            referralDetails?.instructions_url ||
            referralDetails?.instructionsUrl ||
            "";
          const redirectUrl =
            referralDetails?.redirect_url ||
            referralDetails?.redirectUrl ||
            "";

          if (!refreshToken) {
            throw new Error("Unable to prepare the mobile app handoff.");
          }

          const handoffPayload = {
            instructions_url: instructionsUrl,
            token: refreshToken,
            redirect_url: redirectUrl,
            referral_code: referralCode,
            // Track that this token came from the active web session
            token_source: "session",
          };

          sessionStorage.removeItem("referralCode");
          // Reset previous handoff state so the continue button stays visible
          sessionStorage.removeItem("inviteHandoffDone");
          sessionStorage.removeItem("handoffInProgress");
          sessionStorage.setItem("promoSigninPayload", JSON.stringify(handoffPayload));
          sessionStorage.setItem("handoffFlow", "promo");

          navigate("/invite-instructions?flow=promo", {
            replace: true,
            state: {
              isPromo: true,
              ...handoffPayload,
            },
          });
          return;
        }

        navigate(returnTo, { replace: true });
      } catch (callbackError) {
        clearCallbackParameters();
        console.error("TDEI SSO callback failed", callbackError);
        setError(
          callbackError?.response?.data?.message ||
            callbackError?.message ||
            "Unable to complete TDEI login."
        );
      }
    };

    finishLogin();
  }, [auth, callbackParameters, navigate]);

  return (
    <div className={style.loginContainer}>
      <div className="d-flex justify-content-center align-items-center pt-5">
        <div className={style.loginCard}>
          <Card>
            <Card.Body className="text-center">
              <img src={tempLogo} className={style.loginLogo} alt="TDEI logo" />
              <h1 className={style.loginTitle}>
                {error ? "Login unsuccessful" : "Signing you in"}
              </h1>
              {error ? (
                <>
                  <p className="text-danger mt-3" role="alert">
                    {error}
                  </p>
                  <Button
                    className="tdei-primary-button mt-2"
                    onClick={() => auth.startSsoLogin("/")}
                  >
                    Try TDEI Login Again
                  </Button>
                </>
              ) : (
                <div className="mt-4" aria-live="polite">
                  <Spinner animation="border" role="status" />
                  <p className="mt-3">Completing TDEI authentication...</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AuthCallback;
