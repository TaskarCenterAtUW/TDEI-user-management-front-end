
import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Link } from "react-router-dom";

const ForgotPassModal = (props) => {
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
                    <p>Please send an email with your username to:{" "}  
                    <a 
                        href={`mailto:${process.env.REACT_APP_ADMIN_EMAIL}?subject=TDEI%20password%20reset%20request&body=Dear%20Admin%2C%0D%0A%0D%0ARequest%20to%20reset%20my%20TDEI%20portal%20password%20for%20the%20email%20id%20%3A%20${props.email === "" ? "{email_id}" : props.email} `}>
                        {process.env.REACT_APP_ADMIN_EMAIL}
                    </a>
                    </p>
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
