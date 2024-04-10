import * as React from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';

export default function PaginationComponent() {
  return (
    <React.Fragment>
      <hr />
      <Grid container justifyContent="space-between" alignItems="center">
      <Grid item>
          <span>Showing 1 to 10 of 26 entries</span>
        </Grid>
        <Grid item>
          <Pagination count={5} shape="rounded"  sx={{'& .MuiPaginationItem-root': {
            '&.Mui-selected': {
              background: '#4DA9AD',
              color: 'white',
            },
          }}}/>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
