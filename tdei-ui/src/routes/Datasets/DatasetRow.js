import React from "react";
import style from "./Datasets.module.css";
import { Col, Container, Row } from "react-bootstrap";
import datasetRowIcon from "../../assets/img/dataset-row.svg";
import { workspaceUrl } from '../../services';
import DatasetsActions from "./DatasetsActions";
import ClipboardCopy from "../Services/ClipBoardCopy";

const DatasetRow = ({ datasetName, version, type, serviceName, status, onInspect, onAction, isReleasedList, uploaded_time,tdei_dataset_id }) => {
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
                                <span className={style.datasetTitle} title={datasetName} tabIndex={0}>{datasetName} </span>
                            </div>
                            <div className={style.datasetSecondaryInfoBlock}>
                                <span className=""><b>Uploaded at : </b> {updatedTime(uploaded_time)}</span>
                                <span className={style.verticalSeparator}></span>
                                <span className={style.version}>{version}</span>
                            </div>
                        </div>
                    </div>
                </Col>
                <Col>
                    <div className={style.serviceName} title={serviceName} tabIndex={0}>{serviceName}</div>
                </Col>
                <Col>
                    <div className="" tabIndex={0}>{type == "Osw" ? "OSW" : type}</div>
                </Col>
                {isReleasedList ? null : (
                    <Col className="d-flex justify-content-center">
                        <div className={style.statusContainer} style={{ backgroundColor: getStatusColor() }} tabIndex={0}>
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
            <div className={style.datasetIdBlock}>
                <ClipboardCopy copyText={tdei_dataset_id} copyTitle={"Id"} />
            </div>
        </Container>
    )
}

export default DatasetRow;