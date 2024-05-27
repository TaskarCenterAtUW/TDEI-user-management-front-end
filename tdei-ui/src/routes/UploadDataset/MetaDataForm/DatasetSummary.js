import React from "react";
import { Formik, Field, ErrorMessage, useFormikContext } from "formik";
import { Form } from "react-bootstrap";
import CountriesDropdown from "./DropdownComponents/Countries";

const DatasetSummary = ({ formData, updateFormData }) => {
  // const { values, setFieldValue } = useFormikContext();
  const [country, setCountry] = React.useState("");
  const handleChange = (e) => {
    const { name, value } = e.target;
    // setFieldValue(name, value);
  };
  const handleCountrySelect = (value) => {
    setCountry(value.value);
  };

  return (
    <Formik initialValues={formData} onSubmit={values => console.log(values)} >
      {() => (
        <div className="container">
          <div className="row" style={{ marginTop: '20px' }}>
            <div className="col-md-6 column-style">
              <Form.Group controlId="collectionName">
                <Form.Label>Collection Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Collection Name"
                  name="collectionName"
                />
              </Form.Group>
              <Form.Group controlId="departmentName" style={{ marginTop: '15px' }}>
                <Form.Label>Department Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Department Name"
                  name="departmentName"
                />
                <ErrorMessage name="departmentName" component="div" />
              </Form.Group>
              <Form.Group controlId="keyLimitationsOfDataset" style={{ marginTop: '15px' }}>
                <Form.Label>Key limitations of the dataset</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Key limitations of the dataset"
                  name="keyLimitationsOfDataset"
                />
                <ErrorMessage name="keyLimitationsOfDataset" component="div" />
              </Form.Group>
              <Form.Group controlId="challenges" style={{ marginTop: '15px' }}>
                <Form.Label>Challenges</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Challenges"
                  name="challenges"
                />
              </Form.Group>
            </div>
            <div className="col-md-6 column-style">
              <Form.Group controlId="city">
                <Form.Label>City</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter City"
                  name="city"
                />
              </Form.Group>
              <Form.Group controlId="region" style={{ marginTop: '15px' }}>
                <Form.Label>Region</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Region"
                  name="region"
                />
                <ErrorMessage name="region" component="div" />
              </Form.Group>
              <Form.Group controlId="country" style={{ marginTop: '15px' }}>
                <Form.Label>Country</Form.Label>
                <Field component={CountriesDropdown} name="country" />
              </Form.Group>
            </div>
          </div>
        </div>
      )}
    </Formik>
  );
};

export default DatasetSummary;