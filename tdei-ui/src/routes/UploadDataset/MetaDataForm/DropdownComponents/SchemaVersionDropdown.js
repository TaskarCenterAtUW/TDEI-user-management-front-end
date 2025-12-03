import React, { useState, useEffect, useMemo } from 'react';
import FormControl from '@mui/material/FormControl';
import Select from 'react-select';

const SchemaVersionDropdown = ({ field, form, onChange, schemaVersion, dataType }) => {
  const options = useMemo(() => {
    if (dataType === "osw") {
      return [
        { value: "v0.2", label: "v0.2", isDisabled: true }, // can be shown but not selected
        { value: "v0.3", label: "v0.3" },                   // active
      ];
    }
    if (dataType === "pathways") {
      return [{ value: "v1.0", label: "v1.0" }];
    }
    if (dataType === "flex") {
      return [{ value: "v2.0", label: "v2.0" }];
    }
    return [
      { value: "v0.2", label: "v0.2", isDisabled: true },
      { value: "v0.3", label: "v0.3" },
    ];
  }, [dataType]);

  const [currentValue, setCurrentValue] = useState(null);

  useEffect(() => {
    if (schemaVersion !== undefined && schemaVersion !== null) {
      const selectedOption = options.find((option) => option.value === schemaVersion);
      // If schemaVersion is v0.2 for existing datasets, it will still be found and displayed,
      // even though that option is disabled.
      setCurrentValue(selectedOption ?? "");
    } else {
      setCurrentValue(null);
    }
  }, [schemaVersion, options]);

  const handleChange = (selectedOption) => {
    const value = selectedOption ? selectedOption.value : "";
    form.setFieldValue(field.name, value);
    if (onChange) {
      onChange(value);
    }
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
