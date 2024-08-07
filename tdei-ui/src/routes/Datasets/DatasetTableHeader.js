import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import style from "./Datasets.module.css"

const DatasetTableHeader = ({ isReleasedDataList }) => {
    return (
        <Container className={style.datasetsTableHeaderRow} fluid>
            <Row>
                <Col md={5}>
                    Dataset Name
                </Col>
                {isReleasedDataList && <Col>
                    Project Group
                </Col>}
                <Col>
                    Service Name
                </Col >
                <Col>
                    Type
                </Col>
                {!isReleasedDataList && <Col className="d-flex justify-content-center">
                    Status
                </Col>}
                {/* <Col>
                    View
                </Col> */}
                <Col className="d-flex justify-content-center">
                    Action
                </Col>
                {/* } */}
            </Row>
        </Container>
    )
}

export default DatasetTableHeader;