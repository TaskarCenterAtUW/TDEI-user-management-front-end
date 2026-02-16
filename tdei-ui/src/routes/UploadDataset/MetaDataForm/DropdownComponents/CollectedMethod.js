import React, { useState, useEffect } from 'react';
import FormControl from '@mui/material/FormControl';
import Select from 'react-select';
import style from "./../MetaDataForm.module.css";

const CollectedMethodDropdownForm = ({ field, form, onChange, formDataCollectionMethod }) => {
  const collectedMethodOptions = [
    { value: 'manual', label: 'Manual' },
    { value: 'transform', label: 'Transform' },
    { value: 'generated', label: 'Generated' },
    { value: 'AV', label: 'AV' },
    { value: 'others', label: 'Others' },
  ];
  
  const [currentValue, setCurrentValue] = useState(null);

  useEffect(() => {
    if (formDataCollectionMethod !== undefined && formDataCollectionMethod !== null) {
      const selectedOption = collectedMethodOptions.find(option => option.value === formDataCollectionMethod);
      setCurrentValue(selectedOption ?? "");
    }
  }, [formDataCollectionMethod]);

  const handleChange = (selectedOption) => {
    const collectedMethod = selectedOption ? selectedOption.value : '';
    form.setFieldValue(field.name, collectedMethod);
    onChange(collectedMethod);
    setCurrentValue(selectedOption);
  };

  return (
    <div>
      <FormControl fullWidth>
        <Select
          inputId='collection_method'
          className={style.customPlaceholder}
          isSearchable={false}
          value={currentValue}
          onChange={handleChange}
          options={collectedMethodOptions}
          components={{
            IndicatorSeparator: () => null
          }} />
      </FormControl>
    </div>
  );
};

export default CollectedMethodDropdownForm;
