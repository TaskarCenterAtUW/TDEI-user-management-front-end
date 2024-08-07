import React from 'react';
import Typography from '@mui/material/Typography';
import Dropzone from '../../components/DropZone/Dropzone';

// Functional component Changeset
const Changeset = ({ selectedData, onSelectedFileChange }) => {
  // Function to handle file drop
  const onDrop = (files) => {
    const selectedFile = files[0];
    onSelectedFileChange(selectedFile);
  };
  return (
    <div>
      <Typography variant="h6" sx={{
        font: 'normal normal bold 16px/18px Lato',
        color: '#162848',
        marginBottom: "15px"
      }}>
       Attach changeset file
      </Typography>
      <Dropzone onDrop={onDrop} accept={{
        "text/plain": [".txt"]
      }} format={".txt"} selectedFile={selectedData} />
    </div>
  );
};

export default Changeset;