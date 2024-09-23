import React, { useState, useEffect } from "react";
import { Row, Button, Card } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import style from "./style.module.css";
import ResponseToast from "../ToastMessage/ResponseToast";
import tempLogo from "./../../assets/img/tdei_logo.svg";

const EmailVerification = () => {
    const location = useLocation();
    const { heading, actionText, email, checkLink } = location.state || {};
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [maskedEmail, setMaskedEmail] = useState("");
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState("success");

    useEffect(() => {
        if (email) {
            const maskEmail = (email) => {
                const [localPart, domain] = email.split("@");
                const maskedLocal = localPart[0] + "*****";
                return `${maskedLocal}@${domain}`;
            };
            setMaskedEmail(maskEmail(email));
        }
    }, [email]);

    const handleResendEmail = async () => {
        navigate(-1);
    };
    const handleSignIn = () => {
        navigate("/login", { replace: true });
    };
    const handleCloseToast = () => {
        setShowToast(false);
    };

    return (
        <div className={style.registerContainer}>
            <Row className="justify-content-center align-items-center">
                <div className={style.registerCard}>
                    <Card>
                        <Card.Body>
                            <h2>{heading || "Reset Password Request"}</h2>
                            <p>
                                We emailed a {actionText || "password reset"} link to <b>{maskedEmail}</b>. <br />
                                Please follow the instructions in that email.
                            </p>
                            Didn’t receive an email?{"   "}
                            <Button
                                variant="link"
                                className={`${style.noPadding} ${style.tdeiBtnLink}`}
                                onClick={handleResendEmail}
                                disabled={loading}
                            >
                                {loading ? "Sending..." : "Check if your username is correct"}
                            </Button>
                            <br></br>
                            <br></br>
                            <Link className="tdei-primary-link" to={'/login'}>
                                Sign In
                            </Link>

                        </Card.Body>
                    </Card>
                </div>
            </Row>

            <ResponseToast
                showtoast={showToast}
                handleClose={handleCloseToast}
                message={toastMessage}
                type={toastType}
            />
        </div>
    );
};

export default EmailVerification;
