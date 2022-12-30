import React from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';

const Notification = () => {
    return (
        <ToastContainer position='top-center'>
            <Toast show={true} delay={3000} autohide bg='danger'>
                <Toast.Header>
                    <strong className="me-auto">Bootstrap</strong>
                    <small>11 mins ago</small>
                </Toast.Header>
                {/* <Toast.Body>Woohoo, you're reading this text in a Toast!</Toast.Body> */}
            </Toast>
        </ToastContainer>

    )
}

export default Notification