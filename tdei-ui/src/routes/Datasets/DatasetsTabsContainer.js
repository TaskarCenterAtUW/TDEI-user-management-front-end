import React from "react";
import { useState } from "react";
import datasetIcon from "../../assets/img/dataset-menu-item.svg";
import style from "./Datasets.module.css"
import releasedDatasets from "../../assets/img/released-data-sets.svg"
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import MyDatasets from "./MyDatasets";
import ReleasedDatasets from "./ReleasedDatasets";
import Container from "../../components/Container/Container";

// Overall tabs container for Datasets
const DatasetsTabsContainer = () => {
    const [key, setKey] = useState('myDatasets');
    return (
        <div className={style.datasetsLayout}>
        <Container className="d-flex align-items-center mt-2">
            <Tabs
                onSelect={(k) => setKey(k)}
                defaultActiveKey="myDatasets"
                className="mb-2"
            >
                <Tab eventKey="myDatasets" title={<span className={style.boldText}> <img className={style.smallMargin} src={datasetIcon} /> My Datasets</span>}>
                    <MyDatasets />
                </Tab>
                <Tab eventKey="releasedDatasets" title={<span className={style.boldText}> <img className={style.smallMargin} src={releasedDatasets} /> All Released Datasets</span>}>
                    <ReleasedDatasets />
                </Tab>
            </Tabs>
        </Container>
        </div>
    )
}

export default DatasetsTabsContainer;