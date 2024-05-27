import React, { useState } from 'react';
import { Formik, Field, ErrorMessage, useFormikContext } from "formik";
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
        <div className="container">
          <div className="row" style={{ marginTop: '20px' }}>
            <div className="col-md-6 column-style">
              <Form.Group controlId="datasetFullName">
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

              <Form.Group controlId="updateFrequency">
                <Form.Label>Dataset Update Frequency Months</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Update Frequency"
                  name="updateFrequency"
                  onChange={handleChange}
                />
                <ErrorMessage name="updateFrequency" component="div" />
              </Form.Group>
              <Form.Group className="col-" controlId="locationInaccuracyFactors" style={{ marginTop: '10px' }}>
                <Form.Label>Location Inaccuracy Factors</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Location Inaccuracy Factors"
                  name="locationInaccuracyFactors"
                  onChange={handleChange}
                />
                <ErrorMessage name="locationInaccuracyFactors" component="div" />
              </Form.Group>
            </div>
            <div className="col-md-6 column-style">
              <Form.Group controlId="schemaValidationRun" >
                <Form.Label>Schema Validation Run</Form.Label>
                <RowRadioButtonsGroup
                  radioList={radioList}
                  onRadioSelected={(value) => handleRadioSelect('schemaValidationRun', value)} />
              </Form.Group>
              <div style={{ marginTop: '20px' }}>
                <Form.Label>Schema Validation Run Description</Form.Label>
                <div className="jsonContent">
                  <Form.Control
                    as="textarea"
                    type="text"
                    name="schemaValidationRunDesc"
                    onChange={handleChange}
                    rows={5}
                    placeholder="Enter Schema Validation Run Description"
                  />
                </div>
              </div>
              <Form.Group controlId="allowCrowdContribution" style={{ marginTop: "20px" }}>
                <Form.Label>Allow Crowd Contribution</Form.Label>
                <RowRadioButtonsGroup
                  radioList={radioList}
                  onRadioSelected={(value) => handleRadioSelect('allowCrowdContribution', value)} />
              </Form.Group>
            </div>
          </div>
        </div>
      )
      }
    </Formik>
  );
};

export default DatasetProvenance;