import React, { useState } from 'react';
import { Toast } from 'react-bootstrap';

const ToastMessage = ({ showToast, toastMessage, onClose, isSuccess }) => {
  return (
    <Toast show={showToast} onClose={onClose} delay={3000} autohide style={{
        position: 'fixed',
        top: '50px', 
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        backgroundColor:"white"
      }}>
      <Toast.Header closeButton={false} style={{ borderBottom: 'none', backgroundColor: isSuccess ? "green": "#c84349" , height: '30px'}}>
      <button type="button" className="ms-auto btn-close" data-bs-dismiss="toast" aria-label="Close"onClick={() => onClose}></button>
      </Toast.Header>
      <Toast.Body>{toastMessage}</Toast.Body>
    </Toast>
  );
};
export default ToastMessage;