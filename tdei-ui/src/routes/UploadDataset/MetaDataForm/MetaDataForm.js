import React from "react";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import style from "./MetaDataForm.module.css"
import { useState, useEffect } from "react";

const MetaDataForm = () => {
    const [key, setKey] = useState('datasetDetails');
  return (
   <div>
    <div style={{paddingTop:"20px"}}>
        <div >
                <Tabs
                    activeKey={key}
                    onSelect={(k) => setKey(k)}
                    className="mb-2"
                >
                    <Tab eventKey="datasetDetails" title={<span className={style.boldText}> Dataset Details</span>}>
                    Dataset Details
                    </Tab>
                    <Tab eventKey="dataProvenance" title={<span className={style.boldText}> Data Provenance</span>}>
                    Data Provenance
                    </Tab>
                    <Tab eventKey="datasetSummary" title={<span className={style.boldText}> Dataset Summary</span>}>
                    Dataset Summary
                    </Tab>
                    <Tab eventKey="maintenance" title={<span className={style.boldText}> Maintenance</span>}>
                    Maintenance
                    </Tab>
                    <Tab eventKey="methodology" title={<span className={style.boldText}> Methodology</span>}>
                    Methodology
                    </Tab>
                </Tabs>
            </div>
   </div>
   </div>
  );
};

export default MetaDataForm;
