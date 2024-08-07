import React from "react";
import { Modal, Button } from "react-bootstrap";
import successIcon from "../../assets/img/success-icon.svg";
import style from "./SuccessModal.module.css";

const SuccessModal = (props) => {
  return (
    <Modal
      {...props}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Body>
        <div className={style.successModal}>
          <div>
            <img src={successIcon} alt="success-icon" />
          </div>
          <div className={style.title}>Success!</div>
          <div className={style.message}>{props.message}</div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          onClick={props.onHide}
          variant="outline-secondary"
          className="tdei-secondary-button"
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SuccessModal;
