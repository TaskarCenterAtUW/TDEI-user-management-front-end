import React, { useState } from "react";
import { Modal, Button, Form, InputGroup, Alert } from "react-bootstrap";
import { Formik } from "formik";
import * as yup from "yup";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import style from './ReLoginModal.module.css';

const ReLoginModal = ({ open, onClose, onReLogin, email }) => {
  const [showPassword, setShowPassword] = useState(false);

  const validationSchema = yup.object().shape({
    password: yup.string().required("Password is required"),
  });

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.reload();
  };

  return (
    <Modal 
    show={open} 
    onHide={onClose} 
    centered 
    backdrop="static"
    keyboard={false} 
    >
      <Modal.Header closeButton={false}>
        <Modal.Title>Session Expired</Modal.Title>
      </Modal.Header>
      <Formik
        initialValues={{ password: "" }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
       
          setSubmitting(true); 

          onReLogin(values.password)
            .then(() => {
              setSubmitting(false); 
            })
            .catch(() => {
              setSubmitting(false); 
            });
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
        }) => (
          <Form noValidate onSubmit={handleSubmit}>
            <Modal.Body>
            <Form.Text className={style.disclaimer}>
                You need to re-login with your password to continue your session.
              </Form.Text>
              {/* <Form.Group controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  disabled
                  readOnly
                />
              </Form.Group> */}
              <Form.Group controlId="password" className="mt-3">
                <Form.Label>Password</Form.Label>
                <InputGroup>
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.password && !!errors.password}
                  />
                  <InputGroup.Text
                    onClick={handleTogglePasswordVisibility}
                    style={{ cursor: "pointer" }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </InputGroup.Text>
                  <Form.Control.Feedback type="invalid">
                    {errors.password}
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
<br />
              {errors.password && touched.password && (
                <Alert variant="danger" className="mt-3">
                  {errors.password}
                </Alert>
              )}
             
            </Modal.Body>

            <Modal.Footer>
            <Button  variant="ouline-secondary"
                className="tdei-secondary-button" onClick={handleLogout}>
              Logout
              </Button>
              <Button type="submit" variant="primary" disabled={isSubmitting} className="tdei-primary-button">
                {isSubmitting ? "Submitting..." : "Re-Login"}
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default ReLoginModal;
