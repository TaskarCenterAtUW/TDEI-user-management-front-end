import React from 'react';
import Typography from '@mui/material/Typography';

const Metadata = () => {
  return (
    <div>
         <Typography variant="h6" sx={{
        font: 'normal normal bold 16px/18px Lato',
        color: '#162848'
      }}>
       Attach metadata file or fill up the form<span style={{ color: 'red' }}> *</span>
      </Typography>
    </div>
  );
}

export default Metadata;