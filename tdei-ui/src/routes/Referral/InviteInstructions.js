import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Card, Container, Row, Col, Spinner, Modal } from "react-bootstrap";
import ResponseToast from "../../components/ToastMessage/ResponseToast";
import style from "./Referral.module.css";
import axios from "axios";

const isMobileUA = () =>
    /Android|iPhone|iPad|iPod|IEMobile|Opera Mini/i.test(navigator.userAgent || "");

const isIOS = () =>
    /iPad|iPhone|iPod/i.test(navigator.userAgent || "") ||
    (/Macintosh/i.test(navigator.userAgent || "") && navigator.maxTouchPoints > 1);

export default function InviteInstructions() {
    const location = useLocation();
    const navigate = useNavigate();
    const env = (process.env.REACT_APP_ENV || "dev").trim();

    const [busy, setBusy] = useState(false);
    const [toast, setToast] = useState({ show: false, msg: "", type: "success" });
    const [showInstallModal, setShowInstallModal] = useState(false);
    const [deepLinkUrl, setDeepLinkUrl] = useState("");
    const [handoffComplete, setHandoffComplete] = useState(false);

    // Fallback data saved by Register.js
    const fallback = useMemo(() => {
        try { return JSON.parse(sessionStorage.getItem("inviteRegPayload") || "{}"); }
        catch { return {}; }
    }, []);

    const state = (location && location.state) || {};
    const instructionsUrl =
        state.instructionsUrl || state.instructions_url || fallback.instructionsUrl || fallback.instructions_url || "";
    const oneTimeToken =
        state.oneTimeToken || fallback.oneTimeToken || "";

    useEffect(() => {
        if (!oneTimeToken) {
            sessionStorage.removeItem("inviteRegPayload");
            navigate("/login", { replace: true });
        }
    }, [oneTimeToken, navigate]);

    const handleContinue = async () => {
        if (!oneTimeToken) return;
        setBusy(true);
        try {
            const resp = await axios.post(
                `${process.env.REACT_APP_URL}/refresh-token`,
                "",
                { headers: { accept: "application/json", refresh_token: oneTimeToken } }
            );
            const access = resp?.data?.access_token;
            const refresh = resp?.data?.refresh_token;
            if (!access || !refresh) throw new Error("Invalid refresh response");
            localStorage.setItem("accessToken", access);
            localStorage.setItem("refreshToken", refresh);
            sessionStorage.removeItem("inviteRegPayload");

            if (isMobileUA()) {
                const deeplink = `avivscr://?code=${encodeURIComponent(refresh)}&env=${encodeURIComponent(env)}`;
                setDeepLinkUrl(deeplink);
                setShowInstallModal(true);
            } else {
                // desktop redirect to Workspaces FE
                const workspacesUrl =
                    process.env.REACT_APP_TDEI_WORKSPACE_URL;
                window.location.href = workspacesUrl;
            }
        } catch (err) {
            setBusy(false);
            setToast({
                show: true,
                type: "error",
                msg: err?.response?.data ?? err.message ?? "Failed to complete setup",
            });
        }
    };
     const handleModalAction = () => {
        setShowInstallModal(false);
        setBusy(false);
        setHandoffComplete(true);
    };
    return (
        <div className={style.inviteContainer}>
            <Container className="py-4">
                <Row className="justify-content-center align-items-center">
                    <Col lg={10} xl={9}>
                        <Card>
                            <Card.Header>
                                <h5 className="mb-0">Registration Complete</h5>
                            </Card.Header>
                            <Card.Body>
                                <p className="text-muted mb-3">
                                    {instructionsUrl
                                        ? <>Please review the instructions below and then click <strong>Continue</strong>.</>
                                        : <>No additional instructions were provided. Click <strong>Continue</strong> to proceed.</>}
                                </p>
                                {instructionsUrl && (
                                    <iframe
                                        src={instructionsUrl}
                                        title="Instructions"
                                        style={{ width: "100%", height: "60vh", border: "1px solid #e5e7eb", borderRadius: 8 }}
                                    />
                                )}

                                <div className="d-flex gap-2 mt-3">
                             {!handoffComplete ? (
                                        <>
                                            <Button
                                                className="tdei-primary-button"
                                                onClick={handleContinue}
                                                disabled={busy}
                                            >
                                                {busy ? (
                                                    <><Spinner size="sm" animation="border" className="me-2" />Processing…</>
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
                                        <div className="alert alert-success" role="alert">
                                            <strong>Action Required on Mobile.</strong> You can now continue in the app or close this window.
                                        </div>
                                    )}
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
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
                                }}
                            >
                                Open App
                            </Button>
                            <Button
                                variant="outline-secondary"
                                className="tdei-secondary-button"
                                as="a"
                                href={isIOS()
                                    ? process.env.REACT_APP_IOS_INSTALL_URL
                                    : process.env.REACT_APP_ANDROID_INSTALL_URL
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {isIOS() ? "Install iOS App (TestFlight)" : "Install Android App"}
                            </Button>
                        </div>
                    </Modal.Body>
                </Modal>
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
