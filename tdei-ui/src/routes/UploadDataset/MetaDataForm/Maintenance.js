import React, { useState } from 'react';
import { Formik, Field, ErrorMessage, useFormikContext } from "formik";
import { Form } from "react-bootstrap";
import RowRadioButtonsGroup from "../../../components/RowRadioButtonsGroup/RowRadioButtonsGroup";
import DatePicker from '../../../components/DatePicker/DatePicker';

const Maintenance = ({ formData, updateFormData }) => {
  // const { values, setFieldValue } = useFormikContext();
  const [datasetType, setDatasetType] = React.useState("");
  const [collectedMethod, setCollectedMethod] = React.useState("");
  const [dataSource, setDataSource] = React.useState("");
  const [selectedSchemaValidationRun, setSchemaValidationRun] = useState('');
  const [maintenanceFunded, setMaintenanceFunded] = useState('');

  const handMaintenanceFundedChange = (value) => {
    setMaintenanceFunded(value);
  };
  const handleDateSelect = (fieldName, date) => {
    updateFormData({ [fieldName]: date });
  };
  const radioList = [
    { value: 'yes', label: 'Yes' },
    { value: 'no', label: 'No' },
  ];
  const handleChange = (e) => {
    const { name, value } = e.target;
    // setFieldValue(name, value);
  };
  return (
    <Formik initialValues={formData} onSubmit={values => console.log(values)} >
      {({ errors, touched, handleChange, handleBlur, setFieldValue, setFieldTouched }) => (
         <div className="container">
         <div className="row" style={{ marginTop: '20px' }}>
           <div className="col-md-6 column-style">
          <Form.Group controlId="officialMaintainer">
            <Form.Label>Official Maintainer</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Official Maintainer"
              name="officialMaintainer"
            />
            <ErrorMessage name="officialMaintainer" component="div" />
          </Form.Group>
            <Form.Group controlId="lastUpdated" style={{ marginTop: '15px' }}>
              <Form.Label>Last Updated</Form.Label>
              <Field
                name="lastUpdated"
                component={DatePicker}
                label="Last Updated Date"
                dateValue={formData.lastUpdated}
                onChange={(date) => {
                  handleDateSelect('lastUpdated', date);
                  setFieldTouched('lastUpdated', true, false);
                }}
                onBlur={handleBlur}
              />
              <ErrorMessage name="lastUpdated" component="div" className="invalid-feedback d-block" />
            </Form.Group>
            <Form.Group controlId="updateFrequency" style={{ marginTop: '15px' }}>
              <Form.Label>Update Frequency</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Update Frequency"
                name="updateFrequency"
              />
            </Form.Group>
            </div>
            <div className="col-md-6 column-style" >
            <Form.Group controlId="authorizationChain" style={{ marginTop: '15px' }}>
              <Form.Label>Authorization Chain</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Authorization Chain"
                name="authorizationChain"
              />
            </Form.Group>
            <Form.Group  controlId="allowCrowdContribution" style={{ marginTop: '15px' }}>
              <Form.Label>Maintenance Funded</Form.Label>
              <RowRadioButtonsGroup
                radioList={radioList}
                onRadioSelected={handMaintenanceFundedChange} />
            </Form.Group>
            <Form.Group  controlId="fundingDetails" style={{ marginTop: '15px' }}>
              <Form.Label>Funding Details</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Funding Details"
                name="fundingDetails"
              />
              <ErrorMessage name="maintenanceFunded" component="div" />
            </Form.Group>
          </div>
        </div>
        </div>
      )}
    </Formik>
  );
};

export default Maintenance;