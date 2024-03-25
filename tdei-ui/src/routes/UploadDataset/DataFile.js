import React from 'react';
import Typography from '@mui/material/Typography';

const DataFile = () => {
  return (
    <div>
      <Typography variant="h6" sx={{
        font: 'normal normal bold 16px/18px Lato',
        color: '#162848'
      }}>
      Attach data file<span style={{ color: 'red' }}> *</span>
      </Typography>
    </div>
  );
}

export default DataFile;