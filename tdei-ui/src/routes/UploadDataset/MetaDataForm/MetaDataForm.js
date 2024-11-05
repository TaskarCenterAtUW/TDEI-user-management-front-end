import React, { useState, useEffect, useRef } from "react";
import { isEqual } from 'lodash';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import style from "./MetaDataForm.module.css";
import DatasetDetails from "./DatasetDetails";
import DatasetProvenance from "./DataProvenance";
import DatasetSummary from "./DatasetSummary";
import Maintenance from "./Maintenance";
import Methodology from "./Methodology";

const MetaDataForm = ({ selectedData, onUpdateFormData, dataType, isDatasetPublished = false }) => {
    const [key, setKey] = useState('dataset_detail');
    const [formData, setFormData] = useState({
        "dataset_detail": {
            "name": "",
            "version": "",
            "collection_date": "",
            "valid_from": "",
            "valid_to": "",
            "custom_metadata": "",
            "description": "",
            "dataset_area": "",
            "collection_method": "",
            "data_source": "",
            "schema_version": "",
            "collected_by": ""
        },
        "data_provenance": {
            "full_dataset_name": "",
            "other_published_locations": "",
            "dataset_update_frequency_months": "",
            "schema_validation_run": null,
            "allow_crowd_contributions": null,
            "schema_validation_run_description": "",
            "location_inaccuracy_factors": ""
        },
        "dataset_summary": {
            "collection_name": "",
            "department_name": "",
            "city": "",
            "region": "",
            "county": "",
            "key_limitations": "",
            "release_notes":"",
            "challenges": ""
        },
        "maintenance": {
            "official_maintainer": null,
            "last_updated": "",
            "update_frequency": "",
            "authorization_chain": "",
            "maintenance_funded": null,
            "funding_details": ""
        },
        "methodology": {
            "point_data_collection_device": "",
            "node_locations_and_attributes_editing_software": "",
            "data_collected_by_people": null,
            "data_collectors": "",
            "data_captured_automatically": null,
            "automated_collection": "",
            "data_collectors_organization": "",
            "data_collector_compensation": "",
            "preprocessing_location": "",
            "preprocessing_by": "",
            "preprocessing_steps": "",
            "data_collection_preprocessing_documentation": null,
            "documentation_uri": "",
            "validation_process_exists": null,
            "validation_process_description": "",
            "validation_conducted_by": "",
            "excluded_data": "",
            "excluded_data_reason": ""
        }
    });

    // Ref to track if the component is mounted
    const isMountedRef = useRef(false);
    // Ref to store the previous form data
    const prevFormDataRef = useRef(formData);

    // Effect to update the isMountedRef when the component mounts/unmounts
    useEffect(() => {
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
        };
    }, []);
    // Effect to update formData when selectedData changes, if it is not a File instance
    useEffect(() => {
        if (selectedData && !(selectedData instanceof File)) {
            if (!isEqual(selectedData, formData)) {
                setFormData(selectedData);
            }
        }else{
            setFormData({
                "dataset_detail": {
                    "name": "",
                    "version": "",
                    "collection_date": "",
                    "valid_from": "",
                    "valid_to": "",
                    "custom_metadata": "",
                    "description": "",
                    "dataset_area": "",
                    "collection_method": "",
                    "data_source": "",
                    "schema_version": "",
                    "collected_by": ""
                },
                "data_provenance": {
                    "full_dataset_name": "",
                    "other_published_locations": "",
                    "dataset_update_frequency_months": "",
                    "schema_validation_run": null,
                    "allow_crowd_contributions": null,
                    "schema_validation_run_description": "",
                    "location_inaccuracy_factors": ""
                },
                "dataset_summary": {
                    "collection_name": "",
                    "department_name": "",
                    "city": "",
                    "region": "",
                    "county": "",
                    "key_limitations": "",
                    "release_notes":"",
                    "challenges": ""
                },
                "maintenance": {
                    "official_maintainer": null,
                    "last_updated": "",
                    "update_frequency": "",
                    "authorization_chain": "",
                    "maintenance_funded": null,
                    "funding_details": ""
                },
                "methodology": {
                    "point_data_collection_device": "",
                    "node_locations_and_attributes_editing_software": "",
                    "data_collected_by_people": null,
                    "data_collectors": "",
                    "data_captured_automatically": null,
                    "automated_collection": "",
                    "data_collectors_organization": "",
                    "data_collector_compensation": "",
                    "preprocessing_location": "",
                    "preprocessing_by": "",
                    "preprocessing_steps": "",
                    "data_collection_preprocessing_documentation": null,
                    "documentation_uri": "",
                    "validation_process_exists": null,
                    "validation_process_description": "",
                    "validation_conducted_by": "",
                    "excluded_data": "",
                    "excluded_data_reason": ""
                }
            });
        }
    }, [selectedData]);
    // Effect to call onUpdateFormData when formData changes and the component is mounted
    useEffect(() => {
        if (isMountedRef.current && !isEqual(formData, prevFormDataRef.current)) {
            onUpdateFormData(formData);
            prevFormDataRef.current = formData;
        }
    }, [formData, onUpdateFormData]);
    
    // Function to handle updates to formData
    const handleUpdateFormData = (section, values) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            [section]: {
                ...prevFormData[section],
                ...values,
            },
        }));
    };

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
                        <Tab eventKey="dataset_detail" title={<span className={style.boldText}> Dataset Details</span>}>
                        <DatasetDetails dataType={dataType} isDatasetPublished={isDatasetPublished} formData={formData.dataset_detail} updateFormData={(values) => handleUpdateFormData('dataset_detail', values)} />
                        </Tab>
                        <Tab eventKey="data_provenance" title={<span className={style.boldText}> Data Provenance</span>}>
                        <DatasetProvenance formData={formData.data_provenance} updateFormData={(values) => handleUpdateFormData('data_provenance', values)} />
                        </Tab>
                        <Tab eventKey="dataset_summary" title={<span className={style.boldText}> Dataset Summary</span>}>
                        <DatasetSummary formData={formData.dataset_summary} updateFormData={(values) => handleUpdateFormData('dataset_summary', values)} />
                        </Tab>
                        <Tab eventKey="maintenance" title={<span className={style.boldText}> Maintenance</span>}>
                        <Maintenance formData={formData.maintenance} updateFormData={(values) => handleUpdateFormData('maintenance', values)} />
                        </Tab>
                        <Tab eventKey="methodology" title={<span className={style.boldText}> Methodology</span>}>
                        <Methodology formData={formData.methodology} updateFormData={(values) => handleUpdateFormData('methodology', values)} />
                        </Tab>
                    </Tabs>
                </div>
            </div>
        </div>
    );
};

export default MetaDataForm;
