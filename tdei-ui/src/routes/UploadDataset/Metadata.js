import React, {useCallback}  from 'react';
import Typography from '@mui/material/Typography';
import Dropzone from '../../components/DropZone/Dropzone';
import MetaDataForm from './MetaDataForm/MetaDataForm';
import style from './MetaDataForm/MetaDataForm.module.css'

// Functional component Metadata
const Metadata = ({ selectedData, onSelectedFileChange }) => {
  // Function to handle file drop
  const onDrop = (files) => {
    const selectedFile = files[0];
    console.log(selectedFile);
    onSelectedFileChange(selectedFile);
  };
  const handleUpdateFormData = useCallback((formData) => {
    // Check if formData is empty or if selectedData exists
    if(selectedData instanceof File){
      return;
    }
    const hasFile = !!(selectedData || Object.values(formData).some(value => !!value));
    onSelectedFileChange(formData);
    },[selectedData]) 
  return (
    <div>
      <Typography variant="h6" sx={{
        font: 'normal normal bold 16px/18px Lato',
        color: '#162848',
        marginBottom: "15px"
      }}>
        Attach metadata file<span style={{ color: 'red' }}> *</span>
      </Typography>
      <Dropzone onDrop={onDrop} accept={{
        'application/json': ['.json']
      }} format={".json"} selectedFile={selectedData} />
      <div className={style.dottedLine}>
        <span className={style.dottedText}>OR</span>
      </div>
      <MetaDataForm selectedData={selectedData instanceof File ? null : selectedData } onUpdateFormData={handleUpdateFormData}/>
    </div>
  );
};

export default Metadata;