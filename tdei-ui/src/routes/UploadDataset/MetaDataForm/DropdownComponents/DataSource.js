import React from 'react';
import CustomDropdown from '../../../../components/ProjectGroupList/CustomDropdown';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useState } from 'react';

const DataSourceDropdownForm = ({ field, form, onChange,formDataDataSource }) => {
  const options = ['TDEITools','3rdParty','InHouse'];
  const [currentValue,setCurrentValue] = useState(formDataDataSource);
 
  const handleChange = (evt) => {
    const dataSource = evt.target.value;
    form.setFieldValue(field.name, dataSource);
    onChange(dataSource);
    setCurrentValue(dataSource);
  };
  return (
    // <CustomDropdown
    //   placeHolder="Select Source"
    //   options={options}
    //   onChange={handleChange}
    //   field={field}
    //   form={form}
    //   defaultValue={formDataDataSource}
    // />
    <div>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-autowidth-label">Data Source </InputLabel>
        <Select
          labelId="demo-simple-select-autowidth-label"
          value={formDataDataSource??currentValue}
          onChange={handleChange}
          autoWidth
          label="Select Source"
        >
          {options.map((option) => (
            <MenuItem key={option} value={option} fullWidth>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
    
  );
};

export default DataSourceDropdownForm;
