import * as React from 'react';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { IconButton } from "@mui/material";
import { Clear as ClearIcon } from "@mui/icons-material";

const DatePicker = ({ field = {}, form = {}, label, onChange, dateValue, isFilter = false }) => {
  const { name } = field;
  const { setFieldValue, setFieldTouched, touched, errors } = form;
  const [internalDate, setInternalDate] = useState(null);

  // Sync internal date state with the dateValue prop
  useEffect(() => {
    if (dateValue) {
      const newDate = new Date(dateValue);
      if (!isNaN(newDate.getTime())) {
        setInternalDate(dayjs(newDate));
      }
    } else {
      setInternalDate(null);
    }
  }, [dateValue]);

  const handleChange = (date) => {
    const dateString = date ? date.toISOString() : null;
    setInternalDate(date);  
    if (setFieldValue) setFieldValue(name, dateString); 
    if(!isFilter){
      setFieldTouched(name, true);
    }
    onChange(dateString);
  };

  const handleBlur = () => {
    if (!internalDate && !isFilter) {
      setFieldTouched(name, true);
    }
  };
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DesktopDatePicker
        sx={{
          "& .MuiInputBase-input": {
            height: "5px",
            width: "21vw"
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
        value={internalDate}
        slotProps={{
          textField: {
            placeholder: label,
            error: touched?.[name] && !!errors?.[name],
            onBlur: handleBlur,
            inputProps: {
              readOnly: true,
            },
          }
        }}
        onChange={handleChange}
      />
    </LocalizationProvider>
  );
};
export default DatePicker;