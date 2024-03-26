import React from 'react';
import Typography from '@mui/material/Typography';
import Dropzone from '../../components/DropZone/Dropzone';

const DataFile = () => {
  const onDrop = () => {}
  return (
    <div>
      <Typography variant="h6" sx={{
        font: 'normal normal bold 16px/18px Lato',
        color: '#162848',
        marginBottom:"15px"
      }}>
      Attach data file<span style={{ color: 'red' }}> *</span>
      </Typography>
      <Dropzone onDrop={onDrop} accept={{
    'application/zip': ['.zip']}} format={".zip"} />
    </div>
  );
}

export default DataFile;