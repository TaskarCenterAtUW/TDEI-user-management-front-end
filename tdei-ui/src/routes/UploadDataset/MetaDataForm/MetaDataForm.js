import React, { useState, useEffect, useCallback } from "react";
import { debounce } from 'lodash';
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
            dataset_type: '',
            tdeiServiceId: '',
            collection_date: '',
            valid_from: '',
            valid_to: '',
            custom_metadata: '',
            description: '',
            dataset_area: '',
            collection_method: '',
            data_source: '',
            schema_version: '',
            collected_by:''
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

    const debouncedUpdateFormData = useCallback(debounce(onUpdateFormData, 300), [onUpdateFormData]);

    useEffect(() => {
        if (selectedData) {
            // Initialize formData with selectedData details
            setFormData({
                datasetDetails: {
                    name: selectedData.datasetDetails.name || formData.datasetDetails.name,
                    version: selectedData.datasetDetails.version || formData.datasetDetails.version,
                    dataset_type: selectedData.datasetDetails.dataset_type || formData.datasetDetails.dataset_type,
                    tdeiServiceId: selectedData.datasetDetails.tdeiServiceId || formData.datasetDetails.tdeiServiceId,
                    collection_date: selectedData.datasetDetails.collection_date || formData.datasetDetails.collection_date,
                    valid_from: selectedData.datasetDetails.valid_from || formData.datasetDetails.valid_from,
                    valid_to: selectedData.datasetDetails.valid_to || formData.datasetDetails.valid_to,
                    custom_metadata: selectedData.datasetDetails.custom_metadata || formData.datasetDetails.custom_metadata,
                    description: selectedData.datasetDetails.description || formData.datasetDetails.description,
                    dataset_area: selectedData.datasetDetails.dataset_area || formData.datasetDetails.dataset_area,
                    collection_method: selectedData.datasetDetails.collection_method || formData.datasetDetails.collection_method,
                    data_source: selectedData.datasetDetails.data_source || formData.datasetDetails.data_source,
                    schema_version: selectedData.datasetDetails.schema_version || formData.datasetDetails.schema_version,
                    collected_by: selectedData.datasetDetails.collected_by || formData.datasetDetails.collected_by
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

    useEffect(() => {
        debouncedUpdateFormData(formData);
    }, [formData, debouncedUpdateFormData]);

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
