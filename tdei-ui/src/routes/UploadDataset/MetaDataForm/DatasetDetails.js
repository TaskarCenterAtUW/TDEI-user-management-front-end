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

  const handleFieldChange = (e) => {
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
      validateOnBlur={true}
      onSubmit={(values) => console.log(values)}
    >
      {({ values, errors, touched ,handleChange,handleBlur}) => (
        <div style={{ padding: '5px', marginRight: "20px" }}>
          <div className="d-flex align-items-center" style={{ marginTop: '20px' }}>
            <Form.Group className="col-6" controlId="name" style={{ marginRight: '40px' }}>
              <Form.Label>Dataset Name<span style={{ color: 'red' }}> *</span></Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Dataset Name"
                name="name"
                onChange={(e) => {
                  handleFieldChange(e)
                  handleChange(e);
                }}
                value={formData.name}
                isInvalid={errors.name && touched.name}
                onBlur={handleBlur}
              />
                {/* <ErrorMessage name="name" component="div" /> */}
              <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="col-6" controlId="version">
              <Form.Label>Dataset Version<span style={{ color: 'red' }}> *</span></Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Dataset Version"
                name="version"
                value={formData.version}
                isInvalid={errors.version && touched.version}
                onBlur={handleBlur}
                onChange={(e) => {
                  handleFieldChange(e)
                  handleChange(e);
                }}
              />
              <Form.Control.Feedback type="invalid">{errors.version}</Form.Control.Feedback>
            </Form.Group>
          </div>
          <div className="d-flex align-items-center" style={{ marginTop: '10px' }}>
            <Form.Group className="col-4" controlId="datasetType" style={{ marginRight: '20px' }}>
              <Form.Label>Dataset Type<span style={{ color: 'red' }}> *</span></Form.Label>
              <Field 
              formDataDatasetType={formData.datasetType}
              component={DataTypeDropdownForm} name="datasetType" onChange={(selectedOption) => handleDropdownSelect('datasetType', selectedOption)} />
            </Form.Group>
            <Form.Group className="col-4" controlId="collectedBy" style={{ marginRight: '20px' }}>
              <Form.Label>Collected By</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Collected By Name"
                name="collectedBy"
                value={formData.collectedBy}
                onChange={(e) => {
                  handleFieldChange(e)
                  handleChange(e);
                }}
              />
              <ErrorMessage name="collectedBy" component="div" />
            </Form.Group>
            <Form.Group className="col-4" controlId="collectionDate">
              <Form.Label>Collection Date</Form.Label>
              <DatePicker label={"Select Collection Date"} selectedDate={formData.collectionDate} fieldName="collectionDate" onChange={handleDateSelect} />
            </Form.Group>
          </div>
          <div className="d-flex align-items-center" style={{ marginTop: '20px' }}>
            <Form.Group className="col-4" controlId="collectionMethod" style={{ marginRight: '20px' }}>
              <Form.Label>Collected Method</Form.Label>
              <Field 
              formDataCollectionMethod={formData.collectionMethod}
              component={CollectedMethodDropdownForm} name="collectionMethod" onChange={(selectedOption) => handleDropdownSelect('collectionMethod', selectedOption)} />
            </Form.Group>
            <Form.Group className="col-4" controlId="dataSource" style={{ marginRight: '20px' }}>
              <Form.Label>Data Source</Form.Label>
              <Field formDataDataSource={formData.dataSource}  component={DataSourceDropdownForm} name="dataSource" onChange={(selectedOption) => handleDropdownSelect('dataSource', selectedOption)} />
            </Form.Group>
            <Form.Group className="col-4" controlId="schemaVersion">
              <Form.Label>Schema Version</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Schema Version"
                name="schemaVersion"
                value={formData.schemaVersion}
                onChange={(e) => {
                  handleFieldChange(e)
                  handleChange(e);
                }}
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
                onChange={(e) => {
                  handleFieldChange(e)
                  handleChange(e);
                }}
                onBlur={handleBlur}
                isInvalid={errors.tdeiServiceId && touched.tdeiServiceId}
                value={formData.tdeiServiceId}
              />
            </Form.Group>
            <Form.Group className="col-4" controlId="validFrom" style={{ marginRight: '20px' }}>
              <Form.Label>Valid From</Form.Label>
              <DatePicker label={"Select Starting Date"} selectedDate={formData.validFrom} fieldName="validFrom" onChange={handleDateSelect} />
            </Form.Group>
            <Form.Group className="col-4" controlId="validTo">
              <Form.Label>Valid To</Form.Label>
              <DatePicker label={"Select Expiry Date"} fieldName="validTo" selectedDate={formData.validTo} onChange={handleDateSelect} />
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
                onChange={(e) => {
                  handleFieldChange(e)
                  handleChange(e);
                }}
                rows={10}
                value={formData.datasetArea}
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
                onChange={(e) => {
                  handleFieldChange(e)
                  handleChange(e);
                }}
                rows={5}
                placeholder="Enter Description"
                value={formData.description}
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
                onChange={(e) => {
                  handleFieldChange(e)
                  handleChange(e);
                }}
                value={formData.customMetadata}
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