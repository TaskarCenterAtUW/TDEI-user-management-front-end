import React, { useState, useEffect } from 'react';
import FormControl from '@mui/material/FormControl';
import Select from 'react-select';

const DataSourceDropdownForm = ({ field, form, onChange, formDataDataSource }) => {
  const options = [
    { value: 'TDEITools', label: 'TDEI Tools' },
    { value: '3rdParty', label: 'Third Party' },
    { value: 'InHouse', label: 'In House' },
  ];
  
  const [currentValue, setCurrentValue] = useState(null);

  useEffect(() => {
    if (formDataDataSource !== undefined && formDataDataSource !== null) {
      const selectedOption = options.find(option => option.value === formDataDataSource);
      setCurrentValue(selectedOption);
    }
  }, [formDataDataSource]);

  const handleChange = (selectedOption) => {
    const dataSource = selectedOption ? selectedOption.value : '';
    form.setFieldValue(field.name, dataSource);
    onChange(dataSource);
    setCurrentValue(selectedOption);
  };

  return (
    <div>
      <FormControl fullWidth>
        <Select
          isSearchable={false}
          value={currentValue}
          onChange={handleChange}
          options={options}
          components={{
            IndicatorSeparator: () => null
          }} />
      </FormControl>
    </div>
  );
};

export default DataSourceDropdownForm;
