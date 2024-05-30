import React, { useCallback } from 'react';
import Typography from '@mui/material/Typography';
import Dropzone from '../../components/DropZone/Dropzone';
import MetaDataForm from './MetaDataForm/MetaDataForm';
import style from './MetaDataForm/MetaDataForm.module.css';

const Metadata = ({ selectedData, onSelectedFileChange }) => {
  const onDrop = (files) => {
    const selectedFile = files[0];
    console.log(selectedFile);
    onSelectedFileChange(selectedFile);
  };

  const handleUpdateFormData = useCallback((formData) => {
    if (selectedData instanceof File) {
      return;
    }
    onSelectedFileChange(formData);
  }, [selectedData, onSelectedFileChange]);

  return (
    <div>
      <Typography variant="h6" sx={{
        font: 'normal normal bold 16px/18px Lato',
        color: '#162848',
        marginBottom: "15px"
      }}>
        Attach metadata file<span style={{ color: 'red' }}> *</span>
      </Typography>
      <Dropzone onDrop={onDrop} accept={{ 'application/json': ['.json'] }} format={".json"} selectedFile={selectedData} />
      <div className={style.dottedLine}>
        <span className={style.dottedText}>OR</span>
      </div>
      <MetaDataForm selectedData={selectedData instanceof File ? null : selectedData } onUpdateFormData={handleUpdateFormData}/>
    </div>
  );
};

export default Metadata;