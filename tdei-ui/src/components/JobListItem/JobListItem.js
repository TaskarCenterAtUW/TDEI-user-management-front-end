import React, { useState } from "react";
import style from "../../routes/Jobs/Jobs.module.css";
import ShowJobMessageModal from "../ShowJobMessage/ShowJobMessageModal";
import JobMsgDescModal from "../ShowJobMessage/JobMsgDescModal";
import { toPascalCase } from "../../utils";
import useDownloadJob from "../../hooks/jobs/useDownloadJob";
import ResponseToast from "../ToastMessage/ResponseToast";
import JobInputDescModal from "../ShowJobMessage/JobInputDescModal";
import { DateTime, Interval } from "luxon";
import UserIcon from './../../assets/img/user.svg';
import { updatedTime } from "../../utils";

const JobListItem = ({ jobItem }) => {
  const [showMore, setShowMore] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [jobId, setJobId] = useState(null);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [eventKey, setEventKey] = useState("");
  const [showInputDescModal, setInputDescModal] = useState(false);

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
    setError(err.message ?? err)
    handleToast();
  };
  const { mutate: downloadJob, isLoading: isDownloadingJob } = useDownloadJob({ onSuccess, onError });

  const toggleShowMore = () => {
    setShowMore(!showMore);
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const toggleInputDescModal = () => {
    setInputDescModal(!showInputDescModal);
  };


  const handleClick = (e) => {
    const { id } = e.target;
    setJobId(id);
    if (jobItem.job_type === "Confidence-Calculate") {
      const confidenceScores = jobItem.response_props.confidence_scores;
      const blob = new Blob([confidenceScores], { type: 'application/json' });
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', `${id}_confidence_scores.geojson`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } else {
      downloadJob(id);
    }
  };

  const updatedTime = (time) => {
    const dateTime = new Date(time);
    return dateTime.toLocaleString();
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

  const getJobDuration = (jobItem) => {
    const createdAt = DateTime.fromISO(jobItem.created_at);
    const updatedAt = jobItem.updated_at
      ? DateTime.fromISO(jobItem.updated_at)
      : DateTime.now();

    // For in-progress jobs, display Started at: created_date
    if (jobItem.status.toLowerCase() === "in-progress") {
      return `${createdAt.toLocaleString(DateTime.DATETIME_MED)}`;
    }
    // Calculate the duration between created_at and updated_at
    const duration = Interval.fromDateTimes(createdAt, updatedAt).toDuration([
      "days",
      "hours",
      "minutes",
      "seconds",
    ]);
    if (duration.days >= 1) {
      return `${Math.floor(duration.days)} day${duration.days >= 2 ? "s" : ""}`;
    } else if (duration.hours >= 1) {
      return `${Math.floor(duration.hours)} hr${duration.hours >= 2 ? "s" : ""}`;
    } else if (duration.minutes >= 1) {
      return `${Math.floor(duration.minutes)} min${duration.minutes >= 2 ? "s" : ""}`;
    } else {
      return `${Math.floor(duration.seconds)} sec${duration.seconds >= 2 ? "s" : ""}`;
    }
  };

  const getBackgroundColor = (status) => {
    if (status.includes("completed")) {
      return "#B6EDD7";
    } else if (status.includes("in-progress")) {
      return "#F3E7C7";
    } else {
      return "#EAC5C2";
    }
  };
  const getBorderColor = (status) => {
    if (status.includes("completed")) {
      return "#A9E2CB";
    } else if (status.includes("in-progress")) {
      return "#EBDDB8";
    } else {
      return "#DBABA7";
    }
  };

  if (error) {
    console.log(error);
  }

  return (
    <div className={style.gridContainer} key={jobItem.tdei_project_group_id}>
      <div className={style.content} tabIndex={0}>
        {jobItem.job_type}
      </div>
      <div className={style.content} tabIndex={1}>
        Job Id: <span className={style.downloadLink}
          onClick={toggleInputDescModal}
          variant="link">{jobItem.job_id}</span>
      </div>
      <div className={style.content} tabIndex={2}>
        <img src={UserIcon} alt="User icon" style={{ width: '18px', height: '18px' }} /> {jobItem.requested_by}
      </div>
      <div className={style.content} tabIndex={3}>
        {jobItem.message && (
          <>
            <div className={style.errorMessageContent} tabIndex={0}>
              {jobItem.message.length > 70
                ? `${jobItem.message.slice(0, 70)}...`
                : `${jobItem.message}`}
            </div>
            <div>
              {jobItem.message.length > 35 && (
                <div
                  className={style.showMoreButton}
                  onClick={toggleShowMore}
                  variant="link"
                >
                  {showMore ? "Show less" : "Show more"}
                </div>
              )}
            </div>
          </>
        )}
        {!jobItem.message && (
          <div
            className={style.content}
            tabIndex={0}
          >
            {jobItem.status.toLowerCase() === "in-progress"
              ? "Job is in progress"
              : jobItem.status.toLowerCase() === "completed" ? "Job Completed" : "-"}
          </div>
        )}
        {(jobItem.job_type === "Dataset-Reformat" ||
          jobItem.job_type === "Dataset-BBox" ||
          jobItem.job_type === "Dataset-Road-Tag" ||
          jobItem.job_type === "Dataset-Spatial-Join" ||
          jobItem.job_type === "Dataset-Union" ||
          jobItem.job_type === "Quality-Metric" ||
          jobItem.job_type === "Confidence-Calculate"
        ) &&
          jobItem.status.toLowerCase() === "completed" &&
          (jobItem.download_url || jobItem.job_type === "Quality-Metric" || (jobItem.job_type === "Confidence-Calculate" && jobItem.response_props)) && (
            <div
              id={jobItem.job_id}
              className={style.showMoreButton}
              onClick={(e) => handleClick(e)}
              variant="link"
            >
              Download Result
            </div>
          )}
        {
          jobItem.status.toLowerCase() === 'in-progress' && (
            <div
              id={jobItem.job_id}
              className={style.showMoreButton}
              onClick={toggleModal}
              variant="link"
            >
              Check Status
            </div>
          )
        }
      </div>
      <div tabIndex={4}>
        <div className={style.statusContainer} style={{ "--background-color": getBackgroundColor(jobItem.status.toLowerCase()), "--border-color": getBorderColor(jobItem.status.toLowerCase())}}>
          {toPascalCase(jobItem.status)}
        </div>
        <div className={style.updatedInfo}>
          {jobItem.status.toLowerCase() === "in-progress" ? "Started at:" : "Duration:"}  {getJobDuration(jobItem)}
        </div>
      </div>
      <div tabIndex={4}>
        <div className={style.updatedInfo}>
          {updatedTime(jobItem.created_at)}
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
      <JobInputDescModal
        show={showInputDescModal}
        onHide={toggleInputDescModal}
        message={{
          type: jobItem.job_type,
          job_id: jobItem.job_id,
          progress: jobItem.progress,
          request_input: jobItem.request_input,
        }}
      />
      <ResponseToast
        showtoast={open}
        handleClose={handleClose}
        type={eventKey === "success" ? "success" : "error"}
        message={eventKey === 'success' ? "Success! Download has been initiated." : `Error! ${error}`}
      />
    </div>
  );
};

export default JobListItem;