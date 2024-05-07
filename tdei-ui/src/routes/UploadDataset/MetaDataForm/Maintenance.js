import React, { useState } from 'react';
import { Field, ErrorMessage, useFormikContext } from "formik";
import { Form } from "react-bootstrap";
import RowRadioButtonsGroup from "../../../components/RowRadioButtonsGroup/RowRadioButtonsGroup";
import DatePicker from '../../../components/DatePicker/DatePicker';

const Maintenance = () => {
  const { values, setFieldValue } = useFormikContext();
  const [datasetType, setDatasetType] = React.useState("");
  const [collectedMethod, setCollectedMethod] = React.useState("");
  const [dataSource, setDataSource] = React.useState("");
  const [selectedSchemaValidationRun, setSchemaValidationRun] = useState('');
  const [maintenanceFunded, setMaintenanceFunded] = useState('');

  const handMaintenanceFundedChange = (value) => {
    setMaintenanceFunded(value);
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
      <Form.Group className="col-6" controlId="datasetName" style={{ marginRight: '40px' }}>
        <Form.Label>Official Maintainer</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter Official Maintainer"
          name="datasetName"
        />
        <ErrorMessage name="datasetName" component="div" />
      </Form.Group>
      <div className="d-flex align-items-center" style={{ marginTop: '10px' }}>
      <Form.Group className="col-4" controlId="collectedBy"  style={{ marginRight: '20px' }}>
          <Form.Label>Updated Date</Form.Label>
          <DatePicker label={"Select Last Updated Date"} />
        </Form.Group>
        <Form.Group className="col-4" controlId="updateFrequency" style={{ marginRight: '20px' }}>
          <Form.Label>Update Frequency</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Update Frequency"
            name="updateFrequency"
          />
        </Form.Group>
        <Form.Group className="col-4" controlId="authorizationChain" style={{ marginRight: '20px' }}>
          <Form.Label>Authorization Chain</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Authorization Chain"
            name="authorizationChain"
          />
        </Form.Group>
      </div>
      <div className="d-flex align-items-center" style={{ marginTop: '10px' }}>
      <Form.Group className="col-6" controlId="fundingDetails" style={{ marginRight: '40px' }}>
          <Form.Label>Funding Details</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Funding Details"
            name="fundingDetails"
          />
          <ErrorMessage name="fundingDetails" component="div" />
        </Form.Group>
      <Form.Group className="col-3" controlId="allowCrowdContribution">
      <Form.Label>Maintenance Funded</Form.Label>
        <RowRadioButtonsGroup
          radioList={radioList}
          onRadioSelected={handMaintenanceFundedChange} />
      </Form.Group>
      </div>
       
      </div>
  );
};

export default Maintenance;