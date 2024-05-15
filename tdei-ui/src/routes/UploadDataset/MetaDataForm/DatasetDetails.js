import React from "react";
import { Formik, Field, ErrorMessage, useFormikContext } from "formik";
import { Modal, Button, Form } from "react-bootstrap";
import DatePicker from "../../../components/DatePicker/DatePicker";
import DataTypeDropdownForm from "./DropdownComponents/DataTypeDropdown";
import CollectedMethodDropdownForm from './DropdownComponents/CollectedMethod';
import DataSourceDropdownForm from "./DropdownComponents/DataSource";
import { GEOJSON } from "../../../utils";
import * as Yup from "yup";

const DatasetDetails = ({ formData, updateFormData }) => {
  const [collectionDate, setCollectionDate] = React.useState(new Date());
  const [validFrom, setValidFromDate] = React.useState(new Date());
  const [validTo, setValidToDate] = React.useState(new Date());
  const [geoJson, setGeoJson] = React.useState(JSON.stringify(GEOJSON, null, 2));
  // Event handler for selecting date from date picker
  const handleDateSelect = (fieldName, date) => {
    updateFormData({ [fieldName]: date });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Dataset Name is required'),
    version: Yup.string().required('Dataset Version is required'),
    datasetType: Yup.string().required('Dataset Type is required'),
    tdeiServiceId: Yup.string().required('TDEI Service Id is required')
  });

  // Event handler for selecting dataset type, collected method, and data source
  const handleDropdownSelect = (fieldName, selectedOption) => {
    updateFormData({ [fieldName]: selectedOption });
  };
  var link = <a href={'https://geojson.io/'} target="_blank" rel="noreferrer">geojson.io</a>;
  return (
    <Formik
      initialValues={formData}
      validationSchema={validationSchema}
      validateOnChange={true}
      onSubmit={(values) => console.log(values)}
    >
      {({ values, errors, touched }) => (
        <div style={{ padding: '5px', marginRight: "20px" }}>
          <div className="d-flex align-items-center" style={{ marginTop: '20px' }}>
            <Form.Group className="col-6" controlId="name" style={{ marginRight: '40px' }}>
              <Form.Label>Dataset Name<span style={{ color: 'red' }}> *</span></Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Dataset Name"
                name="name"
                onChange={handleChange}
                // value={values.name}
                isInvalid={errors.name && touched.name}
              />
              <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="col-6" controlId="version">
              <Form.Label>Dataset Version<span style={{ color: 'red' }}> *</span></Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Dataset Version"
                name="version"
                // value={values.version}
                isInvalid={errors.version && touched.version}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">{errors.version}</Form.Control.Feedback>
            </Form.Group>
          </div>
          <div className="d-flex align-items-center" style={{ marginTop: '10px' }}>
            <Form.Group className="col-4" controlId="datasetType" style={{ marginRight: '20px' }}>
              <Form.Label>Dataset Type<span style={{ color: 'red' }}> *</span></Form.Label>
              <Field 
              // value={values.datasetType} 
              component={DataTypeDropdownForm} name="datasetType" onChange={(selectedOption) => handleDropdownSelect('datasetType', selectedOption)} />
            </Form.Group>
            <Form.Group className="col-4" controlId="collectedBy" style={{ marginRight: '20px' }}>
              <Form.Label>Collected By</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Collected By Name"
                name="collectedBy"
                // value={values.collectedBy}
              />
              <ErrorMessage name="collectedBy" component="div" />
            </Form.Group>
            <Form.Group className="col-4" controlId="collectionDate">
              <Form.Label>Collection Date</Form.Label>
              <DatePicker label={"Select Collection Date"} selectedDate={values.collectionDate} fieldName="collectionDate" onChange={handleDateSelect} />
            </Form.Group>
          </div>
          <div className="d-flex align-items-center" style={{ marginTop: '20px' }}>
            <Form.Group className="col-4" controlId="collectionMethod" style={{ marginRight: '20px' }}>
              <Form.Label>Collected Method</Form.Label>
              <Field 
              // value={values.collectionMethod} 
              component={CollectedMethodDropdownForm} name="collectionMethod" onChange={(selectedOption) => handleDropdownSelect('collectionMethod', selectedOption)} />
            </Form.Group>
            <Form.Group className="col-4" controlId="dataSource" style={{ marginRight: '20px' }}>
              <Form.Label>Data Source</Form.Label>
              <Field component={DataSourceDropdownForm} name="dataSource" onChange={(selectedOption) => handleDropdownSelect('dataSource', selectedOption)} />
            </Form.Group>
            <Form.Group className="col-4" controlId="schemaVersion">
              <Form.Label>Schema Version</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Schema Version"
                name="schemaVersion"
                onChange={handleChange}
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
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="col-4" controlId="validFrom" style={{ marginRight: '20px' }}>
              <Form.Label>Valid From</Form.Label>
              <DatePicker label={"Select Starting Date"} selectedDate={validFrom} fieldName="validFrom" onChange={handleDateSelect} />
            </Form.Group>
            <Form.Group className="col-4" controlId="validTo">
              <Form.Label>Valid To</Form.Label>
              <DatePicker label={"Select Expiry Date"} fieldName="validTo" selectedDate={validTo} onChange={handleDateSelect} />
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
                onChange={handleChange}
                // onBlur={handleBlur}
                rows={10}
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
                onChange={handleChange}
                // onBlur={handleBlur}
                rows={5}
                placeholder="Enter Description"
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
                onChange={handleChange}
                // onBlur={handleBlur}
                rows={5}
              />
            </div>
          </div>
        </div>
      )}
    </Formik>
  );
};

export default DatasetDetails;