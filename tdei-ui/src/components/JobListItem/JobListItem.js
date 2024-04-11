import React from "react";
import style from "../../routes/Jobs/Jobs.module.css";
import projectGroupIcon from "../../assets/img/icon-projectgroupIcon.svg";
import Typography from "@mui/material/Typography";
import {Button} from "react-bootstrap";
import ColoredLabel from "../ColoredLabel/ColoredLabel";
import DownloadIcon from "../../assets/img/icon-download.svg";
import ShowJobMessageModal from "../ShowJobMessage/ShowJobMessageModal";
import axios from "axios";

class JobListItem extends React.Component {

    constructor(props) {
        super(props);
        this.state = {showMore: false, jobId: null, data : null};
        this.handleClick = this.handleClick.bind(this);
    }

    toggleShowMore = () => {
        this.setState({showMore: !this.state.showMore}, () => {
            console.log(this.state.showMore);
        });
    };

    componentDidMount() {
        console.log("Mounted")
        if (this.state.jobId){
            console.log("Inside")
            axios.get(`${process.env.REACT_APP_OSM_URL}/job/download/${this.state.jobId}`)
                .then(response => {
                    this.setState({ data: response.data });
                })
                .catch(error => {
                    this.setState({ error });
                });
        }
    }

    handleClick = (e) => {
        // Set buttonClicked to true when the button is clicked
        const {id} = e.target;
        this.setState({jobId :id }, () =>{
            console.log(this.state.jobId)
            axios.get(`${process.env.REACT_APP_OSM_URL}/job/download/${this.state.jobId}`)
                .then(response => {
                    this.setState({ data: response.data });
                })
                .catch(error => {
                    this.setState({ error });
                });
        })
    }

    render() {
        const {jobItem} = this.props;

        const { data, error } = this.state;

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
                                {`${jobItem.message.slice(0, 70)}...`}
                            </Typography>
                            {jobItem.message.length > 70 && <Button style={{color: '#0969DA'}} onClick={this.toggleShowMore}
                                    variant="text">
                                {this.state.showMore ? 'Show less' : 'Show more'}
                            </Button>}
                        </div>
                    )}
                </div>
                <div className={style.content}>
                    <ColoredLabel labelText={jobItem.status} color={getColorForLabel(jobItem.status.toLowerCase())}/>
                </div>
                <p id={jobItem.job_id} className={style.downloadLink}
                   onClick={(e) => this.handleClick(e)}>
                    <img src={DownloadIcon} alt="Download icon"></img> Download Report
                </p>
                <ShowJobMessageModal
                    show={this.state.showMore}
                    onHide={() => {
                        this.toggleShowMore()
                    }}
                    message={{
                        fileName: `File name`,
                        type: `${jobItem.job_type}`,
                        job_id: `${jobItem.job_id}`,
                        message: `${jobItem.message}`,
                    }}
                />
            </div>
        );
    }
}

export default JobListItem;