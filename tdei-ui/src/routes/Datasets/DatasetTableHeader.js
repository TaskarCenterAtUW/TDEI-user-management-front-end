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
                <Col>
                    Type
                </Col>
                <Col>
                Service Name
                </Col>
                {!isReleasedDataList && <Col>
                    Status
                </Col>}
                {/* <Col>
                    View
                </Col> */}
                {!isReleasedDataList && <Col>
                    Action
                </Col>}
            </Row>
        </Container>
    )
}

export default DatasetTableHeader;