import React, { useState } from "react";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import style from "./MetaDataForm.module.css";
import DatasetDetails from "./DatasetDetails";
import DatasetProvenance from "./DataProvenance";
import DatasetSummary from "./DatasetSummary";
import Maintenance from "./Maintenance";
import Methodology from "./Methodology";
import { GEOJSON } from "../../../utils";

const MetaDataForm = ({ selectedData , onUpdateFormData }) => {
    const [key, setKey] = useState('datasetDetails');
    const [formData, setFormData] = useState({
        datasetDetails: {
            name: '',
            version: '',
            datasetType: '',
            tdeiServiceId: '',
            collectionDate: '',
            validFrom: '',
            validTo: '',
            customMetadata: '',
            description: '',
            datasetArea: '',
            collectionMethod: '',
            dataSource: '',
            schemaVersion: ''
        },
        dataProvenance: {
            datasetFullName: '',
            otherPublishedLocations: '',
            updateFrequency: '',
            schemaValidationRun: '',
            allowCrowdContribution: '',
            schemaValidationRunDesc: '',
            locationInaccuracyFactors: ''
        },
        datasetSummary: {},
        maintenance: {},
        methodology: {}

    });
    React.useEffect(() => {
        if (selectedData) {
            // Initialize formData with selectedData details
            setFormData({
                datasetDetails: {
                    name: selectedData.datasetDetails.name || formData.datasetDetails.name,
                    version: selectedData.datasetDetails.version || formData.datasetDetails.version,
                    datasetType: selectedData.datasetDetails.datasetType || formData.datasetDetails.datasetType,
                    tdeiServiceId: selectedData.datasetDetails.tdeiServiceId || formData.datasetDetails.tdeiServiceId,
                    collectionDate: selectedData.datasetDetails.collectionDate || formData.datasetDetails.collectionDate,
                    validFrom: selectedData.datasetDetails.validFrom || formData.datasetDetails.validFrom,
                    validTo: selectedData.datasetDetails.validTo || formData.datasetDetails.validTo,
                    customMetadata: selectedData.datasetDetails.customMetadata || formData.datasetDetails.customMetadata,
                    description: selectedData.datasetDetails.description || formData.datasetDetails.description,
                    datasetArea: selectedData.datasetDetails.datasetArea || formData.datasetDetails.datasetArea,
                    collectionMethod: selectedData.datasetDetails.collectionMethod || formData.datasetDetails.collectionMethod,
                    dataSource: selectedData.datasetDetails.dataSource || formData.datasetDetails.dataSource,
                    schemaVersion: selectedData.datasetDetails.schemaVersion || formData.datasetDetails.schemaVersion,
                    collectedBy: selectedData.datasetDetails.collectedBy || formData.datasetDetails.collectedBy
                },
                dataProvenance: {
                    datasetFullName: selectedData.dataProvenance.fullName || formData.datasetDetails.fullName,
                    otherPublishedLocations: selectedData.dataProvenance.otherLocations || formData.datasetDetails.otherLocations,
                    updateFrequency: selectedData.dataProvenance.updateFrequency || formData.datasetDetails.updateFrequency,
                    schemaValidationRun: selectedData.dataProvenance.schemaValidation || formData.datasetDetails.schemaValidation,
                    allowCrowdContribution: selectedData.dataProvenance.allowContribution || formData.datasetDetails.allowContribution,
                    schemaValidationRunDesc: selectedData.dataProvenance.schemaValidationDescription || formData.datasetDetails.schemaValidationDescription,
                    locationInaccuracyFactors: selectedData.dataProvenance.locationInaccuracy || formData.datasetDetails.locationInaccuracy
                },
                datasetSummary: {},
                maintenance: {},
                methodology: {}
            });
        }
    }, [selectedData]);

    React.useEffect(() => {
        onUpdateFormData(formData);
    }, [formData, onUpdateFormData]);

    return (
        <div>
            <div style={{ paddingTop: "20px" }}>
                <div>
                    <Tabs
                        activeKey={key}
                        onSelect={(k) => {
                            setKey(k);
                        }}
                        className="mb-2"
                    >
                        <Tab eventKey="datasetDetails" title={<span className={style.boldText}> Dataset Details</span>}>
                            <DatasetDetails formData={formData.datasetDetails} updateFormData={(values) => setFormData({ ...formData, datasetDetails: { ...formData.datasetDetails, ...values } })} />
                        </Tab>
                        <Tab eventKey="dataProvenance" title={<span className={style.boldText}> Data Provenance</span>}>
                            <DatasetProvenance formData={formData.dataProvenance} updateFormData={(values) => setFormData({ ...formData, dataProvenance: { ...formData.dataProvenance, ...values } })} />
                        </Tab>
                        <Tab eventKey="datasetSummary" title={<span className={style.boldText}> Dataset Summary</span>}>
                            <DatasetSummary formData={formData.datasetSummary} updateFormData={(values) => setFormData({ ...formData, datasetSummary: { ...formData.datasetSummary, ...values } })} />
                        </Tab>
                        <Tab eventKey="maintenance" title={<span className={style.boldText}> Maintenance</span>}>
                            <Maintenance formData={formData.maintenance} updateFormData={(values) => setFormData({ ...formData, maintenance: { ...formData.maintenance, ...values } })} />
                        </Tab>
                        <Tab eventKey="methodology" title={<span className={style.boldText}> Methodology</span>}>
                            <Methodology formData={formData.methodology} updateFormData={(values) => setFormData({ ...formData, methodology: { ...formData.methodology, ...values } })} />
                        </Tab>
                    </Tabs>
                </div>
            </div>
        </div>
    );
};

export default MetaDataForm;
