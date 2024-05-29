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
    const [key, setKey] = useState('dataset_detail');
    const [formData, setFormData] = useState({
        "dataset_detail": {
            "name": null,
            "version": null,
            "derived_from_dataset_id": null,
            "collection_date": null,
            "valid_from": null,
            "valid_to": null,
            "custom_metadata": null,
            "description": null,
            "dataset_area": null,
            "collection_method": null,
            "data_source": null,
            "schema_version": null,
            "collected_by": null
        },
        "data_provenance": {
            "full_dataset_name": null,
            "other_published_locations": null,
            "dataset_update_frequency_months": null,
            "schema_validation_run": null,
            "allow_crowd_contributions": null,
            "schema_validation_run_description": null,
            "location_inaccuracy_factors": null
        },
        "dataset_summary": {
            "collection_name": null,
            "department_name": null,
            "city": null,
            "region": null,
            "county": null,
            "key_limitations_of_the_dataset": null,
            "challenges": null
        },
        "maintenance": {
            "official_maintainer": [],
            "last_updated": null,
            "update_frequency": null,
            "authorization_chain": null,
            "maintenance_funded": null,
            "funding_details": null
        },
        "methodology": {
            "point_data_collection_device": null,
            "node_locations_and_attributes_editing_software": null,
            "data_collected_by_people": null,
            "data_collectors": null,
            "data_captured_automatically": null,
            "automated_collection": null,
            "data_collectors_organization": null,
            "data_collector_compensation": null,
            "preprocessing_location": null,
            "preprocessing_by": null,
            "preprocessing_steps": null,
            "data_collection_preprocessing_documentation": null,
            "documentation_uri": null,
            "validation_process_exists": null,
            "validation_process_description": null,
            "validation_conducted_by": null,
            "excluded_data": null,
            "excluded_data_reason": null
        }
    });

    const debouncedUpdateFormData = useCallback(debounce(onUpdateFormData, 300), [onUpdateFormData]);

    useEffect(() => {
        if (selectedData && !(selectedData instanceof File)) {
            // Initialize formData with selectedData details
            setFormData({
                dataset_detail: {
                    name: selectedData.dataset_detail.name || formData.dataset_detail.name,
                    version: selectedData.dataset_detail.version || formData.dataset_detail.version,
                    derived_from_dataset_id: selectedData.dataset_detail.derived_from_dataset_id || formData.dataset_detail.derived_from_dataset_id,
                    collection_date: selectedData.dataset_detail.collection_date || formData.dataset_detail.collection_date,
                    valid_from: selectedData.dataset_detail.valid_from || formData.dataset_detail.valid_from,
                    valid_to: selectedData.dataset_detail.valid_to || formData.dataset_detail.valid_to,
                    custom_metadata: selectedData.dataset_detail.custom_metadata || formData.dataset_detail.custom_metadata,
                    description: selectedData.dataset_detail.description || formData.dataset_detail.description,
                    dataset_area: selectedData.dataset_detail.dataset_area || formData.dataset_detail.dataset_area,
                    collection_method: selectedData.dataset_detail.collection_method || formData.dataset_detail.collection_method,
                    data_source: selectedData.dataset_detail.data_source || formData.dataset_detail.data_source,
                    schema_version: selectedData.dataset_detail.schema_version || formData.dataset_detail.schema_version,
                    collected_by: selectedData.dataset_detail.collected_by || formData.dataset_detail.collected_by
                },
                data_provenance: {
                    full_dataset_name: selectedData.data_provenance.full_dataset_name || formData.data_provenance.full_dataset_name,
                    other_published_locations: selectedData.data_provenance.other_published_locations || formData.data_provenance.other_published_locations,
                    dataset_update_frequency_months: selectedData.data_provenance.dataset_update_frequency_months || formData.data_provenance.dataset_update_frequency_months,
                    schema_validation_run: selectedData.data_provenance.schema_validation_run || formData.data_provenance.schema_validation_run,
                    allow_crowd_contributions: selectedData.data_provenance.allow_crowd_contributions || formData.data_provenance.allow_crowd_contributions,
                    schema_validation_run_description: selectedData.data_provenance.schema_validation_run_description || formData.data_provenance.schema_validation_run_description,
                    location_inaccuracy_factors: selectedData.data_provenance.location_inaccuracy_factors || formData.data_provenance.location_inaccuracy_factors
                },
                dataset_summary: {
                    collection_name: selectedData.dataset_summary.collection_name || formData.dataset_summary.collection_name,
                    department_name: selectedData.dataset_summary.department_name || formData.dataset_summary.department_name,
                    city:selectedData.dataset_summary.city || formData.dataset_summary.city,
                    region:selectedData.dataset_summary.region || formData.dataset_summary.region,
                    county:selectedData.dataset_summary.county || formData.dataset_summary.county,
                    key_limitations_of_the_dataset:selectedData.dataset_summary.key_limitations_of_the_dataset || formData.dataset_summary.key_limitations_of_the_dataset,
                    challenges:selectedData.dataset_summary.challenges || formData.dataset_summary.challenges,
                },
                maintenance: {
                    official_maintainer: selectedData.maintenance.official_maintainer || formData.maintenance.official_maintainer,
                    last_updated: selectedData.maintenance.last_updated || formData.maintenance.last_updated,
                    update_frequency: selectedData.maintenance.update_frequency || formData.maintenance.update_frequency,
                    authorization_chain: selectedData.maintenance.authorization_chain || formData.maintenance.authorization_chain,
                    maintenance_funded: selectedData.maintenance.maintenance_funded || formData.maintenance.maintenance_funded,
                    funding_details: selectedData.maintenance.funding_details || formData.maintenance.funding_details,
                },
                methodology: {
                    point_data_collection_device: selectedData.methodology.point_data_collection_device || formData.methodology.point_data_collection_device,
                    node_locations_and_attributes_editing_software: selectedData.methodology.node_locations_and_attributes_editing_software || formData.methodology.node_locations_and_attributes_editing_software,
                    data_collected_by_people: selectedData.methodology.data_collected_by_people || formData.methodology.data_collected_by_people,
                    data_collectors: selectedData.methodology.data_collectors || formData.methodology.data_collectors,
                    data_captured_automatically: selectedData.methodology.data_captured_automatically || formData.methodology.data_captured_automatically,
                    automated_collection: selectedData.methodology.automated_collection || formData.methodology.automated_collection,
                    data_collectors_organization: selectedData.methodology.data_collectors_organization || formData.methodology.data_collectors_organization,
                    data_collector_compensation: selectedData.methodology.data_collector_compensation || formData.methodology.data_collector_compensation,
                    preprocessing_location: selectedData.methodology.preprocessing_location || formData.methodology.preprocessing_location,
                    preprocessing_by: selectedData.methodology.preprocessing_by || formData.methodology.preprocessing_by,
                    preprocessing_steps: selectedData.methodology.preprocessing_steps || formData.methodology.preprocessing_steps,
                    data_collection_preprocessing_documentation: selectedData.methodology.data_collection_preprocessing_documentation || formData.methodology.data_collection_preprocessing_documentation,
                    documentation_uri: selectedData.methodology.documentation_uri || formData.methodology.documentation_uri,
                    validation_process_exists: selectedData.methodology.validation_process_exists || formData.methodology.validation_process_exists,
                    validation_process_description: selectedData.methodology.validation_process_description || formData.methodology.validation_process_description,
                    validation_conducted_by: selectedData.methodology.validation_conducted_by || formData.methodology.validation_conducted_by,
                    excluded_data: selectedData.methodology.excluded_data || formData.methodology.excluded_data,
                    excluded_data_reason: selectedData.methodology.excluded_data_reason || formData.methodology.excluded_data_reason,
                }
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
                        <Tab eventKey="dataset_detail" title={<span className={style.boldText}> Dataset Details</span>}>
                        <DatasetDetails formData={formData.dataset_detail} updateFormData={(values) => handleUpdateFormData('dataset_detail', values)} />
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
