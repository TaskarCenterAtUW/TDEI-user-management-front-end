import React from 'react';
import CustomDropdown from '../../../../components/ProjectGroupList/CustomDropdown';

const DataSourceDropdownForm = ({ field, form }) => {
  const options = ['TDEI Tool','Third Party','In House'];

  const handleChange = (dataType) => {
    form.setFieldValue(field.name, dataType);
  };
  return (
    <CustomDropdown
      placeHolder="Select Source"
      options={options}
      onChange={handleChange}
      field={field}
      form={form}
    />
  );
};

export default DataSourceDropdownForm;
