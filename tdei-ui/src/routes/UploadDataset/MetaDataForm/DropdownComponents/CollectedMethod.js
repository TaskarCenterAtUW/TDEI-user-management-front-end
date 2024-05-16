import React from 'react';
import CustomDropdown from '../../../../components/ProjectGroupList/CustomDropdown';

const CollectedMethodDropdownForm = ({ field, form, onChange,formDataCollectionMethod }) => {
  const collectedMethodOptions = ['manual','transform','generated','AV', 'others'];

  const handleChange = (collectedMethod) => {
    form.setFieldValue(field.name, collectedMethod);
    onChange(collectedMethod);
  };
  return (
    <CustomDropdown
      placeHolder="Select Method"
      options={collectedMethodOptions}
      onChange={handleChange}
      field={field}
      form={form}
      defaultValue={formDataCollectionMethod}
    />
  );
};

export default CollectedMethodDropdownForm;
