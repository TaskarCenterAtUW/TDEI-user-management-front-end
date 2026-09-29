import React from "react";
import { Button, Modal } from "react-bootstrap";
import style from "../../routes/Jobs/Jobs.module.css";
import { toPascalCase } from "../../utils";

const JobInputDescModal = (props) => {
    const { job_id, request_input } = props.message;
    const handleClose = () => {
        props.onHide();
    };

    // Function to handle nested objects and arrays
    const flattenRequestInput = (input, prefix = '') => {
        if (!input || typeof input !== 'object') return [];
        return Object.entries(input).reduce((acc, [key, value]) => {
            const newKey = prefix + key.replace(/_/g, ' ');
            if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
                acc.push(...flattenRequestInput(value, newKey + ' '));
            } else {
                acc.push([toPascalCase(newKey), value]);
            }
            return acc;
        }, []);
    };

    const formatRequestValue = (value) => {
        if (value === null || value === undefined || value === '') return '-';

        if (Array.isArray(value)) {
            if (value.length === 0) return '[]';
            const containsStructuredValue = value.some(
                (item) => item !== null && typeof item === 'object'
            );
            return containsStructuredValue
                ? JSON.stringify(value, null, 2)
                : value.map((item) => String(item)).join(', ');
        }

        return String(value);
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
                <Modal.Title as="h4" id="contained-modal-title-vcenter">
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
                            getFilteredRequestInput().map(([key, value], index) => {
                                const formattedValue = formatRequestValue(value);
                                const isStructuredValue = Array.isArray(value)
                                    && value.some((item) => item !== null && typeof item === 'object');

                                return (
                                    <div className={style.jobInputDescRow} key={index}>
                                        <div className={style.jobDetailLabel}>{key}:</div>
                                        {isStructuredValue ? (
                                            <pre className={style.jobDetailJsonValue}>{formattedValue}</pre>
                                        ) : (
                                            <div className={style.jobDetailValue}>{formattedValue}</div>
                                        )}
                                    </div>
                                );
                            })
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
