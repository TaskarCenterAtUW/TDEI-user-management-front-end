import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

export default function RowRadioButtonsGroup({radioList, onRadioSelected }) {
  return (
    <FormControl>
      <RadioGroup
        row
        aria-labelledby="radio-buttons-group-label"
        name="radio-buttons-group"
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
