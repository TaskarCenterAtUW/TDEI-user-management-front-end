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
            derived_from_dataset_id: '',
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
            full_dataset_name: '',
            other_published_locations: '',
            dataset_update_frequency_months: '',
            schema_validation_run: '',
            allow_crowd_contributions: '',
            schema_validation_run_description: '',
            location_inaccuracy_factors: '',
        },
        datasetSummary: {
            collection_name:'',
            department_name:'',
            city:'',
            region:'',
            county:'',
            key_limitations_of_the_dataset:'',
            challenges:''

        },
        maintenance: {},
        methodology: {}
    });

    const debouncedUpdateFormData = useCallback(debounce(onUpdateFormData, 300), [onUpdateFormData]);

    useEffect(() => {
        if (selectedData && !(selectedData instanceof File)) {
            // Initialize formData with selectedData details
            setFormData({
                datasetDetails: {
                    name: selectedData.datasetDetails.name || formData.datasetDetails.name,
                    version: selectedData.datasetDetails.version || formData.datasetDetails.version,
                    derived_from_dataset_id: selectedData.datasetDetails.derived_from_dataset_id || formData.datasetDetails.derived_from_dataset_id,
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
                    full_dataset_name: selectedData.dataProvenance.full_dataset_name || formData.dataProvenance.full_dataset_name,
                    other_published_locations: selectedData.dataProvenance.other_published_locations || formData.dataProvenance.other_published_locations,
                    dataset_update_frequency_months: selectedData.dataProvenance.dataset_update_frequency_months || formData.dataProvenance.dataset_update_frequency_months,
                    schema_validation_run: selectedData.dataProvenance.schema_validation_run || formData.dataProvenance.schema_validation_run,
                    allow_crowd_contributions: selectedData.dataProvenance.allow_crowd_contributions || formData.dataProvenance.allow_crowd_contributions,
                    schema_validation_run_description: selectedData.dataProvenance.schema_validation_run_description || formData.dataProvenance.schema_validation_run_description,
                    location_inaccuracy_factors: selectedData.dataProvenance.location_inaccuracy_factors || formData.dataProvenance.location_inaccuracy_factors
                },
                datasetSummary: {
                    collection_name: selectedData.datasetSummary.collection_name || formData.datasetSummary.collection_name,
                    department_name: selectedData.datasetSummary.department_name || formData.datasetSummary.department_name,
                    city:selectedData.datasetSummary.city || formData.datasetSummary.city,
                    region:selectedData.datasetSummary.region || formData.datasetSummary.region,
                    county:selectedData.datasetSummary.county || formData.datasetSummary.county,
                    key_limitations_of_the_dataset:selectedData.datasetSummary.key_limitations_of_the_dataset || formData.datasetSummary.key_limitations_of_the_dataset,
                    challenges:selectedData.datasetSummary.challenges || formData.datasetSummary.challenges,
                },
                maintenance: {},
                methodology: {}
            });
        }
    }, [selectedData]);

    useEffect(() => {
        onUpdateFormData(formData);
    }, [formData,onUpdateFormData]);

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
                        <Tab eventKey="datasetDetails" title={<span className={style.boldText}> Dataset Details</span>}>
                        <DatasetDetails formData={formData.datasetDetails} updateFormData={(values) => handleUpdateFormData('datasetDetails', values)} />
                        </Tab>
                        <Tab eventKey="dataProvenance" title={<span className={style.boldText}> Data Provenance</span>}>
                        <DatasetProvenance formData={formData.dataProvenance} updateFormData={(values) => handleUpdateFormData('dataProvenance', values)} />
                        </Tab>
                        <Tab eventKey="datasetSummary" title={<span className={style.boldText}> Dataset Summary</span>}>
                        <DatasetSummary formData={formData.datasetSummary} updateFormData={(values) => handleUpdateFormData('datasetSummary', values)} />
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
