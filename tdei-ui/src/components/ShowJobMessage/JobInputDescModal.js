import React, { useEffect } from "react";
import { Button, Modal, Spinner } from "react-bootstrap";
import { IconButton } from "@mui/material";
import style from "../../routes/Jobs/Jobs.module.css";
import refreshBtn from "./../../assets/img/refreshBtn.svg";
import { toPascalCase } from "../../utils";

const JobInputDescModal = (props) => {
    const { job_id, job_type, progress, request_input } = props.message;
    const handleClose = () => {
        props.onHide();
    };

    // Function to handle nested objects and arrays
    const flattenRequestInput = (input, prefix = '') => {
        if (!input || typeof input !== 'object') return [];
        return Object.entries(input).reduce((acc, [key, value]) => {
            const newKey = prefix + key.replace(/_/g, ' ');
            if (typeof value === 'object' && !Array.isArray(value)) {
                acc.push(...flattenRequestInput(value, newKey + ' '));
            } else {
                acc.push([toPascalCase(newKey), Array.isArray(value) ? value.join(', ') : value]);
            }
            return acc;
        }, []);
    };

    const getFilteredRequestInput = () => {
        return flattenRequestInput(request_input).filter(([key]) => !key.toLowerCase().includes('user id'));
    };

    return (
        <Modal
            onHide={handleClose}
            show={props.show}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter" style={{ fontSize: "18px"}}>
                    Job Request Input
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className={style.modalBody}>
                <div className={style.jobStatusContainer}>
                    <div className={style.jobStatusHeader}>
                        <div style={{ flexGrow: 1 }}>
                            <div className={style.jobStatusHeaderLabel}>Input Parameter</div>
                            <div className={style.jobStatusHeaderValue}>JOB ID:{job_id}</div>
                        </div>
                    </div>
                    <div className={style.jobStatusContainerContent}>
                        {getFilteredRequestInput().length > 0 ? (
                            getFilteredRequestInput().map(([key, value], index) => (
                                <div className={style.jobInputDescRow} key={index}>
                                    <div className={style.jobDetailLabel}>{key}:</div>
                                    <div className={style.jobDetailValue}>{value || "-"}</div>
                                </div>
                            ))
                        ) : (
                            <p>No additional input parameters provided.</p>
                        )}
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    onClick={handleClose}
                    variant="outline-secondary"
                    className="tdei-secondary-button"
                >
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default JobInputDescModal;
