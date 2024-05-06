import * as React from 'react';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';

export default function DatePicker({label}) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DesktopDatePicker  
        sx={{
            "& .MuiInputBase-input": {
              height: "5px",
              width:"200px"
            },
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#E0E0E0',
              },
              '&:hover fieldset': {
                borderColor: '#E0E0E0',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#4382F7',
              },
            },
            '& .MuiInputBase-input::placeholder': {
              color: 'black', 
              fontFamily: 'Arial',  
              fontSize: '16px', 
            },
          }} 
          slotProps={{ textField: { placeholder: label} }}
          />
    </LocalizationProvider>
  );
}