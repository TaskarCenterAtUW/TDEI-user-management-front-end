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
            datasetArea: GEOJSON,
            collectionMethod: '',
            dataSource: ''
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
                    name: selectedData.name || formData.datasetDetails.name,
                    version: selectedData.version || formData.datasetDetails.version,
                    datasetType: selectedData.type || formData.datasetDetails.datasetType,
                    tdeiServiceId: selectedData.serviceId || formData.datasetDetails.tdeiServiceId,
                    collectionDate: selectedData.collectionDate || formData.datasetDetails.collectionDate,
                    validFrom: selectedData.validFrom || formData.datasetDetails.validFrom,
                    validTo: selectedData.validTo || formData.datasetDetails.validTo,
                    customMetadata: selectedData.customMetadata || formData.datasetDetails.customMetadata,
                    description: selectedData.description || formData.datasetDetails.description,
                    datasetArea: selectedData.area || GEOJSON,
                    collectionMethod: selectedData.collectionMethod || formData.datasetDetails.collectionMethod,
                    dataSource: selectedData.source || formData.datasetDetails.source
                },
                dataProvenance: {
                    datasetFullName: selectedData.fullName || formData.datasetDetails.fullName,
                    otherPublishedLocations: selectedData.otherLocations || formData.datasetDetails.otherLocations,
                    updateFrequency: selectedData.updateFrequency || formData.datasetDetails.updateFrequency,
                    schemaValidationRun: selectedData.schemaValidation || formData.datasetDetails.schemaValidation,
                    allowCrowdContribution: selectedData.allowContribution || formData.datasetDetails.allowContribution,
                    schemaValidationRunDesc: selectedData.schemaValidationDescription || formData.datasetDetails.schemaValidationDescription,
                    locationInaccuracyFactors: selectedData.locationInaccuracy || formData.datasetDetails.locationInaccuracy
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
