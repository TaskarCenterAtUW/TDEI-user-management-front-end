import React from "react";
import { Button, Modal } from "react-bootstrap";
import deleteIcon from "../../assets/img/icon-warning.svg";
import style from "./DeleteModal.module.css";

const DeleteModal = (props) => {
  return (
    <Modal
      onHide={props.onHide}
      show={props.show}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Body>
        <div className={style.deleteModal}>
          <div className="mb-2">
            <img src={deleteIcon} alt="delete-icon" />
          </div>
          <div className={style.title}>{props.message.title}</div>
          <div className={style.message}>{props.message.details}</div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          onClick={props.onHide}
          variant="outline-secondary"
          className="tdei-secondary-button"
          disabled={props.isLoading}
        >
          No, Cancel
        </Button>
        <Button
          variant="danger"
          onClick={props.handler}
          disabled={props.isLoading}
        >
          { props.message.title === "Revoke Permissions" ? props.isLoading ? "Revoking" : "Revoke" : props.isLoading ? "Deleting" : "Delete"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteModal;
