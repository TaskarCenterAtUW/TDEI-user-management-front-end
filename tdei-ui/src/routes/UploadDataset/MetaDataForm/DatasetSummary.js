import React from "react";
import { Field, ErrorMessage, useFormikContext } from "formik";
import { Form } from "react-bootstrap";
import CountriesDropdown from "./DropdownComponents/Countries";

const DatasetSummary = () => {
  const { values, setFieldValue } = useFormikContext();
  const [country, setCountry] = React.useState("");
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFieldValue(name, value);
  };
  const handleCountrySelect = (value) => {
    setCountry(value.value);
  };

  return (
    <div style={{ padding: '5px', marginRight: "20px" }}>
      <div className="d-flex align-items-center" style={{ marginTop: '20px', marginRight:"20px" }}>
        <Form.Group className="col-6" controlId="collectionName" style={{ marginRight: '40px' }}>
          <Form.Label>Collection Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Collection Name"
            name="collectionName"
          />
        </Form.Group>
        <Form.Group className="col-6" controlId="departmentName">
          <Form.Label>Department Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Department Name"
            name="departmentName"
          />
          <ErrorMessage name="datasetVersion" component="div" />
        </Form.Group>
      </div>
      <div className="d-flex align-items-center" style={{ marginTop: '10px', marginRight:"20px" }}>
        <Form.Group className="col-4" controlId="datasetType" style={{ marginRight: '20px' }}>
          <Form.Label>Country</Form.Label>
          <Field component={CountriesDropdown} name="dataType" />
        </Form.Group>
        <Form.Group className="col-4" controlId="region" style={{ marginRight: '20px' }}>
          <Form.Label>Region</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Region"
            name="region"
          />
          <ErrorMessage name="region" component="div" />
        </Form.Group>
        <Form.Group className="col-4" controlId="city" style={{ marginRight: '20px' }}>
          <Form.Label>City</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter City"
            name="city"
          />
          <ErrorMessage name="region" component="div" />
        </Form.Group>
      </div>
      <div className="d-flex align-items-center" style={{ marginTop: '20px',  marginRight:"20px" }}>
        <Form.Group className="col-6" controlId="keyLimitationsOfDataset" style={{ marginRight: '40px' }}>
          <Form.Label>Key limitations of the dataset</Form.Label>
          <Form.Control
            type="text"
            placeholder="Key limitations of the dataset"
            name="keyLimitationsOfDataset"
          />
          <ErrorMessage name="keyLimitationsOfDataset" component="div" />
        </Form.Group>
        <Form.Group className="col-6" controlId="challenges">
          <Form.Label>Challenges</Form.Label>
          <Form.Control
            type="text"
            placeholder="Challenges"
            name="challenges"
          />
        </Form.Group>
      </div>
    </div>
  );
};

export default DatasetSummary;