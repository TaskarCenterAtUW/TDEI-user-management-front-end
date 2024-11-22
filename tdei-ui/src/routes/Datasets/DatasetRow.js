import React from "react";
import style from "./Datasets.module.css";
import { Col, Container, Row } from "react-bootstrap";
import datasetRowIcon from "../../assets/img/dataset-row.svg";
import { workspaceUrl } from '../../services';
import DatasetsActions from "./DatasetsActions";
import ClipboardCopy from "../Services/ClipBoardCopy";

const DatasetRow = ({ dataset, onAction, isReleasedList }) => {
    const { metadata, data_type, service, status, uploaded_timestamp, tdei_dataset_id, project_group } = dataset;
    const { data_provenance, dataset_detail } = metadata;

    const getStatusColor = () => {
        if (isReleasedList) {
            return "#B6EDD7";
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

    const leftBorderStyle = {
        borderLeft: `8px solid ${getStatusColor()}`
    };

    const updatedTime = (time) => {
        const dateTime = new Date(time);
        
        const optionsDate = {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        const optionsTime = {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        };
        const formattedDate = dateTime.toLocaleDateString('en-US', optionsDate);
        const formattedTime = dateTime.toLocaleTimeString('en-US', optionsTime);
        
        return `${formattedDate}, ${formattedTime}`;
    };
    const handleDropdownSelect = (eventKey) => {
        if (eventKey === 'openInWorkspace') {
            window.open(`${workspaceUrl}workspace/create/tdei?tdeiRecordId=${tdei_dataset_id}`, '_blank')?.focus();
        } else {
            onAction(eventKey, dataset);
        }
    };

    return (
        <Container className={style.datasetsTableRow} fluid>
            <Row className={style.datasetCard}>
                <Col md={5}>
                    <div className="d-flex align-items-center flex-wrap">
                        <div className="me-3">
                            <img src={datasetRowIcon} alt="Dataset Icon" />
                        </div>
                        <div className={style.infoBlock}>
                            <div className="d-flex align-items-center mb-2">
                                <span className={style.datasetTitle} title={metadata.dataset_detail.name} tabIndex={0}>{metadata.dataset_detail.name} </span>
                            </div>
                            <div className={style.datasetSecondaryInfoBlock}>
                                <span className=""><b>Uploaded at : </b> {updatedTime(uploaded_timestamp)}</span>
                                <span className={style.verticalSeparator}></span>
                                <span className={style.version}>{dataset_detail.version}</span>
                            </div>
                        </div>
                    </div>
                </Col>
                 {!isReleasedList ? null : (
                 <Col>
                    <div className={style.serviceName} title={dataset.project_group.name} tabIndex={0}>{dataset.project_group.name}</div>
                </Col>
                 )}
                <Col>
                    <div className={style.serviceName} title={service.name} tabIndex={0}>{service.name}</div>
                </Col>
                <Col>
                    <div className="" tabIndex={0}>{data_type === "Osw" ? "OSW" : data_type}</div>
                </Col>
                {isReleasedList ? null : (
                    <Col className="d-flex justify-content-center">
                        <div className={style.statusContainer} style={{ backgroundColor: getStatusColor() }} tabIndex={0}>
                            {status === "Publish" ? "Released" : status}
                        </div>
                    </Col>
                )}
                {/* {isReleasedList ? null : ( */}
                    <Col>
                        <DatasetsActions status={status} onAction={handleDropdownSelect} isReleasedDataset={isReleasedList}/>
                    </Col>
                {/* )} */}
            </Row>
            <div className={`${style.datasetIdBlock} d-flex align-items-center`}>
                <ClipboardCopy copyText={tdei_dataset_id} copyTitle={"Id"} />
                {dataset.derived_from_dataset_id && (
                    <>
                        <span className={style.separator}> | </span>
                        <ClipboardCopy copyText={dataset.derived_from_dataset_id} copyTitle={"Derived Dataset Id"} />
                    </>
                )}
            </div>
        </Container>
    );
}

export default DatasetRow;