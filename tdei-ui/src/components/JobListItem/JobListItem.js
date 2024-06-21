import React from "react";
import style from "../../routes/Jobs/Jobs.module.css";
import DatasetIcon from "../../assets/img/icon-job-dataset.svg";
import fileIcon from "../../assets/img/icon-job-file.svg";
import Typography from "@mui/material/Typography";
import {Button} from "react-bootstrap";
import ColoredLabel from "../ColoredLabel/ColoredLabel";
import DownloadIcon from "../../assets/img/icon-download.svg";
import ShowJobMessageModal from "../ShowJobMessage/ShowJobMessageModal";
import axios from "axios";
import JobMsgDescModal from "../ShowJobMessage/JobMsgDescModal";

class JobListItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {showMore: false, showModal: false, jobId: null, data: null};
        this.handleClick = this.handleClick.bind(this);
        this.toggleShowMore = this.toggleShowMore.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
    }

    toggleShowMore() {
        this.setState({showMore: !this.state.showMore}, () => {
            console.log(this.state.showMore);
        });
    }

    toggleModal() {
        this.setState({showModal: !this.state.showModal});
    }

    handleClick(e) {
        const {id} = e.target;
        this.setState({jobId: id}, () => {
            console.log(this.state.jobId)
            axios.get(`${process.env.REACT_APP_OSM_URL}/job/download/${this.state.jobId}`)
                .then(response => {
                    this.setState({data: response.data});
                })
                .catch(error => {
                    this.setState({error});
                });
        });
    }

    updatedTime(time) {
        const dateTime = new Date(time);
        return dateTime.toLocaleString();
    }

    render() {
        const {jobItem} = this.props;
        const {data, error, showModal} = this.state;

        if (error) {
            console.log(error);
        }

        const getColorForLabel = (text) => {
            if (!text) return 'green';
            if (text.includes('completed')) {
                return '#6BD2D6';
            } else if (text.includes('in-progress')) {
                return '#E2C7A2';
            } else {
                return '#D55962';
            }
        }

        return (
            <div className={style.gridContainer} key={jobItem.tdei_project_group_id}>
                <div className="d-flex">
                    {jobItem.request_input.dataset_name ? ( 
                       <div className="d-flex align-items-center">
                            <img className={style.datasetFileIconSize} src={DatasetIcon} alt="Dataset Icon"/> 
                            <div className={style.datasetFileName} tabIndex={0}>{jobItem.request_input.dataset_name}</div>
                        </div>
                    ) : (
                        <div className="d-flex align-items-center">
                            <img className={style.datasetFileIconSize} src={fileIcon} alt="Dataset Icon"/> 
                            <div className={style.datasetFileName} tabIndex={0}>{jobItem.request_input.file_upload_name}</div>
                        </div>
                    )}
                </div>

                <div className={style.content} tabIndex={0}>
                    {jobItem.job_type} <br/>
                    <span className={style.jobIdLabel}>Job Id - {jobItem.job_id}</span>
                </div>
                <div className={style.content}>
                    {jobItem.message && (
                        <>
                            <div className={style.errorMessageContent} tabIndex={0}>
                                {jobItem.message.length > 70 ? `${jobItem.message.slice(0, 70)}...` : `${jobItem.message}`}
                            </div>
                            <div>
                                {jobItem.message.length > 70 &&
                                    <Button className={style.showMoreButton} onClick={this.toggleShowMore}
                                            variant="link">
                                        {this.state.showMore ? 'Show less' : 'Show more'}
                                    </Button>}
                            </div>
                        </>
                    )}
                     {!jobItem.message && (
                        <div
                            className={jobItem.status.toLowerCase() !== 'completed' ? style.noMessageFount : style.content}
                            tabIndex={0}
                            role={jobItem.status.toLowerCase() !== 'completed' ? "button" : undefined}
                            onClick={jobItem.status.toLowerCase() !== 'completed' ? this.toggleModal : undefined}
                        >
                            {jobItem.status.toLowerCase() === 'completed' ? 'Job completed' : 'Job is in progress'}
                        </div>
                    )}
                </div>
                <div className={style.content} tabIndex={0}>
                    <ColoredLabel labelText={jobItem.status} color={getColorForLabel(jobItem.status.toLowerCase())}/>
                    <div className={style.updatedInfo}>Updated at : {this.updatedTime(jobItem.updated_at)}</div>
                </div>
                {/* <p id={jobItem.job_id} className={style.downloadLink}
                   onClick={(e) => this.handleClick(e)}>
                    <img src={DownloadIcon} alt="Download icon"></img> Download Report
                </p> */}
                <ShowJobMessageModal
                    show={this.state.showMore}
                    onHide={() => {
                        this.toggleShowMore()
                    }}
                    message={{
                        fileName: jobItem.request_input.dataset_name ? jobItem.request_input.dataset_name : jobItem.request_input.file_upload_name,
                        type: jobItem.job_type,
                        job_id: jobItem.job_id,
                        message: jobItem.message
                    }}
                />
                <JobMsgDescModal
                    show={showModal}
                    onHide={this.toggleModal}
                    message={{
                        type: jobItem.job_type,
                        job_id : jobItem.job_id,
                        progress:jobItem.progress
                    }}
                />
            </div>
        );
    }
}

export default JobListItem;