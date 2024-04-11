import React from "react";
import style from "../../routes/Jobs/Jobs.module.css";
import projectGroupIcon from "../../assets/img/icon-projectgroupIcon.svg";
import Typography from "@mui/material/Typography";
import {Button} from "react-bootstrap";
import ColoredLabel from "../ColoredLabel/ColoredLabel";
import DownloadIcon from "../../assets/img/icon-download.svg";

class JobListItem extends React.Component {
    render() {
        const {jobItem} = this.props;
        this.state = { showMore: false, JobId : null };
        const toggleShowMore = () => {
            this.setState({showMore: true})
            console.log(this.state.showMore)
        };

        const handleDownloadReport = (e) => {
            const {id} = e.target;
            console.log(id)
            // setJobId(id)
        }

        const getColorForLabel = (text) => {
            console.log(text)
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
                <div className={style.details}>
                    <img
                        src={projectGroupIcon}
                        className={style.projectGroupIcon}
                        alt="sitemap-solid"
                    />
                    <div>
                        <div className={style.name}>{jobItem.request_input.dataset_name}</div>
                        <div className={style.address}>{jobItem.download_url}</div>
                    </div>
                </div>
                <div className={style.content}>{jobItem.job_type} <br/>{jobItem.job_id}</div>
                <div className={style.content}>
                    {jobItem.message && (
                        <div>
                            <Typography>
                                {this.state.showMore ? jobItem.message : `${jobItem.message.slice(0, 60)}...`}
                            </Typography>
                            <Button style={{color: '#0969DA'}} onClick={toggleShowMore}
                                    variant="text">
                                {this.state.showMore ? 'Show less' : 'Show more'}
                            </Button>
                        </div>
                    )}
                </div>
                <div className={style.content}>
                    <ColoredLabel labelText={jobItem.status} color={getColorForLabel(jobItem.status.toLowerCase())}/>
                </div>
                <p id={jobItem.job_id} className={style.downloadLink}
                   onClick={(e) => handleDownloadReport(e)}>
                    <img src={DownloadIcon} alt="Download icon"></img> Download Report
                </p>
            </div>
        );
    }
}

export default JobListItem;