import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';

export default function RowRadioButtonsGroup({ radioList, selectedValue, onRadioSelected }) {
  return (
    <FormControl sx={{ width: "100%" }}>
      <RadioGroup
        row
        aria-labelledby="radio-buttons-group-label"
        name="radio-buttons-group"
        value={selectedValue || null}
        onChange={(event) => onRadioSelected(event.target.value)}
      >
        {radioList.map((radio, index) => (
          <FormControlLabel
            key={index}
            value={radio.value}
            control={<Radio />}
            label={radio.label}
            disabled={radio.disabled}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
}
