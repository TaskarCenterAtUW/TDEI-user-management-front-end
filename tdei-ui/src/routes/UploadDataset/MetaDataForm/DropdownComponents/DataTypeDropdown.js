import React from 'react';
import CustomDropdown from '../../../../components/ProjectGroupList/CustomDropdown';

const DataTypeDropdownForm = ({ field, form }) => {
  const options = ["flex","pathways","osw"];

  const handleChange = (dataType) => {
    form.setFieldValue(field.name, dataType);
  };
  return (
    <CustomDropdown
      placeHolder="Data Type"
      options={options}
      onChange={handleChange}
      field={field}
      form={form}
    />
  );
};

export default DataTypeDropdownForm;
