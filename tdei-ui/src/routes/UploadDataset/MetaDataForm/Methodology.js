import React, { useState } from 'react';
import { Formik, Field, ErrorMessage, useFormikContext } from "formik";
import { Modal, Button, Form } from "react-bootstrap";
import Container from "../../../components/Container/Container";
import Select from 'react-select';
import style from "./MetaDataForm.module.css";
import DatePicker from "../../../components/DatePicker/DatePicker";
import DataTypeDropdownForm from "./DropdownComponents/DataTypeDropdown";
import CollectedMethodDropdownForm from './DropdownComponents/CollectedMethod';
import DataSourceDropdownForm from "./DropdownComponents/DataSource";
import RowRadioButtonsGroup from "../../../components/RowRadioButtonsGroup/RowRadioButtonsGroup";

const Methodology = ({ formData, updateFormData }) => {
  // const { values, setFieldValue } = useFormikContext();
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
    <Formik initialValues={formData} onSubmit={values => console.log(values)} >
      {() => (
        <div className="container">
          <div className="row" style={{ marginTop: '20px' }}>
            <div className="col-md-6 column-style">
              <Form.Group controlId="pointDataCollection">
                <Form.Label>Point Data Collection</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Point Data Collection Device"
                  name="pointDataCollection"
                />
                <ErrorMessage name="pointDataCollection" component="div" />
              </Form.Group>
              <Form.Group controlId="nodeSoftware" style={{ marginTop: '20px' }}>
                <Form.Label>Node Locations And Attributes Editing Software</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Details"
                  name="nodeSoftware"
                />
                <ErrorMessage name="nodeSoftware" component="div" />
              </Form.Group>
              <Form.Group controlId="dataCollectedByPeople" style={{ marginTop: '20px' }}>
                <Form.Label>Data Collected By People Funded</Form.Label>
                <RowRadioButtonsGroup
                  radioList={radioList}
                  onRadioSelected={handleDataCollectedByPeople} />
              </Form.Group>
              <Form.Group controlId="dataCapturedAutomatically" style={{ marginTop: '20px' }}>
                <Form.Label>Data Captured Automatically</Form.Label>
                <RowRadioButtonsGroup
                  radioList={radioList}
                  onRadioSelected={handleDataCaptured} />
              </Form.Group>

              <Form.Group controlId="dataCollectors" style={{ marginTop: '20px' }}>
                <Form.Label>Data Collectors</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Data Collectors"
                  name="dataCollectors"
                />
              </Form.Group>
              <Form.Group controlId="automatedCollection" style={{ marginTop: '20px' }}>
                <Form.Label>Automated Collection</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Automated Collection"
                  name="automatedCollection"
                />
              </Form.Group>
              <Form.Group controlId="dataCollectorsOrg" style={{ marginTop: '20px' }}>
                <Form.Label>Data Collectors Organization</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Data Collectors Organization"
                  name="dataCollectorsOrg"
                />
              </Form.Group>
            </div>
            <div className="col-md-6 column-style">
              <Form.Group controlId="preprocessingLocation">
                <Form.Label>Preprocessing Location</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Preprocessing Location"
                  name="preprocessingLocation"
                />
              </Form.Group>
              <Form.Group controlId="preprocessingBy" style={{ marginTop: '20px' }}>
                <Form.Label>Preprocessing By</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Preprocessing By"
                  name="preprocessingBy"
                />
              </Form.Group>

              <Form.Group controlId="preprocessingDoc" style={{ marginTop: '20px' }}>
                <Form.Label>Data Collection Preprocessing Documentation</Form.Label>
                <RowRadioButtonsGroup
                  radioList={radioList}
                  onRadioSelected={handlePreprocessingDoc} />
              </Form.Group>
              <Form.Group controlId="validProcessExists" style={{ marginTop: '20px' }}>
                <Form.Label>Valid Process Exists</Form.Label>
                <RowRadioButtonsGroup
                  radioList={radioList}
                  onRadioSelected={handleValidProcessExists} />
              </Form.Group>
              <Form.Group controlId="validationConductedBy" style={{ marginTop: '20px' }}>
                <Form.Label>Validation Conducted By</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Validation Conducted By"
                  name="validationConductedBy"
                />
              </Form.Group>
              <Form.Group controlId="excludedData" style={{ marginTop: '20px' }}>
                <Form.Label>Excluded Data</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Excluded Data"
                  name="excludedData"
                />
              </Form.Group>
              <Form.Group controlId="excludedDataReason" style={{ marginTop: '20px' }}>
                <Form.Label>Excluded Data Reason</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Excluded Data Reason"
                  name="excludedDataReason"
                />
              </Form.Group>
            </div>
          </div>
        </div>
      )}
    </Formik>
  );
};

export default Methodology;