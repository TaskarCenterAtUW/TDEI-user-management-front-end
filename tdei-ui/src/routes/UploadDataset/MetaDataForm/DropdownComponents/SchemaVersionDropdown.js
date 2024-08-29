import React, { useState, useEffect } from 'react';
import FormControl from '@mui/material/FormControl';
import Select from 'react-select';

const SchemaVersionDropdown = ({ field, form, onChange, schemaVersion }) => {
  const options = [
    { value: 'v0.2', label: 'v0.2' },
    { value: 'v1.0', label: 'v1.0' },
    { value: 'v2.0', label: 'v2.0' },
  ];
  
  const [currentValue, setCurrentValue] = useState(null);

  useEffect(() => {
    if (schemaVersion !== undefined && schemaVersion !== null) {
      const selectedOption = options.find(option => option.value === schemaVersion);
      setCurrentValue(selectedOption ?? "");
    }
  }, [schemaVersion]);

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
        placeholder="Select Schema Version"
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

export default SchemaVersionDropdown;
