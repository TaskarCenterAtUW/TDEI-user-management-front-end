import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import style from "./Datasets.module.css"

const DatasetTableHeader = ({ isReleasedDataList }) => {
    return (
        <Container className={style.datasetsTableHeaderRow} fluid>
            <Row>
                <Col md={isReleasedDataList ? 4 : 6}>
                    Dataset Name
                </Col>
                {isReleasedDataList && (
                    <Col md={3}>
                        Project Group
                    </Col>
                )}
                <Col>
                   Type
                </Col>
                <Col>
                    Collection Date
                </Col>
                {isReleasedDataList ? null : (
                    <>
                        <Col>
                            Status
                        </Col>
                        <Col>
                            Action
                        </Col>
                    </>
                )}
                <Col>
                    View
                </Col>
            </Row>
        </Container>
    )
}

export default DatasetTableHeader;