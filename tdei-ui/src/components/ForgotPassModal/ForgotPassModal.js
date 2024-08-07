
import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Link } from "react-router-dom";

const ForgotPassModal = () => {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <div>
                Forgot Password?{" "}
                <Link className="tdei-primary-link" onClick={handleShow}>
                    Click Here
                </Link>
            </div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Forgot Password?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Please send an email with your username to : {process.env.REACT_APP_ADMIN_EMAIL} </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ForgotPassModal;
