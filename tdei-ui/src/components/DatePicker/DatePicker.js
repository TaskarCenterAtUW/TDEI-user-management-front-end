import * as React from 'react';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { IconButton } from "@mui/material";
import { Clear as ClearIcon } from "@mui/icons-material";

const DatePicker = ({ field = {}, form = {}, label, onChange, dateValue, isFilter = false, minDate, maxDate, disabled, id }) => {
  const { name } = field;
  const { setFieldValue, setFieldTouched, touched, errors } = form;
  const [internalDate, setInternalDate] = useState(null);
  const [displayValue, setDisplayValue] = useState("");

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
    if (date) {
      const formattedDate = date.format("MM/DD/YYYY");
      if (formattedDate.length === 10 && dayjs(date).isValid()) {
        const dateString = date.toISOString();
        setInternalDate(date);
        setDisplayValue(formattedDate);
        if (setFieldValue) setFieldValue(name, dateString);
        if (!isFilter) {
          setFieldTouched(name, true);
        }
        onChange(dateString);
      } else {
        setDisplayValue(formattedDate);
      }
    } else {
      setInternalDate(null);
      setDisplayValue("");
      if (setFieldValue) setFieldValue(name, null);
      onChange(null);
    }
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
          width: '100%',
          "& .MuiInputBase-root": {
            backgroundColor: "white",
          },
          "& .MuiInputBase-input": {
            height: "5px",
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
        value={internalDate || null}
        minDate={minDate || undefined}
        maxDate={maxDate || undefined}
        disabled={disabled}
        slotProps={{
          textField: {
            id: id,
            placeholder: dateValue ? '' : label,
            error: touched?.[name] && !!errors?.[name],
            onBlur: handleBlur,

          }
        }}
        onChange={handleChange}
      />
    </LocalizationProvider>
  );
};
export default DatePicker;