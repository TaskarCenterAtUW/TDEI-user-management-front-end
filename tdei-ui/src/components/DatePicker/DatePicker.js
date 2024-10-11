import * as React from 'react';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';

const DatePicker = ({ field = {}, form = {}, label, onChange, dateValue }) => {
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
    if (setFieldTouched) setFieldTouched(name, true);
    onChange(dateString);
  };

  useEffect(() => {
    if (dateValue && setFieldTouched) {
      setFieldTouched(name, false);
    }
  }, [dateValue, setFieldTouched, name]);
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DesktopDatePicker
        sx={{
          "& .MuiInputBase-input": {
            height: "5px",
            width: "20vw"
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
            onBlur: () => setFieldTouched && setFieldTouched(name, true),
          }
        }}
        onChange={handleChange}
      />
    </LocalizationProvider>
  );
};
export default DatePicker;