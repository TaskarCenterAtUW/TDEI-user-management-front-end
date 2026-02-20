import React from 'react';
import { Formik, Field, ErrorMessage, useFormikContext } from "formik";
import { Form } from "react-bootstrap";
import RowRadioButtonsGroup from "../../../components/RowRadioButtonsGroup/RowRadioButtonsGroup";
import * as Yup from "yup";
import style from "./MetaDataForm.module.css";

const DatasetProvenance = ({ formData, updateFormData }) => {

  // Event handler for input field change
  const handleFieldChange = (e) => {
    const { name, value, type } = e.target;
    let newValue;
    
    if (type === 'number') {
      newValue = value === '' ? '' : parseInt(value, 10);
    } else {
      newValue = value;
    }
    
    updateFormData({ [name]: newValue });
  };  

  // Event handler for radio button selection
  const handleRadioSelect = (fieldName, selectedValue) => {
    updateFormData({ [fieldName]: selectedValue });
  };

  const radioList = [
    { value: true, label: 'Yes' },
    { value: false, label: 'No' },
  ];
  const validationSchema = Yup.object().shape({
    full_dataset_name: Yup.string().required('Dataset Full Name is required'),
  });

  return (
    <Formik
      initialValues={formData}
      onSubmit={values => console.log(values)}
      validationSchema={validationSchema}
      validateOnChange={true}
      validateOnBlur={true} >
      {({ errors, touched, handleChange, handleBlur }) => (
        <div className={style.metaDataContainer}>
          <div className="row">
            <div className="col-sm-12 col-md-6 column-style">
              <Form.Group controlId="full_dataset_name">
                <Form.Label>Full Dataset Name<span style={{ color: 'red' }}> *</span></Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Full Dataset Name"
                  name="full_dataset_name"
                  value={formData.full_dataset_name}
                  onChange={(e) => {
                    handleFieldChange(e);
                    handleChange(e);
                  }}
                  isInvalid={touched.full_dataset_name && errors.full_dataset_name && (formData.full_dataset_name === '')}
                  onBlur={handleBlur}
                  required
                />
                <Form.Control.Feedback type="invalid">{errors.full_dataset_name}</Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="other_published_locations" style={{ marginTop: '10px' }}>
                <Form.Label>Other Published Locations</Form.Label>
                <div className="jsonContent">
                  <Form.Control
                    as="textarea"
                    type="text"
                    name="other_published_locations"
                    onChange={(e) => {
                      handleFieldChange(e);
                      handleChange(e);
                    }}
                    rows={3}
                    value={formData.other_published_locations}
                    placeholder="Enter Published Locations URL(s)"
                  />
                </div>
              </Form.Group>

              <Form.Group controlId="dataset_update_frequency_months" style={{ marginTop: '10px' }}>
                <Form.Label>Dataset Update Frequency Months</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter Update Frequency"
                  name="dataset_update_frequency_months"
                  value={formData.dataset_update_frequency_months}
                  onChange={(e) => {
                    handleFieldChange(e);
                    handleChange(e);
                  }}
                />
                <ErrorMessage name="dataset_update_frequency_months" component="div" />
              </Form.Group>

              <Form.Group className="col-" controlId="location_inaccuracy_factors" style={{ marginTop: '10px' }}>
                <Form.Label>Location Inaccuracy Factors</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Location Inaccuracy Factors"
                  name="location_inaccuracy_factors"
                  value={formData.location_inaccuracy_factors}
                  onChange={(e) => {
                    handleFieldChange(e);
                    handleChange(e);
                  }}
                />
                <ErrorMessage name="location_inaccuracy_factors" component="div" />
              </Form.Group>
            </div>
            <div className="col-sm-12 col-md-6 column-style">
              <Form.Group controlId="schema_validation_run">
                <Form.Label id='schema_validation_run'>Schema Validation Run</Form.Label>
                <RowRadioButtonsGroup
                  radioList={radioList}
                  selectedValue={formData.schema_validation_run}
                  labelId={"schema_validation_run"}
                  onRadioSelected={(value) => {
                    handleRadioSelect('schema_validation_run', value)
                    handleChange({ target: { name: 'schema_validation_run', value } });
                  }}
                />
              </Form.Group>
              <Form.Group controlId="schema_validation_run_description" style={{ marginTop: '20px' }}>
                <Form.Label>Schema Validation Run Description</Form.Label>
                <div className="jsonContent">
                  <Form.Control
                    as="textarea"
                    type="text"
                    name="schema_validation_run_description"
                    onChange={(e) => {
                      handleFieldChange(e);
                      handleChange(e);
                    }}
                    rows={5}
                    value={formData.schema_validation_run_description}
                    placeholder="Enter Schema Validation Run Description"
                  />
                </div>
              </Form.Group>
              <Form.Group controlId="allow_crowd_contributions" style={{ marginTop: "20px" }}>
                <Form.Label id='allow_crowd_contributions'>Allow Crowd Contribution</Form.Label>
                <RowRadioButtonsGroup
                  radioList={radioList}
                  selectedValue={formData.allow_crowd_contributions}
                  labelId={"allow_crowd_contributions"}
                  onRadioSelected={(value) => {
                    handleRadioSelect('allow_crowd_contributions', value)
                    handleChange({ target: { name: 'allow_crowd_contributions', value } });
                  }}
                />
              </Form.Group>
            </div>
          </div>
        </div>
      )}
    </Formik>
  );
};

export default DatasetProvenance;