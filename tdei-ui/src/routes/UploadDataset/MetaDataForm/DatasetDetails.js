import React from "react";
import { Formik, Field, ErrorMessage } from "formik";
import { Form } from "react-bootstrap";
import DatePicker from "../../../components/DatePicker/DatePicker";
import DataTypeDropdownForm from "./DropdownComponents/DataTypeDropdown";
import CollectedMethodDropdownForm from './DropdownComponents/CollectedMethod';
import DataSourceDropdownForm from "./DropdownComponents/DataSource";
import * as Yup from "yup";

const DatasetDetails = ({ formData, updateFormData }) => {
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
    // dataset_type: Yup.string().required('Dataset Type is required'),
    // tdeiServiceId: Yup.string().required('TDEI Service Id is required')
    collected_by: Yup.string().required('Collected By is required'),
    collection_date: Yup.string().required('Collection Date is required').nullable(),
    data_source: Yup.string().required('Data Source is required'),
    schema_version: Yup.string().required('Schema Version is required')
  });

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
    >
      {({ errors, touched, handleChange, handleBlur, setFieldValue, setFieldTouched }) => (
        <div style={{ padding: '5px', marginRight: "20px" }}>
          <div className="d-flex align-items-center" style={{ marginTop: '20px' }}>
            <Form.Group className="col-6 form-group-custom" controlId="name">
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
              <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="col-6 form-group-custom" controlId="version">
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
            {/* <Form.Group className="col-4 form-group-custom" controlId="dataset_type">
              <Form.Label>Dataset Type<span style={{ color: 'red' }}> *</span></Form.Label>
              <Field 
                formDataDatasetType={formData.dataset_type}
                component={DataTypeDropdownForm} 
                name="dataset_type" 
                onChange={(selectedOption) => handleDropdownSelect('dataset_type', selectedOption)} 
              />
            </Form.Group> */}
            <Form.Group className="col-4 form-group-custom" controlId="collected_by">
              <Form.Label>Collected By<span style={{ color: 'red' }}> *</span></Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Collected By Name"
                name="collected_by"
                value={formData.collected_by}
                onBlur={handleBlur}
                isInvalid={errors.collected_by && touched.collected_by}
                onChange={(e) => {
                  handleFieldChange(e)
                  handleChange(e);
                }}
              />
              <Form.Control.Feedback type="invalid">{errors.collected_by}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="col-4 form-group-custom" controlId="collection_date">
                <Form.Label>Collection Date<span style={{ color: 'red' }}> *</span></Form.Label>
                <Field
                  name="collection_date"
                  component={DatePicker}
                  label="Select Collection Date"
                  dateValue={formData.collection_date}
                  onChange={(date) => {
                    handleDateSelect('collection_date', date);
                    setFieldTouched('collection_date', true,false);
                  }}
                  onBlur={handleBlur}
                />
                <ErrorMessage name="collection_date" component="div" className="invalid-feedback d-block" />
              </Form.Group>
          </div>
          <div className="d-flex align-items-center" style={{ marginTop: '20px' }}>
            <Form.Group className="col-4 form-group-custom" controlId="collection_method">
              <Form.Label>Collected Method</Form.Label>
              <Field 
                formDataCollectionMethod={formData.collection_method}
                component={CollectedMethodDropdownForm} 
                name="collection_method" 
                onChange={(selectedOption) => handleDropdownSelect('collection_method', selectedOption)} 
              />
            </Form.Group>
            <Form.Group className="col-4 form-group-custom" controlId="data_source">
              <Form.Label>Data Source<span style={{ color: 'red' }}> *</span></Form.Label>
              <Field 
                formDataDataSource={formData.data_source}  
                component={DataSourceDropdownForm} 
                name="data_source" 
                onChange={(selectedOption) => handleDropdownSelect('data_source', selectedOption)} 
              />
            </Form.Group>
            <Form.Group className="col-4 form-group-custom" controlId="schema_version">
              <Form.Label>Schema Version</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Schema Version"
                name="schema_version"
                value={formData.schema_version}
                onChange={(e) => {
                  handleFieldChange(e)
                  handleChange(e);
                }}
              />
            </Form.Group>
          </div>
          <div className="d-flex align-items-center" style={{ marginTop: '10px' }}>
            {/* <Form.Group className="col-4 form-group-custom" controlId="tdeiServiceId">
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
              <Form.Control.Feedback type="invalid">{errors.tdeiServiceId}</Form.Control.Feedback>
            </Form.Group> */}
            {/* <Form.Group className="col-4 form-group-custom" controlId="valid_from">
              <Form.Label>Valid From</Form.Label>
              <DatePicker label={"Select Starting Date"} selectedDate={formData.valid_from} fieldName="valid_from" onChange={handleDateSelect} />
            </Form.Group>
            <Form.Group className="col-4 form-group-custom" controlId="valid_to">
              <Form.Label>Valid To</Form.Label>
              <DatePicker label={"Select Expiry Date"} fieldName="valid_to" selectedDate={formData.valid_to} onChange={handleDateSelect} />
            </Form.Group> */}
          </div>
          <div style={{ marginTop: '10px' }}>
            <Form.Label>Dataset Area</Form.Label>
            <div className="tdei-hint-text">(hint: Create the bounding box using {link} )</div>
            <div className="jsonContent">
              <Form.Control
                as="textarea"
                type="text"
                name="dataset_area"
                onChange={(e) => {
                  handleFieldChange(e)
                  handleChange(e);
                }}
                rows={10}
                value={formData.dataset_area}
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
          {/* <div style={{ marginTop: '10px' }}>
            <Form.Label>Custom Metadata</Form.Label>
            <div className="jsonContent">
              <Form.Control
                as="textarea"
                type="text"
                name="custom_metadata"
                onChange={(e) => {
                  handleFieldChange(e)
                  handleChange(e);
                }}
                value={formData.custom_metadata}
                rows={5}
              />
            </div>
          </div> */}
        </div>
      )}
    </Formik>
  );
};

export default DatasetDetails;