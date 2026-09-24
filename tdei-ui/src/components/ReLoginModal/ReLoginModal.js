import React from "react";
import { Button, Modal } from "react-bootstrap";
import style from "./ReLoginModal.module.css";

const ReLoginModal = ({ open, onLogout, onReLogin }) => {
  return (
    <Modal
      show={open}
      centered
      backdrop="static"
      keyboard={false}
      style={{ zIndex: 1100 }}
      enforceFocus
      autoFocus
      aria-labelledby="session-expired-title"
    >
      <Modal.Header>
        <Modal.Title as="h2" id="session-expired-title">
          Session Expired
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className={style.disclaimer}>
          Your TDEI session has expired. Sign in again to continue where you
          left off.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button
          type="button"
          variant="link"
          className="tdei-primary-link"
          onClick={onLogout}
        >
          Logout
        </Button>
        <Button
          type="button"
          variant="primary"
          className="tdei-primary-button"
          onClick={onReLogin}
        >
          TDEI Login
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ReLoginModal;
