import React from "react";
import { Field, ErrorMessage, useFormikContext } from "formik";
import { Modal, Button, Form } from "react-bootstrap";
import Container from "../../../components/Container/Container";
import Select from 'react-select';
import style from "./MetaDataForm.module.css";
import DatePicker from "../../../components/DatePicker/DatePicker";

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
  const datasetTypeOptions = [
    { value: 'flex', label: 'Flex' },
    { value: 'pathways', label: 'Pathways' },
    { value: 'osw', label: 'Osw' },
  ];
  const collectedMethodOptions = [
    { value: 'manual', label: 'Manual' },
    { value: 'transform', label: 'Transform' },
    { value: 'generated', label: 'Generated' },
    { value: 'av', label: 'AV' },
    { value: 'others', label: 'Others' }
  ];
  const dataSourceOptions = [
    { value: 'TDEI Tool', label: 'TDEI Tool' },
    { value: 'Third Party', label: 'Third Party' },
    { value: 'In House', label: 'In House' },
  ];
  var link = <a href={'https://geojson.io/'} target="_blank" rel="noreferrer">geojson.io</a>;
  return (
    <div>
      <div className="d-flex align-items-center" style={{ marginTop: '20px' }}>
        <Form.Group className="col-5" controlId="datasetName" style={{ marginRight: '40px' }}>
          <Form.Label>Dataset Name<span style={{ color: 'red' }}> *</span></Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Dataset Name"
            name="datasetName"
          />
          <ErrorMessage name="datasetName" component="div" />
        </Form.Group>
        <Form.Group className="col-5" controlId="datasetVersion">
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
        <Form.Group className="col-4" controlId="datasetType">
          <Form.Label>Dataset Type<span style={{ color: 'red' }}> *</span></Form.Label>
          <div className={style.selectDropdown}>
            <Select
              isSearchable={false}
              defaultValue={{ label: "All", value: "" }}
              onChange={handleDatasetTypeSelect}
              options={datasetTypeOptions}
              components={{
                IndicatorSeparator: () => null
              }}
              styles={{ container: (provided) => ({ ...provided, width: '100%' }) }}
            />
          </div>
        </Form.Group>
        <Form.Group className="col-3" controlId="collectedBy" style={{ marginRight: '40px' }}>
          <Form.Label>Collected By</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Collected By Name"
            name="collectedBy"
          />
          <ErrorMessage name="collectedBy" component="div" />
        </Form.Group>
        <Form.Group className="col-4" controlId="collectedBy">
          <Form.Label>Collection Date</Form.Label>
          <DatePicker label={"Select Collection Date"} />
        </Form.Group>
      </div>
      <div className="d-flex align-items-center" style={{ marginTop: '10px' }}>
        <Form.Group className="col-4" controlId="datasetType">
          <Form.Label>Collected Method</Form.Label>
          <div className={style.selectDropdown}>
            <Select
              placeholder="Select Method"
              isSearchable={false}
              onChange={handleCollectedMethodSelect}
              options={collectedMethodOptions}
              components={{
                IndicatorSeparator: () => null
              }}
              styles={{ container: (provided) => ({ ...provided, width: '100%' }) }}
            />
          </div>
        </Form.Group>
        <Form.Group className="col-4" controlId="collectedBy">
          <Form.Label>Data Source</Form.Label>
          <div className={style.selectDropdown}>
            <Select
              placeholder="Select Source"
              isSearchable={false}
              onChange={handleDataSourceSelect}
              options={dataSourceOptions}
              components={{
                IndicatorSeparator: () => null
              }}
              styles={{ container: (provided) => ({ ...provided, width: '100%' }) }}
            />
          </div>
        </Form.Group>
        <Form.Group className="col-4" controlId="datasetVersion">
          <Form.Label>Schema Version</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Schema Version"
            name="schemaVersion"
          />
        </Form.Group>

      </div>
      <div className="d-flex align-items-center" style={{ marginTop: '10px' }}>
        <Form.Group className="col-3" controlId="datasetVersion" style={{ marginRight: '40px' }}>
          <Form.Label>TDEI Service Id<span style={{ color: 'red' }}> *</span></Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Schema Version"
            name="schemaVersion"
          />
        </Form.Group>
        <Form.Group className="col-4" controlId="collectedBy">
          <Form.Label>Valid From</Form.Label>
          <DatePicker label={"Select Starting Date"} />
        </Form.Group>
        <Form.Group className="col-4" controlId="collectedBy">
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
            name="polygon"
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
            name="polygon"
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
            name="polygon"
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