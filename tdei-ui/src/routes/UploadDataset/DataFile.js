import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Dropzone from '../../components/DropZone/Dropzone';
import Box from '@mui/material/Box';
import InfoIcon from '@mui/icons-material/Info';
import Tooltip from '@mui/material/Tooltip';
import style from './UploadDataset.module.css';
import { Form } from "react-bootstrap";

// Functional component DataFile
const DataFile = ({ selectedData = {}, onSelectedFileChange }) => {
  const [derivedDatasetId, setDerivedDatasetId] = useState('');

  useEffect(() => {
    if (selectedData.derived_from_dataset_id) {
      setDerivedDatasetId(selectedData.derived_from_dataset_id);
    }
  }, [selectedData]);

  // Function to handle file drop
  const onDrop = (files) => {
    const selectedFile = files[0];
    onSelectedFileChange({ derived_from_dataset_id: derivedDatasetId, file: selectedFile });
  };

  // Function to handle derived dataset ID change
  const handleDerivedDatasetIdChange = (event) => {
    const id = event.target.value;
    setDerivedDatasetId(id);
    onSelectedFileChange({ derived_from_dataset_id: id, file: selectedData.file });
  };

  return (
    <div>
      <Box
        sx={{
          backgroundColor: '#f5f5f5',
          padding: '16px',
          borderRadius: '5px',
          marginBottom: '20px',
        }}
      >
        <div className={style.derivedDatasetTitle}>
          Derived from dataset Id <span className={style.derivedDatasetSubtile}>(Optional)</span>
        </div>
        <Form.Group controlId="derived_from_dataset_id" style={{ marginBottom: '10px', width: "400px" }}>
          <Form.Control
            type="text"
            placeholder="Enter dataset Id"
            name="derived_from_dataset_id"
            value={derivedDatasetId}
            onChange={handleDerivedDatasetIdChange}
          />
        </Form.Group>
        <Box display="flex" alignItems="center">
          <Tooltip title="ID of the dataset that is already in TDEI from which this dataset is derived from" arrow>
            <InfoIcon fontSize="small" sx={{ marginRight: '4px', color: '#888',fontSize:"14px" }} />
          </Tooltip>
          <div className={style.derivedDatasetHint}>
            ID of the dataset that is already in TDEI from which this dataset is derived from
          </div>
        </Box>
      </Box>
      <Typography variant="h6" sx={{
        font: 'normal normal bold 16px/18px Lato',
        color: '#162848',
        marginBottom: "15px"
      }}>
        Attach data file<span style={{ color: 'red' }}> *</span>
      </Typography>
      <Dropzone onDrop={onDrop} accept={{ 'application/zip': ['.zip'] }} format={".zip"} selectedFile={selectedData.file} />
    </div>
  );
};

export default DataFile;