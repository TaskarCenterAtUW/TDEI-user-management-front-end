import React from "react";
import { Button, Card, Spinner } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import style from "../LoginPage/style.module.css";
import tempLogo from "../../assets/img/tdei-logo.png";
import { isShareDatasetRoute } from "../../utils";

const AuthCallback = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = React.useState("");
  const submitted = React.useRef(false);

  React.useEffect(() => {
    if (submitted.current) return;
    submitted.current = true;

    const callbackParameters = Object.fromEntries(searchParams.entries());

    if (searchParams.toString()) {
      window.history.replaceState(
        window.history.state,
        "",
        window.location.pathname
      );
    }

    const finishLogin = async () => {
      try {
        const returnTo = await auth.completeSsoLogin(callbackParameters);
        const referralCode = (
          sessionStorage.getItem("referralCode") || ""
        ).trim();
        const isShareDatasetReturn = isShareDatasetRoute(returnTo);

        if (isShareDatasetReturn) {
          sessionStorage.removeItem("referralCode");
        }

        navigate(returnTo, {
          replace: true,
          state: !isShareDatasetReturn && referralCode
            ? { loggedInReferralCode: referralCode }
            : null,
        });
      } catch (callbackError) {
        console.error("TDEI SSO callback failed", callbackError);
        setError(
          callbackError?.response?.data?.message ||
            callbackError?.message ||
            "Unable to complete TDEI login."
        );
      }
    };

    finishLogin();
  }, [auth, navigate, searchParams]);

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
