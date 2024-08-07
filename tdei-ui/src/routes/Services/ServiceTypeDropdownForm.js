import React from 'react';
import CustomDropdown from '../../components/ProjectGroupList/CustomDropdown';

const ServiceTypeDropdownForm = ({ field, form }) => {
  const options = ["flex","pathways","osw"];

  const handleChange = (serviceType) => {
    form.setFieldValue(field.name, serviceType);
  };
  return (
    <CustomDropdown
      placeHolder="Select Service Type"
      options={options}
      onChange={handleChange}
      field={field}
      form={form}
    />
  );
};

export default ServiceTypeDropdownForm;




