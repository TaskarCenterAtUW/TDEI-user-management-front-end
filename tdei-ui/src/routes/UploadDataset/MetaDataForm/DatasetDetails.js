import React from "react";
import { Formik, Field, ErrorMessage } from "formik";
import { Form } from "react-bootstrap";
import DatePicker from "../../../components/DatePicker/DatePicker";
import DataTypeDropdownForm from "./DropdownComponents/DataTypeDropdown";
import CollectedMethodDropdownForm from './DropdownComponents/CollectedMethod';
import DataSourceDropdownForm from "./DropdownComponents/DataSource";
import * as Yup from "yup";
import SchemaVersionDropdown from "./DropdownComponents/SchemaVersionDropdown";


const DatasetDetails = ({isDatasetPublished = false, formData, updateFormData }) => {
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
    collected_by: Yup.string().required('Collected By is required'),
    collection_date: Yup.string().required('Collection Date is required').nullable(),
    data_source: Yup.string().required('Data Source is required'),
    schema_version: Yup.string().required('Schema Version is required'),
    valid_from: isDatasetPublished
      ? Yup.date().required('Valid From is required').nullable()
      : Yup.date().nullable(),
    valid_to: isDatasetPublished
      ? Yup.date().required('Valid To is required').nullable()
      : Yup.date().nullable(),
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
        <div className="container">
          <div className="row" style={{ marginTop: '20px' }}>
            <div className="col-md-6 column-style">
              <Form.Group controlId="name">
                <Form.Label>Dataset Name<span style={{ color: 'red' }}> *</span></Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Dataset Name"
                  name="name"
                  onChange={(e) => {
                    handleFieldChange(e);
                    handleChange(e);
                  }}
                  value={formData.name}
                  isInvalid={touched.name && errors.name && (formData.name === '')}
                  onBlur={handleBlur}
                />
                <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="description" style={{ marginTop: '10px' }}>
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  type="text"
                  name="description"
                  onChange={(e) => {
                    handleFieldChange(e);
                    handleChange(e);
                  }}
                  rows={5}
                  placeholder="Enter Description"
                  value={formData.description}
                />
              </Form.Group>
              <Form.Group controlId="version" style={{ marginTop: '10px' }}>
                <Form.Label>Dataset Version<span style={{ color: 'red' }}> *</span></Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Dataset Version"
                  name="version"
                  value={formData.version}
                  isInvalid={touched.version && errors.version && (formData.version === '')}
                  onBlur={handleBlur}
                  onChange={(e) => {
                    handleFieldChange(e);
                    handleChange(e);
                  }}
                />
                <Form.Control.Feedback type="invalid">{errors.version}</Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="schema_version" style={{ marginTop: '15px' }}>
                <Form.Label>Schema Version<span style={{ color: 'red' }}> *</span></Form.Label>
                <Field 
                  schemaVersion={formData.schema_version}  
                  component={SchemaVersionDropdown} 
                  name="schema_version" 
                  onChange={(selectedOption) => handleDropdownSelect('schema_version', selectedOption)} 
                />
              </Form.Group>
            </div>
            <div className="col-md-6 column-style"> {/* Use col-md-6 for half-width columns on medium+ screens */}
              <Form.Group controlId="collected_by">
                <Form.Label>Collected By<span style={{ color: 'red' }}> *</span></Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Collected By Name"
                  name="collected_by"
                  value={formData.collected_by}
                  onBlur={handleBlur}
                  isInvalid={touched.collected_by && errors.collected_by && (formData.collected_by === '')}
                  onChange={(e) => {
                    handleFieldChange(e);
                    handleChange(e);
                  }}
                />
                <Form.Control.Feedback type="invalid">{errors.collected_by}</Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="collection_date" style={{ marginTop: '15px' }}>
                <Form.Label>Collection Date<span style={{ color: 'red' }}> *</span></Form.Label>
                <Field
                  name="collection_date"
                  component={DatePicker}
                  label="Select Collection Date"
                  dateValue={formData.collection_date}
                  onChange={(date) => {
                    handleDateSelect('collection_date', date);
                    // setFieldTouched('collection_date', true, false);
                    setFieldValue('collection_date', date);
                  }}
                  onBlur={handleBlur}
                />
                <ErrorMessage name="collection_date" component="div" className="invalid-feedback d-block" />
              </Form.Group>
              <Form.Group controlId="valid_from" style={{ marginTop: '15px' }}>
                <Form.Label>Valid From {isDatasetPublished ? <span style={{ color: 'red' }}> *</span> : null}</Form.Label>
                <Field
                  name="valid_from"
                  component={DatePicker}
                  label="Select valid from date"
                  dateValue={formData.valid_from}
                  onChange={(date) => {
                    handleDateSelect('valid_from', date);
                    // setFieldTouched('valid_from', true, false);
                    setFieldValue('valid_from', date);
                  }}
                  onBlur={handleBlur}
                />
                <ErrorMessage name="valid_from" component="div" className="invalid-feedback d-block" />
              </Form.Group>
              <Form.Group controlId="valid_to" style={{ marginTop: '15px' }}>
                <Form.Label>Valid To {isDatasetPublished ? <span style={{ color: 'red' }}> *</span> : null}</Form.Label>
                <Field
                  name="valid_to"
                  component={DatePicker}
                  label="Select valid to date"
                  dateValue={formData.valid_to}
                  onChange={(date) => {
                    handleDateSelect('valid_to', date);
                    // setFieldTouched('valid_to', true, false);
                    setFieldValue('valid_to', date);
                  }}
                  onBlur={handleBlur}
                />
                <ErrorMessage name="valid_to" component="div" className="invalid-feedback d-block" />
              </Form.Group>
              <Form.Group controlId="collection_method" style={{ marginTop: '10px' }}>
                <Form.Label>Collected Method</Form.Label>
                <Field 
                  formDataCollectionMethod={formData.collection_method}
                  component={CollectedMethodDropdownForm} 
                  name="collection_method" 
                  onChange={(selectedOption) => handleDropdownSelect('collection_method', selectedOption)} 
                />
              </Form.Group>
              <Form.Group controlId="data_source" style={{ marginTop: '15px' }}>
                <Form.Label>Data Source<span style={{ color: 'red' }}> *</span></Form.Label>
                <Field 
                  formDataDataSource={formData.data_source}  
                  component={DataSourceDropdownForm} 
                  name="data_source" 
                  onChange={(selectedOption) => handleDropdownSelect('data_source', selectedOption)} 
                />
              </Form.Group>
            </div>
          </div>
          <div className="row" style={{ marginTop: '20px' }}>
          <div id="dataset_area" className="section-style">
            <Form.Label>Dataset Area</Form.Label>
            <div className="tdei-hint-text">(hint: Create the bounding box using {link} )</div>
            <div className="jsonContent">
              <Form.Control
                as="textarea"
                type="text"
                name="dataset_area"
                onChange={(e) => {
                  handleFieldChange(e);
                  handleChange(e);
                }}
                rows={10}
                value={formData.dataset_area}
              />
            </div>
          </div>
          <div id="custom_metadata" className="section-style">
            <Form.Label>Custom Metadata</Form.Label>
            <div className="jsonContent">
              <Form.Control
                as="textarea"
                type="text"
                name="custom_metadata"
                onChange={(e) => {
                  handleFieldChange(e);
                  handleChange(e);
                }}
                value={formData.custom_metadata}
                rows={5}
              />
            </div>
          </div>
        </div>
        </div>
      )}
    </Formik>
  );
};

export default DatasetDetails;