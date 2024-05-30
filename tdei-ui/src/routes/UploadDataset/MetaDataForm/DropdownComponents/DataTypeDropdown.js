import React from 'react';
import CustomDropdown from '../../../../components/ProjectGroupList/CustomDropdown';

const DataTypeDropdownForm = ({ field, form, onChange, formDataDatasetType}) => {
  if (!field || !field.name) {
    console.error("Field object is missing or does not have a 'name' property.");
    return null;
  }
  const options = ["flex", "pathways", "osw"];

  const handleChange = (dataType) => {
    form.setFieldValue(field.name, dataType);
    onChange(dataType);
  };
  return (
    <CustomDropdown
      placeHolder="Data Type"
      options={options}
      onChange={handleChange}
      field={field}
      form={form}
      defaultValue={formDataDatasetType}
    />
  );
};

export default DataTypeDropdownForm;
