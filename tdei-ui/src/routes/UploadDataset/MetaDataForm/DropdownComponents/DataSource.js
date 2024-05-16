import React from 'react';
import CustomDropdown from '../../../../components/ProjectGroupList/CustomDropdown';

const DataSourceDropdownForm = ({ field, form, onChange,formDataDataSource }) => {
  const options = ['TDEI Tool','Third Party','In House'];

  const handleChange = (dataSource) => {
    form.setFieldValue(field.name, dataSource);
    onChange(dataSource);
  };
  return (
    <CustomDropdown
      placeHolder="Select Source"
      options={options}
      onChange={handleChange}
      field={field}
      form={form}
      defaultValue={formDataDataSource}
    />
  );
};

export default DataSourceDropdownForm;
