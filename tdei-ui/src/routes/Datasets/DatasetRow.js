import React from "react";
import style from "./Datasets.module.css";
import { Badge, Col, Container, Row } from "react-bootstrap";
import datasetRowIcon from "../../assets/img/dataset-row.svg";
import menuOptionIcon from "../../assets/img/menu-options.svg";
import { Link } from "react-router-dom";

const DatasetRow = ({ datasetName, version, type, collectionDate, status, onInspect, onAction, isReleasedList, projectGroup = "" }) => {
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
        borderLeft: `12px solid ${getStatusColor()}`
    };

    return (
        <Container className={style.datasetsTableRow} fluid style={leftBorderStyle}>
            <Row style={{ alignItems: "center", minHeight: '100px' }}>
                <Col md={6}>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <div>
                            <img src={datasetRowIcon} alt="Dataset Icon" />
                        </div>
                        <div style={{ marginLeft: '1rem' }}>
                            <p style={{ fontWeight: 600, marginBottom: '0px' }}>{datasetName}</p>
                            <p style={{ color: '#83879B' }}> {version}</p>
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
                <Col>
                    <Link onClick={onInspect} className={`${style['link-with-hover-underline']} ${style['link-inspect']}`}>
                        <span>Inspect</span>
                    </Link>
                </Col>
                {isReleasedList ? null : (
                    <Col>
                        <img src={menuOptionIcon} alt="Menu Options" onClick={onAction} />
                    </Col>
                )}
            </Row>
        </Container>
    )
}

export default DatasetRow;