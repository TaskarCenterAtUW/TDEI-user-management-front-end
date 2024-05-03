import React from "react";
import style from "./Datasets.module.css";
import { Col, Container, Row } from "react-bootstrap";
import datasetRowIcon from "../../assets/img/dataset-row.svg";
import { workspaceUrl } from '../../services';
import DatasetsActions from "./DatasetsActions";

const DatasetRow = ({ datasetName, version, type, collectionDate, status, onInspect, onAction, isReleasedList, uploaded_time,tdei_dataset_id }) => {
    const getStatusColor = () => {
        if (isReleasedList) {
            return "#B6EDD7"
        } else {
            switch (status) {
                case "Publish":
                    return "#B6EDD7";
                case "Pre-Release":
                    return "#F3E7C7";
                default:
                    return "#C7E3FF";
            }
        }
    };
    // Inline style for the left border based on status color
    const leftBorderStyle = {
        borderLeft: `8px solid ${getStatusColor()}`
    };

    const updatedTime = (time) => {
        const dateTime = new Date(time);
        return dateTime.toLocaleString()
    }
    const handleDropdownSelect = (eventKey) => {
        // Logic for handling dropdown selection
        console.log('Dropdown item selected:', eventKey);
        if (eventKey === 'openInWorkspace') {
            window.open(`${workspaceUrl}workspace/create/tdei?tdeiRecordId=${tdei_dataset_id}`, '_blank')?.focus()
        } else {
            onAction(eventKey,tdei_dataset_id,type,datasetName)
        }
      };

    return (
        <Container className={style.datasetsTableRow} fluid style={leftBorderStyle}>
            <Row className={style.datasetCard}>
                <Col md={5}>
                    <div className="d-flex align-items-center flex-wrap">
                        <div className="me-3">
                            <img src={datasetRowIcon} alt="Dataset Icon" />
                        </div>
                        <div className={style.infoBlock}>
                            <div className="d-flex align-items-center mb-2">
                                <span className={style.datasetTitle}>{datasetName} </span>
                            </div>
                            <div className={style.datasetSecondaryInfoBlock}>
                                <span className=""><b>Uploaded at : </b> {updatedTime(uploaded_time)}</span>
                                <span className={style.verticalSeparator}></span>
                                <span className={style.version}>{version}</span>
                            </div>
                            <div className={style.datasetSecondaryInfoBlock}>
                                <span className=""><b>Id : </b> {tdei_dataset_id}</span>
                            </div>
                        </div>
                    </div>
                </Col>
                <Col>
                    {type == "Osw" ? "OSW" : type}
                </Col>
                <Col>
                    {collectionDate}
                </Col>
                {isReleasedList ? null : (
                    <Col>
                        <div className={style.statusContainer} style={{ backgroundColor: getStatusColor() }}>
                            {status ==  "Publish" ? "Released" : status}
                        </div>
                    </Col>
                )}
                {/* <Col>
                    <Link onClick={onInspect} className={`${style['link-with-hover-underline']} ${style['link-inspect']}`}>
                        <span>Inspect</span>
                    </Link>
                </Col> */}
                {isReleasedList ? null : (
                    <Col>
                        <DatasetsActions status={status} onAction={handleDropdownSelect}/>
                    </Col>
                )}
            </Row>
        </Container>
    )
}

export default DatasetRow;