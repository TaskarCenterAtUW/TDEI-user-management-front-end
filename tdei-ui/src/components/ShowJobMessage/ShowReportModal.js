import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import style from "../../routes/Jobs/Jobs.module.css";

const CopyButton = ({ textToCopy }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(textToCopy).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <button
            type="button"
            onClick={handleCopy}
            title="Copy to clipboard"
            style={{
                marginLeft: "8px",
                padding: "2px 8px",
                fontSize: "12px",
                cursor: "pointer",
                border: "1px solid #CED4DA",
                borderRadius: "4px",
                background: copied ? "#B6EDD7" : "#F8F8F8",
                color: copied ? "#1a7a4a" : "#162848",
                transition: "background 0.2s, color 0.2s",
                whiteSpace: "nowrap",
            }}
        >
            {copied ? "✓ Copied" : "Copy"}
        </button>
    );
};

const ShowReportModal = (props) => {
    const { message = {} } = props;
    const { job_id, response_props } = message;

    const reportData = response_props || {};
    const resultFiles = reportData?.job_metadata?.result_files || {};
    const statusFile = reportData?.job_metadata?.status_file;
    const reportVersion = reportData?.job_metadata?.report_version;
    const successMessage = reportData?.message;
    const isSuccess = reportData?.success;

    const handleClose = () => {
        props.onHide();
    };

    const rows = [
        successMessage && { label: "Message", value: successMessage },
        reportVersion && { label: "Report Version", value: reportVersion },
        resultFiles.pdf && {
            label: "PDF Report",
            url: resultFiles.pdf,
            value: (
                <div style={{ display: "flex", alignItems: "center" }}>
                    <a href={resultFiles.pdf} target="_blank" rel="noreferrer" className={style.downloadLink}>
                        Download PDF
                    </a>
                    <CopyButton textToCopy={resultFiles.pdf} />
                </div>
            ),
        },
        resultFiles.html && {
            label: "HTML Report",
            url: resultFiles.html,
            value: (
                <div style={{ display: "flex", alignItems: "center" }}>
                    <a href={resultFiles.html} target="_blank" rel="noreferrer" className={style.downloadLink}>
                        View HTML Report
                    </a>
                    <CopyButton textToCopy={resultFiles.html} />
                </div>
            ),
        },
        statusFile && {
            label: "Status File",
            url: statusFile,
            value: (
                <div style={{ display: "flex", alignItems: "center" }}>
                    <a href={statusFile} target="_blank" rel="noreferrer" className={style.downloadLink}>
                        View Status File
                    </a>
                    <CopyButton textToCopy={statusFile} />
                </div>
            ),
        },
    ].filter(Boolean);

    return (
        <Modal
            onHide={handleClose}
            show={props.show}
            size="md"
            aria-labelledby="report-modal-title"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title as="h4" id="report-modal-title">
                    Quality Report
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className={style.modalBody}>
                <div className={style.jobStatusContainer}>
                    <div className={style.jobStatusHeader}>
                        <div style={{ flexGrow: 1 }}>
                            <div className={style.jobStatusHeaderLabel}>
                                {message.jobStatusTitle}
                            </div>
                            <div className={style.jobStatusHeaderValue}>
                                ID: {job_id}
                            </div>
                        </div>
                        {isSuccess !== undefined && (
                            <span
                                className={style.statusContainer}
                                style={{
                                    "--background-color": isSuccess ? "#B6EDD7" : "#EAC5C2",
                                    "--border-color": isSuccess ? "#A9E2CB" : "#DBABA7",
                                }}
                            >
                                {isSuccess ? "Success" : "Failed"}
                            </span>
                        )}
                    </div>
                    <div className={style.jobStatusContainerContent}>
                        {rows.length > 0 ? (
                            <table className={style.requestInputTable}>
                                <thead>
                                    <tr>
                                        <th>Field</th>
                                        <th>Details</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows.map((row) => (
                                        <tr key={row.label}>
                                            <td><strong>{row.label}</strong></td>
                                            <td>{row.value}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div>No report data available.</div>
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

export default ShowReportModal;
