import React from "react";
import { Field, ErrorMessage, useFormikContext } from "formik";
import { Modal, Button, Form } from "react-bootstrap";
import Container from "../../../components/Container/Container";
import Select from 'react-select';
import style from "./MetaDataForm.module.css";
import DatePicker from "../../../components/DatePicker/DatePicker";
import DataTypeDropdownForm from "./DropdownComponents/DataTypeDropdown";
import CollectedMethodDropdownForm from './DropdownComponents/CollectedMethod';
import DataSourceDropdownForm from "./DropdownComponents/DataSource";

const DatasetDetails = () => {
  const { values, setFieldValue } = useFormikContext();
  const [datasetType, setDatasetType] = React.useState("");
  const [collectedMethod, setCollectedMethod] = React.useState("");
  const [dataSource, setDataSource] = React.useState("");
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFieldValue(name, value);
  };
  // Event handler for selecting dataset type from dropdown
  const handleDatasetTypeSelect = (value) => {
    setDatasetType(value.value);
  };
  const handleCollectedMethodSelect = (value) => {
    setCollectedMethod(value.value);
  };
  const handleDataSourceSelect = (value) => {
    setDataSource(value.value);
  };
  var link = <a href={'https://geojson.io/'} target="_blank" rel="noreferrer">geojson.io</a>;
  return (
    <div style={{ padding: '5px', marginRight:"20px" }}>
      <div className="d-flex align-items-center" style={{ marginTop: '20px' }}>
        <Form.Group className="col-6" controlId="datasetName" style={{ marginRight: '40px' }}>
          <Form.Label>Dataset Name<span style={{ color: 'red' }}> *</span></Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Dataset Name"
            name="datasetName"
          />
          <ErrorMessage name="datasetName" component="div" />
        </Form.Group>
        <Form.Group className="col-6" controlId="datasetVersion">
          <Form.Label>Dataset Version<span style={{ color: 'red' }}> *</span></Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Dataset Version"
            name="datasetVersion"
          />
          <ErrorMessage name="datasetVersion" component="div" />
        </Form.Group>
      </div>
      <div className="d-flex align-items-center" style={{ marginTop: '10px' }}>
        <Form.Group className="col-4" controlId="datasetType" style={{ marginRight: '20px' }}>
          <Form.Label>Dataset Type<span style={{ color: 'red' }}> *</span></Form.Label>
          <Field component={DataTypeDropdownForm} name="datasetType" />
        </Form.Group>
        <Form.Group className="col-4" controlId="collectedBy" style={{ marginRight: '20px' }}>
          <Form.Label>Collected By</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Collected By Name"
            name="collectedBy"
          />
          <ErrorMessage name="collectedBy" component="div" />
        </Form.Group>
        <Form.Group className="col-4" controlId="collectionDate">
          <Form.Label>Collection Date</Form.Label>
          <DatePicker label={"Select Collection Date"} />
        </Form.Group>
      </div>
      <div className="d-flex align-items-center" style={{ marginTop: '20px' }}>
        <Form.Group className="col-4" controlId="collectionMethod" style={{ marginRight: '20px' }}>
          <Form.Label>Collected Method</Form.Label>
          <Field component={CollectedMethodDropdownForm} name="collectionMethod" />
        </Form.Group>
        <Form.Group className="col-4" controlId="dataSource" style={{ marginRight: '20px' }}>
          <Form.Label>Data Source</Form.Label>
          <Field component={DataSourceDropdownForm} name="dataSource" />
        </Form.Group>
        <Form.Group className="col-4" controlId="schemaVersion">
          <Form.Label>Schema Version</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Schema Version"
            name="schemaVersion"
          />
        </Form.Group>

      </div>
      <div className="d-flex align-items-center" style={{ marginTop: '10px' }}>
        <Form.Group className="col-4" controlId="tdeiServiceId" style={{ marginRight: '20px' }}>
          <Form.Label>TDEI Service Id<span style={{ color: 'red' }}> *</span></Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter TDEI Service Id"
            name="tdeiServiceId"
          />
        </Form.Group>
        <Form.Group className="col-4" controlId="validFrom"  style={{ marginRight: '20px' }}>
          <Form.Label>Valid From</Form.Label>
          <DatePicker label={"Select Starting Date"} />
        </Form.Group>
        <Form.Group className="col-4" controlId="validTo">
          <Form.Label>Valid To</Form.Label>
          <DatePicker label={"Select Expiry Date"} />
        </Form.Group>
      </div>
      <div style={{ marginTop: '10px' }}>
        <Form.Label>Dataset Area</Form.Label>
        <div className="tdei-hint-text">(hint: Create the bounding box using {link} )</div>
        <div className="jsonContent">
          <Form.Control
            as="textarea"
            type="text"
            name="datasetArea"
            // onChange={handleTextareaChange}
            // onBlur={handleBlur}
            rows={10}
          // value={geoJson}
          />
        </div>
      </div>
      <div style={{ marginTop: '10px' }}>
        <Form.Label>Description</Form.Label>
        <div className="jsonContent">
          <Form.Control
            as="textarea"
            type="text"
            name="description"
            // onChange={handleTextareaChange}
            // onBlur={handleBlur}
            rows={5}
            placeholder="Enter Description"
          // value={geoJson}
          />
        </div>
        </div>
        <div style={{ marginTop: '10px' }}>
        <Form.Label>Custom Metadata</Form.Label>
        <div className="jsonContent">
          <Form.Control
            as="textarea"
            type="text"
            name="customMetadata"
            // onChange={handleTextareaChange}
            // onBlur={handleBlur}
            rows={5}
          // value={geoJson}
          />
        </div>
        </div>
    </div>
  );
};

export default DatasetDetails;