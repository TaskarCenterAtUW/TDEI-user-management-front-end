import React, { useState, useEffect } from 'react';
import FormControl from '@mui/material/FormControl';
import Select from 'react-select';
import style from "./../MetaDataForm.module.css";

const DataSourceDropdownForm = ({ field, form, onChange, formDataDataSource }) => {
  const options = [
    { value: 'TDEITools', label: 'TDEITools' },
    { value: '3rdParty', label: '3rdParty' },
    { value: 'InHouse', label: 'InHouse' },
  ];
  
  const [currentValue, setCurrentValue] = useState(null);

  useEffect(() => {
    if (formDataDataSource !== undefined && formDataDataSource !== null) {
      const selectedOption = options.find(option => option.value === formDataDataSource);
      setCurrentValue(selectedOption ?? "");
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
          inputId='data_source'
          className={style.customPlaceholder}
          isSearchable={false}
          value={currentValue}
          onChange={handleChange}
          options={options}
          components={{
            IndicatorSeparator: () => null
          }} 
          required
        />
      </FormControl>
    </div>
  );
};

export default DataSourceDropdownForm;
