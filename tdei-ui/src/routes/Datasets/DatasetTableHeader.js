import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import style from "./Datasets.module.css"

const DatasetTableHeader = () => {
    return (
        <Container className={style.datasetsTableHeaderRow} fluid>
            <Row>
                <Col md lg="6">
                    Dataset Name 
                </Col>
                <Col>
                Type
                </Col>
                <Col>
                Collection Date
                </Col>
                <Col >
                Status
                </Col>
                <Col>
                View
                </Col>
                <Col>
                Action 
                </Col>
            </Row>
        </Container>
    )
}

export default DatasetTableHeader;