import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import style from "../../routes/Jobs/Jobs.module.css";
import { toPascalCase } from "../../utils";

const JobInputDescModal = (props) => {
    const { job_id, request_input } = props.message;
    const [copied, setCopied] = useState(false);

    const handleClose = () => {
        setCopied(false);
        props.onHide();
    };

    const UNION_CONFIG_KEYS = ['snap', 'dedup', 'connect', 'extensions'];

    const getCopyableJson = () => {
        if (!request_input || typeof request_input !== 'object') return null;
        let rawConfig = request_input.config;
        if (typeof rawConfig === 'string') {
            try {
                rawConfig = JSON.parse(rawConfig);
            } catch (e) {
                rawConfig = null;
            }
        }
        if (rawConfig && typeof rawConfig === 'object' && !Array.isArray(rawConfig)) {
            const unionConfig = UNION_CONFIG_KEYS.reduce((acc, key) => {
                if (rawConfig[key] !== undefined) {
                    acc[key] = rawConfig[key];
                }
                return acc;
            }, {});
            return JSON.stringify(
                Object.keys(unionConfig).length > 0 ? unionConfig : rawConfig,
                null,
                2
            );
        }
        if (UNION_CONFIG_KEYS.some((key) => request_input[key] !== undefined)) {
            const unionConfig = UNION_CONFIG_KEYS.reduce((acc, key) => {
                if (request_input[key] !== undefined) {
                    acc[key] = request_input[key];
                }
                return acc;
            }, {});
            return JSON.stringify(unionConfig, null, 2);
        }
        const filtered = Object.entries(request_input).reduce((acc, [key, value]) => {
            if (!key.toLowerCase().includes('user_id') && !key.toLowerCase().includes('userid')) {
                acc[key] = value;
            }
            return acc;
        }, {});
        return Object.keys(filtered).length > 0 ? JSON.stringify(filtered, null, 2) : null;
    };

    const handleCopyJson = () => {
        const jsonText = getCopyableJson();
        if (!jsonText) return;
        navigator.clipboard.writeText(jsonText).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
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
                        {getCopyableJson() && (
                            <Button
                                type="button"
                                size="sm"
                                variant="outline-secondary"
                                className="tdei-secondary-button align-self-center"
                                onClick={handleCopyJson}
                            >
                                {copied ? "Copied!" : "Copy Input"}
                            </Button>
                        )}
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
