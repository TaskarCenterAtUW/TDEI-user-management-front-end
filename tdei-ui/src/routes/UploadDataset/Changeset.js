import React from 'react';
import Typography from '@mui/material/Typography';

const Changeset = () => {
  return (
    <div>
         <Typography variant="h6" sx={{
        font: 'normal normal bold 16px/18px Lato',
        color: '#162848'
      }}>
       Attach changeset file or input the details
      </Typography>
    </div>
  );
}

export default Changeset;