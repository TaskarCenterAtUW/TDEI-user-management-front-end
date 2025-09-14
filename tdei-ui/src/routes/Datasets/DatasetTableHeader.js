import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import style from "./Datasets.module.css"

const DatasetTableHeader = ({ isReleasedDataList }) => {
    return (
        <Container className={style.datasetsTableHeaderRow} fluid>
            <div className={style.datasetCardHeader}>
                <div className={style.datasetHeaderItem}>
                    Dataset Name
                </div>
                {isReleasedDataList && 
                    <div className={style.datasetHeaderItem}>
                        Project Group
                    </div>
                }
                <div className={style.datasetHeaderItem}>
                    Service Name
                </div >
                <div className={style.datasetHeaderItem}>
                    Type
                </div>
                {!isReleasedDataList && <div className={`${style.datasetHeaderItem} d-flex justify-content-center`}>
                    Status
                </div>}
                {/* <Col>
                    View
                </Col> */}
                <div className={`${style.datasetHeaderItem} d-flex justify-content-center`}>
                    Action
                </div>
                {/* } */}
            </div>
        </Container>
    )
}

export default DatasetTableHeader;