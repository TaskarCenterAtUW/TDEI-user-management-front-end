import React from "react";
import { Formik, ErrorMessage } from "formik";
import { Form } from "react-bootstrap";
import style from "./MetaDataForm.module.css";

const DatasetSummary = ({ formData, updateFormData }) => {
  const [country, setCountry] = React.useState("");

 // Event handler for input field change
 const handleFieldChange = (e) => {
  const { name, value } = e.target;
  updateFormData({ [name]: value });
};


  return (
    <Formik initialValues={formData} onSubmit={values => console.log(values)} >
       {({ handleChange }) => (
        <div className={style.metaDataContainer}>
          <div className="row">
            <div className="col-sm-12 col-md-6 column-style">
              <Form.Group controlId="collection_name">
                <Form.Label>Collection Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Collection Name"
                  name="collection_name"
                  value={formData.collection_name}
                  onChange={(e) => {
                    handleFieldChange(e);
                    handleChange(e);
                  }}
                />
              </Form.Group>
              <Form.Group controlId="department_name" style={{ marginTop: '15px' }}>
                <Form.Label>Department Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Department Name"
                  name="department_name"
                  value={formData.department_name}
                  onChange={(e) => {
                    handleFieldChange(e);
                    handleChange(e);
                  }}
                />
                <ErrorMessage name="department_name" component="div" />
              </Form.Group>
              <Form.Group controlId="key_limitations" style={{ marginTop: '15px' }}>
                <Form.Label>Key limitations</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Key limitations of the dataset"
                  name="key_limitations"
                  value={formData.key_limitations}
                  onChange={(e) => {
                    handleFieldChange(e);
                    handleChange(e);
                  }}
                />
                <ErrorMessage name="key_limitations" component="div" />
              </Form.Group>
              <Form.Group controlId="release_notes" style={{ marginTop: '15px' }}>
                <Form.Label>Release Notes</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Release Notes"
                  name="release_notes"
                  value={formData.release_notes}
                  onChange={(e) => {
                    handleFieldChange(e);
                    handleChange(e);
                  }}
                />
                <ErrorMessage name="release_notes" component="div" />
              </Form.Group>
              <Form.Group controlId="challenges" style={{ marginTop: '15px' }}>
                <Form.Label>Challenges</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Challenges"
                  name="challenges"
                  value={formData.challenges}
                  onChange={(e) => {
                    handleFieldChange(e);
                    handleChange(e);
                  }}
                />
              </Form.Group>
            </div>
            <div className="col-sm-12 col-md-6 column-style">
              <Form.Group controlId="city">
                <Form.Label>City</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter City"
                  name="city"
                  value={formData.city}
                  onChange={(e) => {
                    handleFieldChange(e);
                    handleChange(e);
                  }}
                />
              </Form.Group>
              <Form.Group controlId="region" style={{ marginTop: '15px' }}>
                <Form.Label>Region</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Region"
                  name="region"
                  value={formData.region}
                  onChange={(e) => {
                    handleFieldChange(e);
                    handleChange(e);
                  }}
                />
                <ErrorMessage name="region" component="div" />
              </Form.Group>
              <Form.Group controlId="county" style={{ marginTop: '15px' }}>
                <Form.Label>County</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter County"
                  name="county"
                  value={formData.county}
                  onChange={(e) => {
                    handleFieldChange(e);
                    handleChange(e);
                  }}
                />
                <ErrorMessage name="county" component="div" />
              </Form.Group>
            </div>
          </div>
        </div>
      )}
    </Formik>
  );
};

export default DatasetSummary;