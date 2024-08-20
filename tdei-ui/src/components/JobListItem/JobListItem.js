import React, { useState } from "react";
import style from "../../routes/Jobs/Jobs.module.css";
import DatasetIcon from "../../assets/img/icon-job-dataset.svg";
import fileIcon from "../../assets/img/icon-job-file.svg";
import { Button } from "react-bootstrap";
import DownloadIcon from "../../assets/img/icon-download.svg";
import ShowJobMessageModal from "../ShowJobMessage/ShowJobMessageModal";
import JobMsgDescModal from "../ShowJobMessage/JobMsgDescModal";
import { toPascalCase } from "../../utils";
import useDownloadJob from "../../hooks/jobs/useDownloadJob";
import ColoredLabel from "../ColoredLabel/ColoredLabel";
import ResponseToast from "../ToastMessage/ResponseToast";

const JobListItem = ({ jobItem }) => {
  const [showMore, setShowMore] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [jobId, setJobId] = useState(null);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [eventKey, setEventKey] = useState("");

  const handleToast = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onSuccess = (data) => {
    setEventKey("success")
    handleToast();
  };

  const onError = (err) => {
    console.error("error message", err);
    setEventKey("error")
    handleToast();
  };
  const { mutate: downloadJob, isLoading: isDownloadingJob } = useDownloadJob({ onSuccess, onError });

  const toggleShowMore = () => {
    setShowMore(!showMore);
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

 
const handleClick = (e) => {
  const { id } = e.target;
  setJobId(id);
  if (jobItem.job_type === "Quality-Metric") {
    window.location.href = jobItem.response_props.qm_dataset_url;
  } else {
    downloadJob(id);
  }
};

  const updatedTime = (time) => {
    const dateTime = new Date(time);
    return dateTime.toLocaleString();
  };

  const getColorForLabel = (text) => {
    if (!text) return "green";
    if (text.includes("completed")) {
      return "#6BD2D6";
    } else if (text.includes("in-progress")) {
      return "#E2C7A2";
    } else {
      return "#D55962";
    }
  };

  const getJobStatusTitle = () => {
    let dataType = jobItem.data_type;
    if (dataType === "osw") {
      dataType = dataType.toUpperCase();
    } else {
      dataType = toPascalCase(dataType);
    }
    let jobType = jobItem.job_type.replace(/-/g, " ");
    if (jobItem.request_input.dataset_name) {
      return jobItem.request_input.dataset_name;
    } else {
      return `${dataType} ${jobType}`;
    }
  };

  if (error) {
    console.log(error);
  }

  return (
    <div className={style.gridContainer} key={jobItem.tdei_project_group_id}>
      <div className="d-flex">
        {jobItem.request_input.dataset_name ? (
          <div className="d-flex align-items-center">
            <img
              className={style.datasetFileIconSize}
              src={DatasetIcon}
              alt="Dataset Icon"
            />
            <div className={style.datasetFileName} tabIndex={0}>
              {jobItem.request_input.dataset_name}
            </div>
          </div>
        ) : (
          <div className="d-flex align-items-center">
            <img
              className={style.datasetFileIconSize}
              src={fileIcon}
              alt="Dataset Icon"
            />
            <div className={style.datasetFileName} tabIndex={0}>
              {getJobStatusTitle()}
            </div>
          </div>
        )}
      </div>

      <div className={style.content} tabIndex={0}>
        {jobItem.job_type} <br />
        <span className={style.jobIdLabel}>Job Id - {jobItem.job_id}</span>
      </div>
      <div className={style.content}>
        {jobItem.message && (
          <>
            <div className={style.errorMessageContent} tabIndex={0}>
              {jobItem.message.length > 70
                ? `${jobItem.message.slice(0, 70)}...`
                : `${jobItem.message}`}
            </div>
            <div>
              {jobItem.message.length > 70 && (
                <Button
                  className={style.showMoreButton}
                  onClick={toggleShowMore}
                  variant="link"
                >
                  {showMore ? "Show less" : "Show more"}
                </Button>
              )}
            </div>
          </>
        )}
        {!jobItem.message && (
          <div
            className={
              jobItem.status.toLowerCase() !== "completed"
                ? style.noMessageFount
                : style.content
            }
            tabIndex={0}
            role={
              jobItem.status.toLowerCase() !== "completed" ? "button" : undefined
            }
            onClick={
              jobItem.status.toLowerCase() !== "completed"
                ? toggleModal
                : undefined
            }
          >
            {jobItem.status.toLowerCase() === "completed"
              ? "Job completed"
              : "Job is in progress"}
          </div>
        )}
        {(jobItem.job_type === "Dataset-Reformat" ||
          jobItem.job_type === "Dataset-Queries" ||
          jobItem.job_type === "Quality-Metric") &&
          jobItem.status.toLowerCase() === "completed" &&
          (jobItem.download_url || jobItem.job_type === "Quality-Metric") && (
            <div
              id={jobItem.job_id}
              className={style.downloadLink}
              onClick={(e) => handleClick(e)}
              variant="link"
            >
              <img src={DownloadIcon} alt="Download icon" /> Download Result
            </div>
          )}
      </div>
      <div className={style.content} tabIndex={0}>
        <ColoredLabel
          labelText={jobItem.status}
          color={getColorForLabel(jobItem.status.toLowerCase())}
        />
        <div className={style.updatedInfo}>
          Updated at : {updatedTime(jobItem.updated_at)}
        </div>
      </div>
 
      <ShowJobMessageModal
        show={showMore}
        onHide={toggleShowMore}
        message={{
          fileName: jobItem.request_input.dataset_name
            ? jobItem.request_input.dataset_name
            : jobItem.request_input.file_upload_name,
          type: jobItem.job_type,
          job_id: jobItem.job_id,
          message: jobItem.message,
        }}
      />
      <JobMsgDescModal
        show={showModal}
        onHide={toggleModal}
        message={{
          type: jobItem.job_type,
          job_id: jobItem.job_id,
          progress: jobItem.progress,
          jobStatusTitle: getJobStatusTitle(),
        }}
      />
      <ResponseToast
        showtoast={open}
        handleClose={handleClose}
        type={eventKey === "success" ? "success" : "error"}
        message={eventKey === 'success' ? "Success! Download has been initiated." : "Error! Failed to initiate download."}
      />
    </div>
  );
};

export default JobListItem;