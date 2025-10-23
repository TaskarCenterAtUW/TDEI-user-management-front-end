import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Card, Container, Row, Col, Spinner, Modal } from "react-bootstrap";
import ResponseToast from "../../components/ToastMessage/ResponseToast";
import style from "./Referral.module.css";
import axios from "axios";
import ErrorIcon from "@mui/icons-material/Error";
import { SHOW_REFERRALS } from "../../utils";
import { saveAuthTokensFromPromo } from '../../utils/helper';

const isMobileUA = () =>
  /Android|iPhone|iPad|iPod|IEMobile|Opera Mini/i.test(navigator.userAgent || "");

const isIOS = () =>
  /iPad|iPhone|iPod/i.test(navigator.userAgent || "") ||
  (/Macintosh/i.test(navigator.userAgent || "") && navigator.maxTouchPoints > 1);

const hardReplace = (url) => window.location.replace(url);

const replacePathOnly = (url) => window.history.replaceState(null, "", url);

function resolveFlow(location) {
  const qs = new URLSearchParams(location?.search || "");
  const fromQuery = qs.get("flow");

  const fromState =
    location?.state?.isPromo === true
      ? "promo"
      : (location?.state && "isPromo" in location.state ? "reg" : null);

  const fromSession = sessionStorage.getItem("handoffFlow");
  const hasPromoPayload = !!sessionStorage.getItem("promoSigninPayload");
  const hasRegPayload = !!sessionStorage.getItem("inviteRegPayload");
  const inferred = hasPromoPayload ? "promo" : (hasRegPayload ? "reg" : null);

  return fromQuery || fromState || fromSession || inferred;
}

// Normalize a value across many possible keys/cases
const pick = (obj, keys, fallback = "") =>
  keys.reduce((acc, k) => (acc !== undefined && acc !== null ? acc : obj?.[k]), undefined) ?? fallback;

export default function InviteInstructions() {
  const location = useLocation();
  const navigate = useNavigate();
  const env = (process.env.REACT_APP_ENV || "dev").trim();

  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: "", type: "success" });
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [deepLinkUrl, setDeepLinkUrl] = useState("");
  const [handoffComplete, setHandoffComplete] = useState(false);
  const handoffDone = useMemo(
    () => sessionStorage.getItem("inviteHandoffDone") === "1",
    []
  );

  // Determine flow
  const flow = resolveFlow(location);
  const isPromo = flow === "promo";

  // Load fallbacks
  const regFallback = useMemo(() => {
    try { return JSON.parse(sessionStorage.getItem("inviteRegPayload") || "{}"); }
    catch { return {}; }
  }, []);

  // Promo fallback
  const promoFallback = useMemo(() => {
    try { return JSON.parse(sessionStorage.getItem("promoSigninPayload") || "{}"); }
    catch { return {}; }
  }, []);

  // Prefer location.state, then fallbacks
  const state = (location && location.state) || {};

  const instructionsUrl = isPromo
    ? pick(state, ["instructions_url", "instruction_url", "instructionsUrl"], pick(promoFallback, ["instructions_url", "instruction_url", "instructionsUrl"], ""))
    : pick(state, ["instructions_url", "instructionsUrl"], pick(regFallback, ["instructions_url", "instructionsUrl"], ""));

  const oneTimeToken = isPromo
    ? pick(state, ["token", "oneTimeToken"], pick(promoFallback, ["token", "oneTimeToken"], ""))
    : pick(state, ["oneTimeToken", "token"], pick(regFallback, ["oneTimeToken", "token"], ""));

  const redirectUrl =  pick(state, ["redirect_url", "redirectUrl", "redirection_url"], pick(promoFallback, ["redirect_url", "redirectUrl", "redirection_url"], ""))

  const promoToken = isPromo
    ? (state.token || promoFallback.token || null)
    : null;

  // Guards & redirects for missing context
  useEffect(() => {
    if (!SHOW_REFERRALS) {
      navigate("/login", { replace: true });
      return;
    }
    // Validate context presence
    const hasPromoContext = isPromo && (instructionsUrl || oneTimeToken || redirectUrl);
    const hasRegContext = !isPromo && !!oneTimeToken;

    if (!hasPromoContext && !hasRegContext) {
      const t = setTimeout(() => navigate("/login", { replace: true }), 1500);
      return () => clearTimeout(t);
    }
  }, [SHOW_REFERRALS, isPromo, instructionsUrl, oneTimeToken, redirectUrl, navigate]);

  const exchangeAndRedirectDesktop = async (token, destUrlIfAny) => {
    // Common desktop path for both flows: exchange token → store → redirect
    const resp = await axios.post(
      `${process.env.REACT_APP_OSM_URL}/refresh-token`, token,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const access = resp?.data?.access_token;
    const refresh = resp?.data?.refresh_token;
    if (!access || !refresh) throw new Error("Invalid refresh response");

    localStorage.setItem("accessToken", access);
    localStorage.setItem("refreshToken", refresh);

    // Clean up session storage
    sessionStorage.removeItem("inviteRegPayload");
    sessionStorage.removeItem("inviteHandoffDone");
    sessionStorage.removeItem("promoSigninPayload");
    sessionStorage.removeItem("handoffFlow");

    if (destUrlIfAny) {
      window.location.href = destUrlIfAny;
    } else {
      const workspacesUrl = process.env.REACT_APP_TDEI_WORKSPACE_URL || `${window.location.origin}/`;
      window.location.href = workspacesUrl;
    }
  };

  const handleContinue = async () => {
  const onMobile = isMobileUA();
  const iOS = isIOS();

  if (onMobile) sessionStorage.setItem("handoffInProgress", "1");

  // If redirect_url is present, it wins (both promo + registration)
  if (redirectUrl) {
    // If promo provided a web destination, we stay on web.

    sessionStorage.removeItem("handoffInProgress");
    sessionStorage.removeItem("promoSigninPayload");
    sessionStorage.removeItem("handoffFlow");
    return hardReplace(redirectUrl);
  }

  // No redirect_url. Choose mobile or desktop paths.
    if (onMobile) {
      // MOBILE (promo or reg) → app-link or modal
      const appLinkUrl = oneTimeToken
        ? `${window.location.origin}/app-link/?code=${encodeURIComponent(oneTimeToken)}&env=${encodeURIComponent(env)}`
        : `${window.location.origin}/app-link/?env=${encodeURIComponent(env)}`;

      if (iOS) {
        // iOS: direct to Universal Link
        sessionStorage.removeItem("promoSigninPayload");
        sessionStorage.removeItem("handoffFlow");
        sessionStorage.setItem("handoffInProgress", "1");
        replacePathOnly(appLinkUrl);
        setTimeout(() => {
          window.location.assign(appLinkUrl);
        }, 0);

        setHandoffComplete(true);
        return;
      }

    // ANDROID: replace the current history entry with /app-link, then open modal
    replacePathOnly(appLinkUrl);
    const schema = oneTimeToken
      ? `avivscr://?code=${encodeURIComponent(oneTimeToken)}&env=${encodeURIComponent(env)}`
      : `avivscr://?env=${encodeURIComponent(env)}`;

    setDeepLinkUrl(schema);
    setShowInstallModal(true);
    setHandoffComplete(true);
    return;
  }

  // DESKTOP
  // PROMO: tokens were already stored on LoginPage
  // REG: exchange the oneTimeToken and land in the portal.
  if (!isPromo) {
    setBusy(true);
    try {
      await exchangeAndRedirectDesktop(oneTimeToken, process.env.REACT_APP_TDEI_WORKSPACE_URL || "");
    } catch (err) {
      sessionStorage.removeItem("handoffInProgress");
      setBusy(false);
      setToast({
        show: true,
        type: "error",
        msg: err?.response?.data ?? err.message ?? "Failed to complete setup",
      });
    }
  } else {
    // Promo desktop, no redirect_url → go to workspace/home
    sessionStorage.removeItem("promoSigninPayload");
    sessionStorage.removeItem("handoffFlow");
    sessionStorage.removeItem("handoffInProgress");
    const workspacesUrl = process.env.REACT_APP_TDEI_WORKSPACE_URL || `${window.location.origin}/`;
    hardReplace(workspacesUrl);
  }
};

  const handleModalAction = () => {
    setShowInstallModal(false);
    setBusy(false);
    setHandoffComplete(true);
  };

useEffect(() => {
  if (sessionStorage.getItem('handoffInProgress') !== '1') return;
  const clearHandoff = () => {
    sessionStorage.removeItem('handoffInProgress');
  };
  const onVisibility = () => {
    if (!document.hidden) clearHandoff();
  };
  window.addEventListener('focus', clearHandoff);
  document.addEventListener('visibilitychange', onVisibility);
  return () => {
    window.removeEventListener('focus', clearHandoff);
    document.removeEventListener('visibilitychange', onVisibility);
  };
}, []);


  if (!SHOW_REFERRALS) return null;

  // Fallback error card when context is missing
  const noContext = isPromo
    ? !(instructionsUrl || oneTimeToken || redirectUrl)
    : !oneTimeToken;

  if (noContext) {
    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col sm={11} md={9} lg={7} xl={6}>
            <Card className="shadow-sm">
              <Card.Body className="text-center p-4">
                <div className="mb-3">
                  <div
                    className="d-inline-flex align-items-center justify-content-center rounded-circle"
                    style={{ width: 56, height: 56, background: "#f3f4f6" }}
                  >
                    <ErrorIcon style={{ color: "#DC2626" }} fontSize="medium" />
                  </div>
                </div>
                <h5 className="mb-2">This page needs your context</h5>
                <p className="text-muted mb-4">
                  We couldn’t find the necessary handoff details. You can continue to login or start a fresh registration.
                </p>
                <div className="d-flex flex-wrap gap-2 justify-content-center">
                  <Button className="tdei-primary-button" onClick={() => navigate("/login", { replace: true })}>
                    Go to Login
                  </Button>
                  <Button variant="outline-secondary" className="tdei-secondary-button" onClick={() => navigate("/register", { replace: true })}>
                    Start Over
                  </Button>
                </div>
                <div className="text-muted mt-3" style={{ fontSize: 12 }}>
                  Redirecting to login shortly…
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <div className={style.inviteContainer}>
      <Container className="py-4">
        <Row className="justify-content-center align-items-center">
          <Col lg={10} xl={9}>
            <Card>
              <Card.Header>
                <h5 className="mb-0">{isPromo ? "Sign-In Complete" : "Registration Complete"}</h5>
              </Card.Header>
              <Card.Body>
                <p className="text-muted mb-3">
                  {instructionsUrl
                    ? <>Please review the instructions below and then click <strong>Continue</strong>.</>
                    : <>Click <strong>Continue</strong> to proceed.</>}
                </p>

                {instructionsUrl && (
                  <iframe
                    src={instructionsUrl}
                    title="Instructions"
                    style={{ width: "100%", height: "60vh", border: "1px solid #e5e7eb", borderRadius: 8 }}
                  />
                )}

                <div className="d-flex gap-2 mt-3">
                  {!handoffDone && !handoffComplete ? (
                    <>
                      <Button
                        className="tdei-primary-button"
                        onClick={handleContinue}
                        disabled={busy}
                      >
                        {busy ? (
                          <>
                            <Spinner size="sm" animation="border" className="me-2" />
                            Processing…
                          </>
                        ) : "Continue"}
                      </Button>
                      {instructionsUrl && (
                        <Button
                          variant="outline-secondary"
                          className="tdei-secondary-button"
                          onClick={() => window.open(instructionsUrl, "_blank")}
                        >
                          Open in New Tab
                        </Button>
                      )}
                    </>
                  ) : (
                    // Only show the mobile “action required” message for reg flow
                    !isPromo && (
                      <div className="alert alert-success" role="alert">
                        <strong>Action Required on Mobile.</strong> You can now continue in the app or close this window.
                      </div>
                    )
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Android deep-link modal (registration and promo on Android) */}
        {isMobileUA() && !isIOS() && (
          <Modal show={showInstallModal} onHide={() => setShowInstallModal(false)} centered>
            <Modal.Header closeButton>
              <Modal.Title>Continue in the App</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p className="mb-3">
                Your setup is complete. Open the app to continue, or install it if you haven't already.
              </p>
              <div className="d-flex flex-column gap-2">
                <Button
                  className="tdei-primary-button"
                  onClick={() => {
                    window.location.href = deepLinkUrl;
                    setShowInstallModal(false);
                    handleModalAction();
                    sessionStorage.setItem("inviteHandoffDone", "1");
                    sessionStorage.setItem("handoffInProgress", "1");
                  }}
                >
                  Open App
                </Button>
                <Button
                  variant="outline-secondary"
                  className="tdei-secondary-button"
                  as="a"
                  href={process.env.REACT_APP_ANDROID_INSTALL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Install Android App
                </Button>
              </div>
            </Modal.Body>
          </Modal>
        )}

        <ResponseToast
          showtoast={toast.show}
          handleClose={() => setToast({ ...toast, show: false })}
          message={toast.msg}
          type={toast.type}
        />
      </Container>
    </div>
  );
}
