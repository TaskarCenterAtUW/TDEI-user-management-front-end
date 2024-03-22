import React from "react";
import { useState } from "react";
import { Button } from "react-bootstrap";
import datasetIcon from "../../assets/img/dataset-menu-item.svg";
import style from "./Datasets.module.css"
import releasedDatasets from "../../assets/img/released-data-sets.svg"
import DatasetTableHeader from "./DatasetTableHeader";
import DatasetRow from "./DatasetRow";

// Overall tabs container for Datasets
const DatasetsTabsContainer = () => {
    const [key, setKey] = useState('home');
    return (
        <div style={{padding:"1.5rem"}}>
        <div className={style.datasetsTabsHeaderContainer}>
            
                <div className={style.datasetsTabsHeader}>
                <img src = {datasetIcon} />
                <div className={style.smallMargin}>
                <p className={style.boldText}> My Datasets</p>
                </div>
                </div>

                <div className={style.datasetsTabsHeaderActive}>
                <img src = {releasedDatasets} />
                <div className={style.smallMargin}>
                <p className={style.boldText}> All Released Datasets </p>
                </div>
                </div> 
        </div>
        <hr/> 
        <DatasetTableHeader/>
        <DatasetRow/>
        <DatasetRow/>
        <DatasetRow/>
        <DatasetRow/>
        <DatasetRow/>
        <DatasetRow/>
        <DatasetRow/>
        </div>
    )
}

export default DatasetsTabsContainer;