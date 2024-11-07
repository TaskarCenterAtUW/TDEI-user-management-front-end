import React from "react";
import { Button, Modal } from "react-bootstrap";
import style from "../../routes/Jobs/Jobs.module.css";
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
                <Modal.Title id="contained-modal-title-vcenter" style={{ fontSize: "20px", fontWeight: "bold" }}>
                    Job Request Input - {job_id}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className={style.modalBody}>
                <div className={style.requestInputContainer}>
                    {getFilteredRequestInput().length > 0 ? (
                        <table className={style.requestInputTable}>
                            <thead>
                                <tr>
                                    <th style={{ textAlign: "left", paddingRight: "10px" }}>Parameter</th>
                                    <th style={{ textAlign: "left" }}>Value</th>
                                </tr>
                            </thead>
                            <tbody>
                                {getFilteredRequestInput().map(([key, value], index) => (
                                    <tr key={index}>
                                        <td style={{ textAlign: "left", paddingRight: "5px", fontWeight: "bold" }}>{toPascalCase(key)}</td>
                                        <td style={{ textAlign: "left" }}>{value || "-"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No additional input parameters provided.</p>
                    )}
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
