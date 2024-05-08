import React, { useState } from 'react';
import { Field, ErrorMessage, useFormikContext } from "formik";
import { Form } from "react-bootstrap";
import RowRadioButtonsGroup from "../../../components/RowRadioButtonsGroup/RowRadioButtonsGroup";

const DatasetProvenance = () => {
  const { values, setFieldValue } = useFormikContext();
  const [datasetType, setDatasetType] = React.useState("");
  const [collectedMethod, setCollectedMethod] = React.useState("");
  const [dataSource, setDataSource] = React.useState("");
  const [selectedSchemaValidationRun, setSchemaValidationRun] = useState('');
  const [selectedCrowdContribution, setCrowdContribution] = useState('');
  

  const handSchemaValidationRunChange = (value) => {
    setSchemaValidationRun(value);
  };
  const handCrowdContributionChange = (value) => {
    setCrowdContribution(value);
  };
  const radioList = [
    { value: 'yes', label: 'Yes' },
    { value: 'no', label: 'No' },
  ];
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFieldValue(name, value);
  };
  return (
    <div style={{ padding: '5px', marginRight: "20px" }}>
      <Form.Group className="col-6" controlId="datasetFullName" style={{ marginRight: '40px' }}>
        <Form.Label>Full Dataset Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter Full Dataset Name"
          name="datasetFullName"
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
            // onChange={handleTextareaChange}
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
          />
          <ErrorMessage name="updateFrequency" component="div" />
        </Form.Group>
        <Form.Group className="col-3" controlId="schemaValidationRun" style={{ marginRight: '20px' }}>
        <Form.Label>Schema Validation Run</Form.Label>
        <RowRadioButtonsGroup
          radioList={radioList}
          onRadioSelected={handSchemaValidationRunChange} />
      </Form.Group>
      <Form.Group className="col-3" controlId="allowCrowdContribution">
      <Form.Label>Allow Crowd Contribution</Form.Label>
        <RowRadioButtonsGroup
          radioList={radioList}
          onRadioSelected={handCrowdContributionChange} />
      </Form.Group>
      </div>
      <div style={{ marginTop: '10px' }}>
        <Form.Label>Schema Validation Run Description</Form.Label>
        <div className="jsonContent">
          <Form.Control
            as="textarea"
            type="text"
            name="schemaValidationRunDesc"
            // onChange={handleTextareaChange}
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
          />
          <ErrorMessage name="locationInaccuracyFactors" component="div" />
        </Form.Group>
      </div>
  );
};

export default DatasetProvenance;