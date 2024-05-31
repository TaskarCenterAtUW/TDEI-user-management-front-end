import React, { useState, useEffect } from 'react';
import FormControl from '@mui/material/FormControl';
import Select from 'react-select';

const DataTypeDropdownForm = ({ field, form, onChange, formDataDatasetType }) => {

  const options = [
    { value: 'flex', label: 'flex' },
    { value: 'pathways', label: 'pathways' },
    { value: 'osw', label: 'osw' },
  ];
  
  const [currentValue, setCurrentValue] = useState(null);

  useEffect(() => {
    if (formDataDatasetType) {
      const selectedOption = options.find(option => option.value === formDataDatasetType);
      setCurrentValue(selectedOption);
    }
  }, [formDataDatasetType]);

  const handleChange = (selectedOption) => {
    const dataType = selectedOption ? selectedOption.value : '';
    form.setFieldValue(field.name, dataType);
    onChange(dataType);
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

export default DataTypeDropdownForm;
