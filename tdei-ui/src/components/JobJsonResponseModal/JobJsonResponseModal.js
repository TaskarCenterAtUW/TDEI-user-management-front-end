import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import successIcon from "../../assets/img/success-icon.svg";
import style from "./JobJsonResponse.module.css";
import { IconButton } from "@mui/material";
import CopyToClipboard from "react-copy-to-clipboard";
import userIcon from "../../assets/img/icon-copy-id.svg";

const JobJsonResponseModal = (props) => {

  async function handleClipBoardCopy(text) {
    if ('clipboard' in navigator) {
      return await navigator.clipboard.writeText(text);
    } else {
      console.log('error in copying!');
    }
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
          <img src={successIcon} alt="success-icon" className={style.modalHeaderIcon} />
          <div className={style.title} >
            {props.title}
          </div>
          <div className={style.customMessage}>{props.message}</div>
          <div className={style.jobResponseContainer}>
            <div className={style.jobResponseHeader}>
              <div style={{ flexGrow: 1 }}>
                <div className={style.jobResponseHeaderLabel}>Response</div>
              </div>
              <CopyToClipboard text={props.content} onCopy={() => handleClipBoardCopy(props.content)}>
                <Button variant="link d-flex p-0">
                  <img src={userIcon} className={style.copyIcon} alt="Copy Id" />
                </Button>
              </CopyToClipboard>
            </div>
            <div className={style.jobResponseContainerContent}>
            <pre>{props.content}</pre>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className={style.footerStyle}>
        <Button
          onClick={props.handler}
          disabled={props.isLoading}
          variant="outline-secondary"
          className="tdei-primary-button"
        >
          {props.btnlabel}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default JobJsonResponseModal;
