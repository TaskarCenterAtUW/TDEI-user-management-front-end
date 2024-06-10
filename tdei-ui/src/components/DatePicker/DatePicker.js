import * as React from 'react';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';

const DatePicker = ({ field, form, label, onChange, dateValue }) => {
  const { name } = field;
  const { setFieldValue, setFieldTouched, touched, errors } = form;
  const [isOpen, setIsOpen] = useState(false);
  const parsedDate = dateValue ? new Date(dateValue) : '';

  const handleOpen = () => {
    setIsOpen(true);
    setFieldValue(name, parsedDate);
  };

  const handleClose = () => {
    setIsOpen(false);
    if (!dateValue) {
      setFieldValue(name, '');
      setFieldTouched(name, true);
    }
  };

  const handleChange = (date) => {
    const dateString = date ? date.toISOString() : null;
    setFieldValue(name, dateString);
    setFieldTouched(name, true);
    onChange(dateString);
  };

  useEffect(() => {
    if (dateValue) {
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
        open={isOpen}
        onOpen={handleOpen}
        onClose={handleClose}
        value={parsedDate ? dayjs(parsedDate) : null}
        slotProps={{
          textField: {
            placeholder: label,
            error: form.touched[name] && !!form.errors[name],
            onBlur: () => setFieldTouched(name, true),
          }
        }}
        onChange={handleChange}
      />
    </LocalizationProvider>
  );
};
export default DatePicker;