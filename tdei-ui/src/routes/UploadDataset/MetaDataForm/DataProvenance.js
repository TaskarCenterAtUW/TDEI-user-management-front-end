import React, { useState } from 'react';
import { Formik,Field, ErrorMessage, useFormikContext } from "formik";
import { Form } from "react-bootstrap";
import RowRadioButtonsGroup from "../../../components/RowRadioButtonsGroup/RowRadioButtonsGroup";


const DatasetProvenance = ({ formData, updateFormData }) => {
  // const { values, setFieldValue } = useFormikContext();
  const [datasetType, setDatasetType] = React.useState("");
  const [collectedMethod, setCollectedMethod] = React.useState("");
  const [dataSource, setDataSource] = React.useState("");
  const [selectedSchemaValidationRun, setSchemaValidationRun] = useState('');
  const [selectedCrowdContribution, setCrowdContribution] = useState('');

    // Event handler for input field change
    const handleChange = (e) => {
      const { name, value } = e.target;
      updateFormData({ [name]: value });
    };
  
    // Event handler for radio button selection
    const handleRadioSelect = (fieldName, selectedValue) => {
      updateFormData({ [fieldName]: selectedValue });
    };

  const radioList = [
    { value: 'yes', label: 'Yes' },
    { value: 'no', label: 'No' },
  ];

  return (
    <Formik initialValues={formData} onSubmit={values => console.log(values)} >
    {() => (
    <div style={{ padding: '5px', marginRight: "20px" }}>
      <Form.Group className="col-6" controlId="datasetFullName" style={{ marginRight: '40px' }}>
        <Form.Label>Full Dataset Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter Full Dataset Name"
          name="datasetFullName"
          onChange={handleChange}
        />
        <ErrorMessage name="datasetFullName" component="div" />
      </Form.Group>
      <div style={{ marginTop: '10px' }}>
        <Form.Label>Other Published Locations</Form.Label>
        <div className="jsonContent">
          <Form.Control
            as="textarea"
            type="text"
            name="otherPublishedLocations"
            onChange={handleChange}
            // onBlur={handleBlur}
            rows={3}
            placeholder="Enter Published Locations URL(s)"
          // value={geoJson}
          />
        </div>
      </div>
      <div className="d-flex align-items-center" style={{ marginTop: '10px' }}>
        <Form.Group className="col-4" controlId="updateFrequency" style={{ marginRight: '40px' }}>
          <Form.Label>Dataset Update Frequency Months</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Update Frequency"
            name="updateFrequency"
            onChange={handleChange}
          />
          <ErrorMessage name="updateFrequency" component="div" />
        </Form.Group>
        <Form.Group className="col-3" controlId="schemaValidationRun" style={{ marginRight: '20px' }}>
        <Form.Label>Schema Validation Run</Form.Label>
        <RowRadioButtonsGroup
          radioList={radioList}
          onRadioSelected={(value) => handleRadioSelect('schemaValidationRun', value)} />
      </Form.Group>
      <Form.Group className="col-3" controlId="allowCrowdContribution">
      <Form.Label>Allow Crowd Contribution</Form.Label>
        <RowRadioButtonsGroup
          radioList={radioList}
          onRadioSelected={(value) => handleRadioSelect('allowCrowdContribution', value)} />
      </Form.Group>
      </div>
      <div style={{ marginTop: '10px' }}>
        <Form.Label>Schema Validation Run Description</Form.Label>
        <div className="jsonContent">
          <Form.Control
            as="textarea"
            type="text"
            name="schemaValidationRunDesc"
            onChange={handleChange}
            // onBlur={handleBlur}
            rows={3}
            placeholder="Enter Schema Validation Run Description"
          // value={geoJson}
          />
          </div>
        </div>
        <Form.Group className="col-6" controlId="locationInaccuracyFactors" style={{ marginTop: '10px' }}>
          <Form.Label>Location Inaccuracy Factors</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Location Inaccuracy Factors"
            name="locationInaccuracyFactors"
            onChange={handleChange}
          />
          <ErrorMessage name="locationInaccuracyFactors" component="div" />
        </Form.Group>
      </div>)}
      </Formik>
  );
};

export default DatasetProvenance;