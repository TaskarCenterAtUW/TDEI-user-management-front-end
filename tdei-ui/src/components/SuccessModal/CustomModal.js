import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import successIcon from "../../assets/img/success-icon.svg";
import style from "./SuccessModal.module.css";
import ErrorIcon from '@mui/icons-material/Error';
import datasetReleaseIcon from "../../assets/img/dataset-publish-confirmation.svg";
import datasetDeleteIcon from "../../assets/img/dataset-delete-confirmation.svg";

// CustomModal component displays a modal with success or error message
const CustomModal = (props) => {
  let iconComponent;
  let titleColor;
  let contentColor;
  switch (props.modaltype) {
    case "success":
      iconComponent = <img src={successIcon} alt="success-icon" style={{ width: '35px', height: '35px' }}/>;
      titleColor = "#59C3C8";
      contentColor = '';
      break;
    case "error":
      iconComponent = <ErrorIcon style={{ fontSize: '35px', color: '#c84349' }} />;
      titleColor = "#c84349";
      contentColor = '#FFD2D4';
      break;
    case "release":
      iconComponent = <img src={datasetReleaseIcon} alt="release-icon" style={{ width: '35px', height: '35px' }}/>;
      titleColor = "#162848";
      contentColor = '';
      break;
    case "deactivate":
      iconComponent = <img src={datasetDeleteIcon} alt="deactivate-icon" style={{ width: '35px', height: '35px' }}/>;
      titleColor = "#162848";
      contentColor = '';
      break;
    default:
      iconComponent = null;
      titleColor = '#000';
      contentColor = '';
  }
  return (
      <Modal
        {...props}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={props.show}
        onHide={props.onHide}
      >
        <Modal.Body>
          <div className={style.customSuccessModal}>
          {iconComponent}
            <div className={style.title} style={{ color: titleColor }}>
            {props.title}
            </div>
            <div className={style.customMessage}>{props.message}</div>
            <div className={style.content} style={{ backgroundColor: contentColor}}>{props.content}</div>
          </div>
        </Modal.Body>
        <Modal.Footer className={props.modaltype === "success" || props.modaltype === "error" ? style.footerStyle : ''}>
        {props.modaltype !== "success" || props.modaltype !== "error" ? (
            <Button
              onClick={props.onHide}
              variant="outline-secondary"
              className="tdei-secondary-button"
              disabled={props.isLoading}
            >
              No, Cancel
            </Button>
          ) : null}
          <Button
            onClick={props.handler}
            disabled={props.isLoading}
            variant="outline-secondary"
            className={`tdei-${props.modaltype === "release" || props.modaltype === "deactivate" ? 'primary' : 'rounded'}-button ${props.modaltype === "error" ? 'maroon-bg' : ''}`}
          >
            {props.btnlabel}
          </Button>
        </Modal.Footer>
      </Modal>
  );
};

export default CustomModal;
