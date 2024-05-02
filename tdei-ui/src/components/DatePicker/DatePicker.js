import * as React from 'react';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';

export default function DatePicker() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DesktopDatePicker defaultValue={dayjs('2022-04-17')} sx={{
            "& .MuiInputBase-input": {
              height: "8px" 
            }
          }} />
    </LocalizationProvider>
  );
}