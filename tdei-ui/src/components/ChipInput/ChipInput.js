import React, { useState, useEffect } from "react";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';

export default function ChipInput() {
    const [receivers, setReceivers] = useState([]);
    const initialData = ["example1", "example2"]; // to be changed

    useEffect(() => {
        if (initialData.length > 0) {
          setReceivers(initialData);
        }
      }, []);

  const handleReceiversChange = (event, value) => {
    setReceivers(value);
  };

  return (
    <Autocomplete
      multiple
      id="tags-filled"
      options={[]}
      defaultValue={[]}
      freeSolo
      value={receivers}
      onChange={handleReceiversChange}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <Chip
            key={index}
            variant="outlined"
            label={option}
            {...getTagProps({ index })}
          />
        ))
      }
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Press Enter to add"
        />
      )}
    />
  );
  }