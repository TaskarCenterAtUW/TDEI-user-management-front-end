import React, { useState } from 'react';
import { countries } from '../../../../utils';
import CustomDropdown from '../../../../components/ProjectGroupList/CustomDropdown';

function CountriesDropdown({ field, form }) {
  const [selectedCountry, setSelectedCountry] = useState('');
  
  const handleCountryChange = (event) => {
    form.setFieldValue(field.name, selectedCountry);
  };

  return (
    <CustomDropdown
      placeHolder="Select Country"
      options={countries}
      onChange={handleCountryChange}
      field={field}
      form={form}
    />
  );
}

export default CountriesDropdown;
