import React, { useEffect } from "react";
import { Button, Modal, Spinner } from "react-bootstrap";
import style from "../../routes/Jobs/Jobs.module.css";
import useGetJobDetails from "../../hooks/jobs/useGetJobDetails";
import { useAuth } from "../../hooks/useAuth";
import { IconButton } from '@mui/material';
import refreshBtn from "./../../assets/img/refreshBtn.svg";
import { useQueryClient } from "react-query";
import { GET_JOBS } from "../../utils";
import { toPascalCase } from "../../utils";

const JobMsgDescModal = (props) => {
    const { user } = useAuth();
    const isAdmin = user && user.isAdmin;
    const jobId = props.message.job_id;
    const { data, error, isLoading, refreshData } = useGetJobDetails(isAdmin, jobId, props.show);
    const queryClient = useQueryClient();
    const getTime = (time) => {
        const dateTime = new Date(time);
        return dateTime.toLocaleString();
    };

    const handleRefresh = () => {
        refreshData();
    };

    useEffect(() => {
        if (props.show) {
            handleRefresh();
        }
    }, [props.show]);

    const handleClose = () => {
        props.onHide();
        queryClient.invalidateQueries({ queryKey: [GET_JOBS] });
    };

    // Use initial values from props.message.progress
    const initialProgress = props.message.progress;

    // Use data from API if available, otherwise fallback to initial values
    const currentProgress = !isLoading && !error && data ? data[0]?.progress : initialProgress;

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
                    Job Progress Status
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className={style.modalBody}>
                <div>
                    {isLoading ? (
                        <div className={style.spinnerContainer} style={{ padding: "20px 0" }}>
                            <Spinner animation="border" role="status" color='black' style={{ margin: "0 auto", display: "block" }}>
                            </Spinner>
                        </div>
                    ) : error ? (
                        <div>Error loading job details</div>
                    ) : (
                        <>
                            <div className={style.jobStatusContainer}>
                                <div className={style.jobStatusHeader}>
                                    <div style={{ flexGrow: 1 }}>
                                        <div className={style.jobStatusHeaderLabel}>{props.message.jobStatusTitle}:</div>
                                        <div className={style.jobStatusHeaderValue}>ID: {props.message.job_id}</div>
                                    </div>
                                    <IconButton className={style.iconBtn} onClick={handleRefresh} style={{ marginLeft: "10px" }} aria-label="Refresh status">
                                        <img alt="" src={refreshBtn} style={{ height: "15px", width: "15px" }} />
                                    </IconButton>
                                </div>
                                <div className={style.jobStatusContainerContent}>
                                    <div className={style.jobDetailRow}>
                                        <div className={style.jobDetailLabel}>Total Stages: {currentProgress.total_stages} </div>
                                        <div className={style.jobDetailValue}>{`${currentProgress.completed_stages}/${currentProgress.total_stages} stages completed`}</div>
                                    </div>
                                    <div className={style.jobDetailRow}>
                                        <div className={style.jobDetailLabel}>Current Stage:</div>
                                        <div className={style.jobDetailValue}>
                                            {currentProgress.current_stage} <span className={style.statusContainer}>{toPascalCase(currentProgress.current_state)}</span>
                                        </div>
                                    </div>
                                    <div className={style.jobDetailRow}>
                                        <div className={style.jobDetailLabel}>Last Updated:</div>
                                        <div className={style.jobDetailValue}>{getTime(currentProgress.last_updated_at)}</div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    onClick={handleClose}
                    variant="outline-secondary"
                    className="tdei-secondary-button"
                    disabled={isLoading}
                >
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default JobMsgDescModal;
