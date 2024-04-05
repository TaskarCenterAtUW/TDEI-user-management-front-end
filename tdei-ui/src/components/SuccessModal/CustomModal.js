import React from "react";
import { Modal, Button } from "react-bootstrap";
import successIcon from "../../assets/img/success-icon.svg";
import style from "./SuccessModal.module.css";
import ErrorIcon from '@mui/icons-material/Error';

// CustomModal component displays a modal with success or error message
const CustomModal = (props) => {
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
            {props.isSuccess ? (
              <img src={successIcon} alt="success-icon" style={{ width: '35px', height: '35px' }}/>
            ) : (
              <ErrorIcon style={{ fontSize: '35px', color: '#c84349' }} />
            )}
            <div className={style.title} style={{ color: props.isSuccess ? 'green' : '#c84349' }}>
              {props.isSuccess ? 'Success!' : 'Error'}
            </div>
            <div className={style.customMessage}>{props.message}</div>
            <div className={style.content} style={{ backgroundColor: props.isSuccess ? '' : '#FFD2D4' }}>{props.content}</div>
          </div>
        </Modal.Body>
        <Modal.Footer className={style.footerStyle}>
          <Button
            onClick={props.onClick}
            variant="outline-secondary"
            className={`tdei-rounded-button ${!props.isSuccess ? 'maroon-bg' : ''}`}
          >
            {props.btnlabel}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CustomModal;
