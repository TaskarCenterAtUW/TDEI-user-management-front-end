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
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFieldValue(name, value);
  };
  // Event handler for selecting dataset type from dropdown
  const handleDatasetTypeSelect = (value) => {
    setDatasetType(value.value);
  };
  const datasetTypeOptions = [
    { value: 'flex', label: 'Flex' },
    { value: 'pathways', label: 'Pathways' },
    { value: 'osw', label: 'Osw' },
  ];
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
      <Form.Group className="col-3" controlId="datasetType" style={{ marginRight: '40px' }}>
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
              styles={{ container: (provided) => ({ ...provided, width: '100%'}) }}
            />
          </div>
        </Form.Group>
        <Form.Group className="col-4" controlId="collectedBy">
          <Form.Label>Collected By</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Collected By Name"
            name="collectedBy"
          />
          <ErrorMessage name="collectedBy" component="div" />
        </Form.Group>
        <DatePicker />
        </div>
    </div>
  );
};

export default DatasetDetails;