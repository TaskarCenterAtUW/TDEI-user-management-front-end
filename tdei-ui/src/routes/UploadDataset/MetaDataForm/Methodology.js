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

   // Event handler for radio button selection
 const handleRadioSelect = (fieldName, selectedValue) => {
  updateFormData({ [fieldName]: selectedValue });
};
const handleFieldChange = (e) => {
  const { name, value } = e.target;
  updateFormData({ [name]: value });
};

  const radioList = [
    { value: 'true', label: 'Yes' },
    { value: 'false', label: 'No' },
  ];
  return (
    <Formik initialValues={formData} onSubmit={values => console.log(values)} >
        {({ handleChange, handleBlur, setFieldTouched }) => (
        <div className="container">
          <div className="row" style={{ marginTop: '20px' }}>
            <div className="col-md-6 column-style">
              <Form.Group controlId="point_data_collection_device">
                <Form.Label>Point Data Collection Device</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter point data collection device"
                  name="point_data_collection_device"
                  value={formData.point_data_collection_device}
                  onChange={(e) => {
                    handleFieldChange(e);
                    handleChange(e);
                  }}
                />
                <ErrorMessage name="point_data_collection_device" component="div" />
              </Form.Group>
              <Form.Group controlId="node_locations_and_attributes_editing_software" style={{ marginTop: '20px' }}>
                <Form.Label>Node Locations And Attributes Editing Software</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter details"
                  name="node_locations_and_attributes_editing_software"
                  value={formData.node_locations_and_attributes_editing_software}
                  onChange={(e) => {
                    handleFieldChange(e);
                    handleChange(e);
                  }}
                />
                <ErrorMessage name="node_locations_and_attributes_editing_software" component="div" />
              </Form.Group>
              <Form.Group controlId="data_collected_by_people" style={{ marginTop: '20px' }}>
                <Form.Label>Data Collected By People Funded</Form.Label>
                <RowRadioButtonsGroup
                  radioList={radioList}
                  selectedValue={formData.data_collected_by_people}
                  onRadioSelected={(value) => {
                    handleRadioSelect('data_collected_by_people', value)
                    handleChange({ target: { name: 'data_collected_by_people', value } });
                  }} />
              </Form.Group>

              <Form.Group controlId="data_collectors" style={{ marginTop: '20px' }}>
                <Form.Label>Data Collectors</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter data collectors"
                  name="data_collectors"
                  value={formData.data_collectors}
                  onChange={(e) => {
                    handleFieldChange(e);
                    handleChange(e);
                  }}
                />
              </Form.Group>
              <Form.Group controlId="data_captured_automatically" style={{ marginTop: '20px' }}>
                <Form.Label>Data Captured Automatically</Form.Label>
                <RowRadioButtonsGroup
                  radioList={radioList}
                  selectedValue={formData.data_captured_automatically}
                  onRadioSelected={(value) => {
                    handleRadioSelect('data_captured_automatically', value)
                    handleChange({ target: { name: 'data_captured_automatically', value } });
                  }}
                  />
              </Form.Group>
              <Form.Group controlId="automated_collection" style={{ marginTop: '20px' }}>
                <Form.Label>Automated Collection</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Automated Collection"
                  name="automated_collection"
                  value={formData.automated_collection}
                  onChange={(e) => {
                    handleFieldChange(e);
                    handleChange(e);
                  }}
                />
              </Form.Group>
              <Form.Group controlId="data_collector_compensation" style={{ marginTop: '20px' }}>
                <Form.Label>Data Collectors Compensation</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Data Collectors Compensation"
                  name="data_collector_compensation"
                  value={formData.data_collector_compensation}
                  onChange={(e) => {
                    handleFieldChange(e);
                    handleChange(e);
                  }}
                />
              </Form.Group>
              <Form.Group controlId="data_collectors_organization" style={{ marginTop: '20px' }}>
                <Form.Label>Data Collectors Organization</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Data Collectors Organization"
                  name="data_collectors_organization"
                  value={formData.data_collectors_organization}
                  onChange={(e) => {
                    handleFieldChange(e);
                    handleChange(e);
                  }}
                />
              </Form.Group>
            </div>
            <div className="col-md-6 column-style">
              <Form.Group controlId="preprocessing_location">
                <Form.Label>Preprocessing Location</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Preprocessing Location"
                  name="preprocessing_location"
                  value={formData.preprocessing_location}
                  onChange={(e) => {
                    handleFieldChange(e);
                    handleChange(e);
                  }}
                />
              </Form.Group>
              <Form.Group controlId="preprocessing_steps" style={{ marginTop: '20px' }}>
                <Form.Label>Preprocessing Steps</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Preprocessing Steps"
                  name="preprocessing_steps"
                  value={formData.preprocessing_steps}
                  onChange={(e) => {
                    handleFieldChange(e);
                    handleChange(e);
                  }}
                />
              </Form.Group>
              <Form.Group controlId="preprocessing_by" style={{ marginTop: '20px' }}>
                <Form.Label>Preprocessing By</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Preprocessing By"
                  name="preprocessing_by"
                  value={formData.preprocessing_by}
                  onChange={(e) => {
                    handleFieldChange(e);
                    handleChange(e);
                  }}
                />
              </Form.Group>
              <Form.Group controlId="data_collection_preprocessing_documentation" style={{ marginTop: '20px' }}>
                <Form.Label>Data Collection Preprocessing Documentation</Form.Label>
                <RowRadioButtonsGroup
                  radioList={radioList}
                  selectedValue={formData.data_collection_preprocessing_documentation}
                  onRadioSelected={(value) => {
                    handleRadioSelect('data_collection_preprocessing_documentation', value)
                    handleChange({ target: { name: 'data_collection_preprocessing_documentation', value } });
                  }}
                  />
              </Form.Group>
              <Form.Group controlId="documentation_uri" style={{ marginTop: '20px' }}>
                <Form.Label>Documentation URI</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Documentation URI"
                  name="documentation_uri"
                  value={formData.documentation_uri}
                  onChange={(e) => {
                    handleFieldChange(e);
                    handleChange(e);
                  }}
                />
              </Form.Group>
              <Form.Group controlId="validation_process_exists" style={{ marginTop: '20px' }}>
                <Form.Label>Valid Process Exists</Form.Label>
                <RowRadioButtonsGroup
                  radioList={radioList}
                  selectedValue={formData.validation_process_exists}
                  onRadioSelected={(value) => {
                    handleRadioSelect('validation_process_exists', value)
                    handleChange({ target: { name: 'validation_process_exists', value } });
                  }}
                  />
              </Form.Group>
              <Form.Group controlId="validation_conducted_by" style={{ marginTop: '20px' }}>
                <Form.Label>Validation Conducted By</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Validation Conducted By"
                  name="validation_conducted_by"
                  value={formData.validation_conducted_by}
                  onChange={(e) => {
                    handleFieldChange(e);
                    handleChange(e);
                  }}
                />
              </Form.Group>
              <Form.Group controlId="excluded_data" style={{ marginTop: '20px' }}>
                <Form.Label>Excluded Data</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Excluded Data"
                  name="excluded_data"
                  value={formData.excluded_data}
                  onChange={(e) => {
                    handleFieldChange(e);
                    handleChange(e);
                  }}
                />
              </Form.Group>
              <Form.Group controlId="excluded_data_reason" style={{ marginTop: '20px' }}>
                <Form.Label>Excluded Data Reason</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Excluded Data Reason"
                  name="excluded_data_reason"
                  value={formData.excluded_data_reason}
                  onChange={(e) => {
                    handleFieldChange(e);
                    handleChange(e);
                  }}
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