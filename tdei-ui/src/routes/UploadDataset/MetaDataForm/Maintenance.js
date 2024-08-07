import React, { useState } from 'react';
import { Formik, Field, ErrorMessage } from "formik";
import { Form } from "react-bootstrap";
import RowRadioButtonsGroup from "../../../components/RowRadioButtonsGroup/RowRadioButtonsGroup";
import DatePicker from '../../../components/DatePicker/DatePicker';
import ChipInput from '../../../components/ChipInput/ChipInput';

const Maintenance = ({ formData, updateFormData }) => {

 // Event handler for radio button selection
 const handleRadioSelect = (fieldName, selectedValue) => {
  updateFormData({ [fieldName]: selectedValue });
};

  const handleDateSelect = (fieldName, date) => {
    updateFormData({ [fieldName]: date });
  };

  const handleChipsChange = (chips) => {
    updateFormData({ official_maintainer: chips });
  };

  const radioList = [
    { value: true, label: 'Yes' },
    { value: false, label: 'No' },
  ];

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  };

  return (
    <Formik initialValues={formData} onSubmit={values => console.log(values)} >
      {({ handleChange, handleBlur, setFieldTouched }) => (
        <div className="container">
          <div className="row" style={{ marginTop: '20px' }}>
            <div className="col-md-6 column-style">
              <Form.Group controlId="official_maintainer">
                <Form.Label>Official Maintainer</Form.Label>
                <ChipInput 
                  initialChips={formData.official_maintainer || []}
                  onChipsChange={handleChipsChange}
                />
                <ErrorMessage name="official_maintainer" component="div" />
              </Form.Group>
              <Form.Group controlId="last_updated" style={{ marginTop: '15px' }}>
                <Form.Label>Last Updated</Form.Label>
                <Field
                  name="last_updated"
                  component={DatePicker}
                  label="Last Updated Date"
                  dateValue={formData.last_updated}
                  onChange={(date) => {
                    handleDateSelect('last_updated', date);
                    setFieldTouched('last_updated', true, false);
                  }}
                  onBlur={handleBlur}
                />
                <ErrorMessage name="last_updated" component="div" className="invalid-feedback d-block" />
              </Form.Group>
              <Form.Group controlId="update_frequency" style={{ marginTop: '15px' }}>
                <Form.Label>Update Frequency</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Update Frequency"
                  name="update_frequency"
                  value={formData.update_frequency}
                  onChange={(e) => {
                    handleFieldChange(e);
                    handleChange(e);
                  }}
                />
              </Form.Group>
            </div>
            <div className="col-md-6 column-style">
              <Form.Group controlId="authorization_chain" style={{ marginTop: '15px' }}>
                <Form.Label>Authorization Chain</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Authorization Chain"
                  name="authorization_chain"
                  value={formData.authorization_chain}
                  onChange={(e) => {
                    handleFieldChange(e);
                    handleChange(e);
                  }}
                />
              </Form.Group>
              <Form.Group controlId="maintenance_funded" style={{ marginTop: '15px' }}>
                <Form.Label>Maintenance Funded</Form.Label>
                <RowRadioButtonsGroup
                  radioList={radioList}
                  selectedValue={formData.maintenance_funded}
                  onRadioSelected={(value) => {
                    handleRadioSelect('maintenance_funded', value)
                    handleChange({ target: { name: 'maintenance_funded', value } });
                  }}
                />
              </Form.Group>
              <Form.Group controlId="funding_details" style={{ marginTop: '15px' }}>
                <Form.Label>Funding Details</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Funding Details"
                  name="funding_details"
                  value={formData.funding_details}
                  onChange={(e) => {
                    handleFieldChange(e);
                    handleChange(e);
                  }}
                />
                <ErrorMessage name="funding_details" component="div" />
              </Form.Group>
            </div>
          </div>
        </div>
      )}
    </Formik>
  );
};

export default Maintenance;