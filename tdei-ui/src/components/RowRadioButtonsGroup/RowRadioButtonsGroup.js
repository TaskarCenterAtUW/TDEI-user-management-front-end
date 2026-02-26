import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';

export default function RowRadioButtonsGroup({ radioList, selectedValue, onRadioSelected, labelId }) {
  return (
    <FormControl sx={{ width: "100%" }}>
      <RadioGroup
        row
        aria-labelledby={labelId ? labelId : "radio-buttons-group-label"} 
        name={labelId ? labelId : "radio-buttons-group"}
        value={String(selectedValue)}
        onChange={(event) => onRadioSelected(event.target.value === 'true')}
      >
        {radioList.map((radio, index) => (
          <FormControlLabel
            key={index}
            value={String(radio.value)}
            control={<Radio />}
            label={radio.label}
            disabled={radio.disabled}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
}
