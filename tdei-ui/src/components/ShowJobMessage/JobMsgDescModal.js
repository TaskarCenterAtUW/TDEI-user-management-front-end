import React, { useEffect } from "react";
import { Button, Modal, ProgressBar, Spinner } from "react-bootstrap";
import style from "../../routes/Jobs/Jobs.module.css";
import useGetJobDetails from "../../hooks/jobs/useGetJobDetails";
import { useAuth } from "../../hooks/useAuth";
import { IconButton } from '@mui/material';
import refreshBtn from "./../../assets/img/refreshBtn.svg";
import { useQueryClient } from "react-query";
import { GET_JOBS } from "../../utils";

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
            onHide={props.onHide}
            show={props.show}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter" style={{ fontSize: "18px", fontWeight: "bold" }}>
                    {props.message.job_id} - Progress
                </Modal.Title>
                <IconButton className={style.iconBtn} onClick={handleRefresh} style={{ marginLeft: "10px" }}>
                    <img alt="refresh" src={refreshBtn} style={{ height: "15px", width: "15px" }} />
                </IconButton>
            </Modal.Header>
            <Modal.Body>
                <div>
                    {isLoading ? (
                        <>
                            <Spinner animation="border" role="status" color='black'>
                            </Spinner>
                        </>
                    ) : error ? (
                        <div>Error loading job details</div>
                    ) : (
                        <>
                            <div className={style.jobDetailRow}>
                                <div className={style.jobDetailLabel}>Current Stage</div>
                                <div className={style.jobDetailValue}>{currentProgress.current_stage}</div>
                            </div>
                            <div className={style.jobDetailRow}>
                                <div className={style.jobDetailLabel}>Total Stages</div>
                                <div className={style.jobDetailValue}>{currentProgress.total_stages}</div>
                            </div>
                            <div className={style.jobDetailRow}>
                                <div className={style.jobDetailLabel}>Completed Stages</div>
                                <div className={style.jobDetailValue}>{currentProgress.completed_stages}</div>
                            </div>
                            <div className={style.jobDetailRow}>
                                <div className={style.jobDetailLabel}>Last Updated At</div>
                                <div className={style.jobDetailValue}>{getTime(currentProgress.last_updated_at)}</div>
                            </div>
                            <div className="mt-2">
                                <div className={style.jobDetailLabel}>Progress</div>
                                <ProgressBar
                                    className="jobProgress"
                                    striped
                                    now={(currentProgress.completed_stages / currentProgress.total_stages) * 100}
                                    label={`${currentProgress.completed_stages} of ${currentProgress.total_stages}`}
                                    animated={false}
                                />
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
