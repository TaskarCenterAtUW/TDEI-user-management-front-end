import React, { useCallback } from 'react';
import Typography from '@mui/material/Typography';
import Dropzone from '../../components/DropZone/Dropzone';
import MetaDataForm from './MetaDataForm/MetaDataForm';
import style from './MetaDataForm/MetaDataForm.module.css';

const Metadata = ({ selectedData, onSelectedFileChange }) => {
  const onDrop = (files) => {
    const selectedFile = files[0];
    if(selectedFile){
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const parsedData = JSON.parse(e.target.result);
          const finalData =  {
              ...parsedData,
              dataset_detail: {
                ...parsedData.dataset_detail,
                custom_metadata: parsedData.dataset_detail && parsedData.dataset_detail.custom_metadata ? JSON.stringify(parsedData.dataset_detail.custom_metadata, null, 2) : "",
                dataset_area: parsedData.dataset_detail && parsedData.dataset_detail.dataset_area ? JSON.stringify(parsedData.dataset_detail.dataset_area, null, 2) : ""
              }
          };
          onSelectedFileChange({ file : selectedFile, formData: finalData }); 
        } catch (error) {
          console.error("Error parsing JSON:", error);
          onSelectedFileChange({ file: null, formData: null });
        }
      };
      reader.readAsText(selectedFile);
    }else {
      onSelectedFileChange({ file: null, formData: {
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
            "key_limitations_of_the_dataset": "",
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
    } });
    }
  };

  const handleUpdateFormData = useCallback((formData) => {
    if (selectedData && selectedData.file instanceof File) {
      onSelectedFileChange({ file: selectedData.file, formData: formData })
    } else {
      onSelectedFileChange(formData);
    }
    // eslint-disable-next-line
  }, [onSelectedFileChange]);

  return (
    <div>
      <Typography variant="h6" sx={{
        font: 'normal normal bold 16px/18px Lato',
        color: '#162848',
        marginBottom: "15px"
      }}>
        Attach metadata file<span style={{ color: 'red' }}> *</span>
      </Typography>
      <Dropzone onDrop={onDrop} accept={{ 'application/json': ['.json'] }} format={".json"} selectedFile={selectedData && selectedData.file instanceof File ? selectedData.file : null} />
      <div className={style.dottedLine}>
        <span className={style.dottedText}>OR</span>
      </div>
      <MetaDataForm selectedData={selectedData && selectedData.file instanceof File ? selectedData.formData : selectedData && selectedData.file === null ? selectedData.formData : selectedData  } onUpdateFormData={handleUpdateFormData}/>
    </div>
  );
};

export default Metadata;