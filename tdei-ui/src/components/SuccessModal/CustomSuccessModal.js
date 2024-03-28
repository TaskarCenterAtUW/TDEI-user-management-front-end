import React from "react";
import { Modal, Button } from "react-bootstrap";
import successIcon from "../../assets/img/success-icon.svg";
import style from "./SuccessModal.module.css";

const CustomSuccessModal = (props) => {
  return (
    <div>
    <Modal
      {...props}
      size="sm"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Body>
        <div className={style.customSuccessModal}>
          <div>
            <img src={successIcon} alt="success-icon" style={{ width: '35px', height: '35px' }}/>
          </div>
          <div className={style.title}>Success!</div>
          <div className={style.customMessage}>{props.message}</div>
          <div className={style.content}>{props.content}</div>
        </div>
      </Modal.Body>
      <Modal.Footer className={style.footerStyle}>
        <Button
          onClick={props.onClick}
          variant="outline-secondary"
          className="tdei-rounded-button"
        >
          {props.btnLabel}
        </Button>
      </Modal.Footer>
    </Modal>
    </div>
  );
};

export default CustomSuccessModal;