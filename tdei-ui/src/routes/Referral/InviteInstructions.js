import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Card, Container, Row, Col, Spinner } from "react-bootstrap";
import ResponseToast from "../../components/ToastMessage/ResponseToast";
import style from "./Referral.module.css";

const isMobileLike = () => {
    const ua = navigator.userAgent || "";
    const isTouchMac = /Macintosh/i.test(ua) && navigator.maxTouchPoints > 1;
    return /Android|iPhone|iPad|iPod|IEMobile|Opera Mini/i.test(ua) || isTouchMac;
};

function openDeepLink(url, onBlocked) {
    const a = document.createElement("a");
    a.href = url;
    a.style.display = "none";
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();

    // try via iframe (works in some other browsers)
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = url;
    document.body.appendChild(iframe);

    // if the page is still visible after 1200ms, assume the app didn't open
    const timer = setTimeout(() => {
        const stillHere = !(document.hidden || document.webkitHidden);
        if (stillHere) onBlocked?.();
        cleanup();
    }, 1200);

    const cleanup = () => {
        clearTimeout(timer);
        try { iframe.remove(); } catch { }
        try { a.remove(); } catch { }
    };

    // cleanup on blur/pagehide (user likely switched to app)
    window.addEventListener("blur", cleanup, { once: true });
    window.addEventListener("pagehide", cleanup, { once: true });
}


export default function InviteInstructions() {
    const location = useLocation();
    const navigate = useNavigate();

    // Fallback data saved by Register.js (sessionStorage.setItem('inviteRegPayload', ...))
    const fallback = useMemo(() => {
        try {
            return JSON.parse(sessionStorage.getItem("inviteRegPayload") || "{}");
        } catch {
            return {};
        }
    }, []);

    const state = (location && location.state) || {};
    const instructionsUrl = state.instructions_url || fallback.instructions_url;
    const oneTimeToken = state.oneTimeToken || fallback.oneTimeToken;
    const email = state.email || fallback.email;

    const [busy, setBusy] = useState(false);
    const [toast, setToast] = useState({ show: false, msg: "", type: "success" });

    useEffect(() => {
        if (!instructionsUrl || !oneTimeToken) {
            // Missing data -> go back to register
            navigate("/register", { replace: true });
        }
    }, [instructionsUrl, oneTimeToken, navigate]);

    const handleContinue = () => {
        if (!oneTimeToken) return;

        const env =
            process.env.REACT_APP_DEEPLINK_ENV ||
            process.env.REACT_APP_ENV ||
            "dev";

        const deepLink = `avivscr://?code=${encodeURIComponent(oneTimeToken)}&env=${encodeURIComponent(env)}`;

        if (isMobileLike()) {
            setBusy(true);
            openDeepLink(deepLink, () => {
                setToast({
                    show: true,
                    msg: "If the app didn’t open, install/open the app and try again.",
                    type: "warning",
                });
                setBusy(false);
            });
            return;
        }

        // Desktop -> Workspaces FE
        const workspacesUrl =
            process.env.REACT_APP_TDEI_WORKSPACE_URL ||
            `${window.location.origin}/workspaces`;
        window.location.href = workspacesUrl;
    };

    return (
        <div className={style.inviteContainer}>
            <Container className="py-4">
                <Row className="justify-content-center align-items-center">
                    <Col lg={10} xl={9}>
                        <Card>
                            <Card.Header>
                                <h5 className="mb-0">Complete Your Setup</h5>
                            </Card.Header>
                            <Card.Body>
                                <p className="text-muted mb-3">
                                    Please review the instructions below and then click <strong>Continue</strong>.
                                </p>

                                <div className="mb-3">
                                    <small className="text-muted">Instructions URL</small>
                                    <div className="text-break">{instructionsUrl}</div>
                                </div>

                                <div
                                    style={{ border: "1px solid #e5e7eb", borderRadius: 8, overflow: "hidden" }}
                                    className="mb-3"
                                >
                                    <iframe
                                        src={instructionsUrl}
                                        title="Instructions"
                                        style={{ width: "100%", height: "50vh", border: 0 }}
                                    />
                                </div>

                                <div className="d-flex gap-2">
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
                                        ) : (
                                            "Continue"
                                        )}
                                    </Button>
                                    <Button
                                        variant="outline-secondary"
                                        className="tdei-secondary-button"
                                        onClick={() => window.open(instructionsUrl, "_blank")}
                                    >
                                        Open in New Tab
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

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
