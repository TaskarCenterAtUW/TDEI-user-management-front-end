import React from 'react';
import CustomDropdown from '../../components/ProjectGroupList/CustomDropdown';

const ServiceTypeDropdown = ({ field, form }) => {
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

export default ServiceTypeDropdown;


// import React, { useState } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css'; 
// import {Dropdown} from 'react-bootstrap';

// const ServiceTypeDropdown = ({ selectedValue, onSelect, isRequired, isReadOnly }) => {
//   const handleSelect = (value) => {
//     if (!isReadOnly) {
//       onSelect(value);
//     }
//   };
//   return (
//     <Dropdown onSelect={handleSelect}>
//       <Dropdown.Toggle variant="primary" id="dropdown-basic"  disabled={isReadOnly}>
//         {selectedValue ? selectedValue : 'Select an option'}
//       </Dropdown.Toggle>
//       <Dropdown.Menu>
//         <Dropdown.Item eventKey="flex">flex</Dropdown.Item>
//         <Dropdown.Item eventKey="pathways">pathways</Dropdown.Item>
//         <Dropdown.Item eventKey="osw">osw</Dropdown.Item>
//       </Dropdown.Menu>
//     </Dropdown>
//   );
// };

// export default ServiceTypeDropdown;

