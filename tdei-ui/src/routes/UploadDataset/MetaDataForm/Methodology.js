import React, { useState } from 'react';
import { Field, ErrorMessage, useFormikContext } from "formik";
import { Modal, Button, Form } from "react-bootstrap";
import Container from "../../../components/Container/Container";
import Select from 'react-select';
import style from "./MetaDataForm.module.css";
import DatePicker from "../../../components/DatePicker/DatePicker";
import DataTypeDropdownForm from "./DropdownComponents/DataTypeDropdown";
import CollectedMethodDropdownForm from './DropdownComponents/CollectedMethod';
import DataSourceDropdownForm from "./DropdownComponents/DataSource";
import RowRadioButtonsGroup from "../../../components/RowRadioButtonsGroup/RowRadioButtonsGroup";

const Methodology = () => {
  const { values, setFieldValue } = useFormikContext();
  const [dataCollectedByPeople, setDataCollectedByPeople] = useState('');
  const [dataCaptured, setDataCaptured] = useState('');
  const [preprocessingDoc, setPreprocessingDoc] = useState('');
  const [validProcessExists, setValidProcessExists] = useState('');

  const handleDataCollectedByPeople = (value) => {
    setDataCollectedByPeople(value);
  };
  const handleDataCaptured = (value) => {
    setDataCaptured(value);
  };
  const handlePreprocessingDoc = (value) => {
    setPreprocessingDoc(value);
  };
  const handleValidProcessExists = (value) => {
    setValidProcessExists(value);
  };
  const radioList = [
    { value: 'yes', label: 'Yes' },
    { value: 'no', label: 'No' },
  ];
  return (
    <div style={{ padding: '5px', marginRight:"20px" }}>
      <div className="d-flex align-items-center" style={{ marginTop: '20px' }}>
        <Form.Group className="col-6" controlId="pointDataCollection" style={{ marginRight: '20px' }}>
          <Form.Label>Point Data Collection</Form.Label>
          <Form.Control
            type="text"
            placeholder="Point Data Collection Device"
            name="pointDataCollection"
          />
          <ErrorMessage name="pointDataCollection" component="div" />
        </Form.Group>
        <Form.Group className="col-6" controlId="nodeSoftware">
          <Form.Label>Node Locations And Attributes Editing Software</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Details"
            name="nodeSoftware"
          />
          <ErrorMessage name="nodeSoftware" component="div" />
        </Form.Group>
      </div>
      <div className="d-flex align-items-center" style={{ marginTop: '20px' }}>
      <Form.Group className="col-4" controlId="dataCollectedByPeople">
          <Form.Label>Data Collected By People Funded</Form.Label>
          <RowRadioButtonsGroup
            radioList={radioList}
            onRadioSelected={handleDataCollectedByPeople} />
        </Form.Group>
        <Form.Group className="col-4" controlId="dataCapturedAutomatically">
          <Form.Label>Data Captured Automatically</Form.Label>
          <RowRadioButtonsGroup
            radioList={radioList}
            onRadioSelected={handleDataCaptured} />
        </Form.Group>
      </div>
      <div className="d-flex align-items-center" style={{ marginTop: '20px', marginRight:"20px" }}>
        <Form.Group className="col-4" controlId="dataCollectors" style={{ marginRight: '20px' }}>
          <Form.Label>Data Collectors</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Data Collectors"
            name="dataCollectors"
          />
        </Form.Group>
        <Form.Group className="col-4" controlId="automatedCollection" style={{ marginRight: '20px' }}>
          <Form.Label>Automated Collection</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Automated Collection"
            name="automatedCollection"
          />
        </Form.Group>
        <Form.Group className="col-4" controlId="dataCollectorsOrg">
          <Form.Label>Data Collectors Organization</Form.Label>
          <Form.Control
            type="text"
            placeholder="Data Collectors Organization"
            name="dataCollectorsOrg"
          />
        </Form.Group>
      </div>
      <div className="d-flex align-items-center" style={{ marginTop: '20px', marginRight:"20px" }}>
        <Form.Group className="col-4" controlId="dataCollectorCompensation" style={{ marginRight: '20px' }}>
          <Form.Label>Data Collector Compensation</Form.Label>
          <Form.Control
            type="text"
            placeholder="Data Collector Compensation"
            name="dataCollectorCompensation"
          />
        </Form.Group>
        <Form.Group className="col-4" controlId="preprocessingLocation" style={{ marginRight: '20px' }}>
          <Form.Label>Preprocessing Location</Form.Label>
          <Form.Control
            type="text"
            placeholder="Preprocessing Location"
            name="preprocessingLocation"
          />
        </Form.Group>
        <Form.Group className="col-4" controlId="preprocessingBy">
          <Form.Label>Preprocessing By</Form.Label>
          <Form.Control
            type="text"
            placeholder="Preprocessing By"
            name="preprocessingBy"
          />
        </Form.Group>
      </div>
      <div className="d-flex align-items-center" style={{ marginTop: '20px' }}>
      <Form.Group className="col-5" controlId="preprocessingDoc" style={{marginRight:"40px" }}>
          <Form.Label>Data Collection Preprocessing Documentation</Form.Label>
          <RowRadioButtonsGroup
            radioList={radioList}
            onRadioSelected={handlePreprocessingDoc} />
        </Form.Group>
        <Form.Group className="col-4" controlId="validProcessExists">
          <Form.Label>Valid Process Exists</Form.Label>
          <RowRadioButtonsGroup
            radioList={radioList}
            onRadioSelected={handleValidProcessExists} />
        </Form.Group>
      </div>
      <div className="d-flex align-items-center" style={{ marginTop: '20px', marginRight:"20px" }}>
        <Form.Group className="col-4" controlId="validationConductedBy" style={{ marginRight: '20px' }}>
          <Form.Label>Validation Conducted By</Form.Label>
          <Form.Control
            type="text"
            placeholder="Validation Conducted By"
            name="validationConductedBy"
          />
        </Form.Group>
        <Form.Group className="col-4" controlId="excludedData" style={{ marginRight: '20px' }}>
          <Form.Label>Excluded Data</Form.Label>
          <Form.Control
            type="text"
            placeholder="Excluded Data"
            name="excludedData"
          />
        </Form.Group>
        <Form.Group className="col-4" controlId="excludedDataReason">
          <Form.Label>Excluded Data Reason</Form.Label>
          <Form.Control
            type="text"
            placeholder="Excluded Data Reason"
            name="excludedDataReason"
          />
        </Form.Group>
      </div>
    </div>
  );
};

export default Methodology;