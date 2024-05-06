import React from 'react';
import CustomDropdown from '../../../../components/ProjectGroupList/CustomDropdown';

const CollectedMethodDropdownForm = ({ field, form }) => {
  const collectedMethodOptions = ['manual','transform','generated','AV', 'others'];

  const handleChange = (dataType) => {
    form.setFieldValue(field.name, dataType);
  };
  return (
    <CustomDropdown
      placeHolder="Select Method"
      options={collectedMethodOptions}
      onChange={handleChange}
      field={field}
      form={form}
    />
  );
};

export default CollectedMethodDropdownForm;
