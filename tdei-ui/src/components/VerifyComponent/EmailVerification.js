import React, { useState, useEffect } from "react";
import { Row, Button, Card } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import style from "./style.module.css";
import ResponseToast from "../ToastMessage/ResponseToast";

const EmailVerification = () => {
    const location = useLocation();
    const {actionText, email } = location.state || {};
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
        try {
            setLoading(true);
            const response = await axios.post(`${process.env.REACT_APP_OSM_URL}/verify-email`, email,
                {
                    headers: {
                        "Content-Type": "text/plain",
                    },
                }
            );
            setToastMessage("Email verification link sent successfully");
            setToastType("success");
            setShowToast(true);
        } catch (error) {
            setToastMessage("Error resending link. Please try again.");
            setToastType("error");
            setShowToast(true);
        } finally {
            setLoading(false);
        }
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
                            <br />
                            <h2 className="formTitle">Email Verification</h2>
                            <br />
                            <br />
                            <p>
                            {actionText}
                            </p>
                            Didn’t receive an email?{"   "}
                            <Button
                                variant="link"
                                className={`${style.noPadding} ${style.tdeiBtnLink}`}
                                onClick={handleResendEmail}
                                disabled={loading}
                            >
                                {loading ? "Sending..." : "Resend Email Verification"}
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
