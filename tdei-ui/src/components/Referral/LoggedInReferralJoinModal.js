import React from "react";
import { Alert, Button, Modal, Spinner } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import useApplyReferralCode from "../../hooks/referrals/useApplyReferralCode";
import useReferralCodeLookup from "../../hooks/referrals/useReferralCodeLookup";
import { show } from "../../store/notification.slice";

function getJoinFailureMessage(err) {
  return (
    err?.response?.data?.message ||
    err?.message ||
    err?.response?.data ||
    "Failed to join with referral code."
  );
}

function toCurrentRoute(location) {
  return {
    pathname: location.pathname,
    search: location.search,
  };
}

export default function LoggedInReferralJoinModal() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeReferralCode, setActiveReferralCode] = React.useState("");

  React.useEffect(() => {
    const referralCode = (location.state?.loggedInReferralCode || "").trim();
    if (!referralCode) return;

    setActiveReferralCode((currentCode) => currentCode || referralCode);

    const nextState = { ...(location.state || {}) };
    delete nextState.loggedInReferralCode;

    navigate(
      {
        pathname: location.pathname,
        search: location.search,
      },
      {
        replace: true,
        state: Object.keys(nextState).length ? nextState : null,
      }
    );
  }, [location.pathname, location.search, location.state, navigate]);

  const fallbackTo = toCurrentRoute(location);
  const referralCode = activeReferralCode;
  const {
    details,
    error,
    isLoading,
    isInvalid,
    message,
  } = useReferralCodeLookup(referralCode);

  const handleClose = React.useCallback(() => {
    sessionStorage.removeItem("referralCode");
    setActiveReferralCode("");
    navigate(fallbackTo, { replace: true });
  }, [fallbackTo, navigate]);

  const { mutate: applyReferralCode, isLoading: isApplying } = useApplyReferralCode({
    onSuccess: () => {
      sessionStorage.removeItem("referralCode");
      setActiveReferralCode("");
      dispatch(show({
        type: "success",
        message: "Referral code applied successfully. You can now switch to the joined project group.",
      }));
      navigate("/projectGroupSwitch", { replace: true, state: { from: fallbackTo } });
    },
    onError: (err) => {
      sessionStorage.removeItem("referralCode");
      setActiveReferralCode("");
      dispatch(show({ type: "danger", message: getJoinFailureMessage(err) }));
      navigate(fallbackTo, { replace: true });
    },
  });

  const handleConfirmJoin = React.useCallback(() => {
    applyReferralCode(referralCode);
  }, [applyReferralCode, referralCode]);

  if (!referralCode) return null;

  return (
    <Modal
      show
      centered
      onHide={() => {
        if (!isApplying) handleClose();
      }}
    >
      <Modal.Header closeButton={!isApplying}>
        <Modal.Title>{isInvalid ? "Referral Unavailable" : "Join With Referral Code"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isInvalid ? (
          <Alert className="mb-0" variant="warning">
            {message}
          </Alert>
        ) : (
          <p className="mb-3">
          Review the referral details and confirm if you want to continue.
          </p>
        )}

        <div className={isInvalid ? "mt-3 mb-0" : "mb-2"}>
          <strong>Referral Code:</strong> {String(referralCode).toUpperCase()}
        </div>

        {details?.name ? (
          <div className="mb-2">
            <strong>Referral Name:</strong> {details.name}
          </div>
        ) : null}

        {details?.type ? (
          <div className="mb-0">
            <strong>Referral Type:</strong> {details.type === 1 ? "Campaign" : "Invite"}
          </div>
        ) : null}

        {isLoading && !isInvalid ? (
          <div className="d-flex align-items-center gap-2 mt-3 text-muted">
            <Spinner animation="border" size="sm" role="status" />
            <span>Loading referral details...</span>
          </div>
        ) : null}

        {error && !isInvalid ? (
          <Alert className="mt-3 mb-0" variant="warning">
            {message}
          </Alert>
        ) : null}
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="outline-secondary"
          className="tdei-secondary-button"
          onClick={handleClose}
          disabled={isApplying}
        >
          {isInvalid ? "Close" : "Cancel"}
        </Button>
        {!isInvalid ? (
          <Button
            className="tdei-primary-button"
            onClick={handleConfirmJoin}
            disabled={isApplying || isLoading || !!error}
          >
            {isApplying ? <Spinner size="sm" /> : "Continue"}
          </Button>
        ) : null}
      </Modal.Footer>
    </Modal>
  );
}
