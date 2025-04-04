import React, { useState } from "react";
import { Row, Form, Button, Card, Col, InputGroup } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";
import style from "./style.module.css";
import tempLogo from "./../../assets/img/tdei_logo.svg";
import { useDispatch } from "react-redux";
import { show } from "../../store/notification.slice";
import { PHONE_REGEX } from "../../utils";
import { Formik } from "formik";
import * as yup from "yup";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import ResponseToast from "../../components/ToastMessage/ResponseToast";
import CustomModal from "../../components/SuccessModal/CustomModal";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [showTermsModal, setShowTermsModal] = useState(false);

  const auth = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
    terms: false,
  };

  const validationSchema = yup.object().shape({
    firstName: yup.string().required("First Name is required"),
    email: yup
      .string()
      .email("Invalid email Id")
      .required("Please enter email Id"),
    phone: yup.string().matches(PHONE_REGEX, "Invalid phone number"),
    password: yup
      .string()
      .matches(/^(?=.*[a-z])(?=.*\d)(?=.*[A-Z])(?=.*[!\"#$%&'()*+,\-./:;<=>?@[\]^_`{|}~])(?!.*\s).{8,255}$/,
        "Password must be minimum of 8 characters in length, requires at least one lower case, one upper case, one special character and a number."
      ).required("Please enter password"),
    confirm: yup
      .string()
      .oneOf([yup.ref("password"), null], "Confirm password does not match")
      .required("Please confirm password"),
  });

  // Custom onSubmit that checks if T&C is accepted.
  const handleSubmit = async (values, { setFieldError }) => {
    if (!values.terms) {
      setFieldError("terms", "Please accept Terms and Conditions to create your account");
      setShowTermsModal(true);
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${process.env.REACT_APP_URL}/register`, {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone,
        password: values.password,
      });
      setToastMessage("Registration successful!");
      setToastType("success");
      setShowToast(true);
      setLoading(false);
      setTimeout(() => {
        navigate("/emailVerify", {
          state: {  
            actionText: "Your email verification link has been sent. Please verify your email before logging in.",
            email: values.email
          }
        });
      }, 2000);
    } catch (err) {
      setLoading(false);
      setToastMessage(err.response?.data ?? "Error in registering");
      setToastType("error");
      setShowToast(true);
    }
  };
  const handleCloseToast = () => {
    setShowToast(false);
  };

  // Handler for closing the Terms modal (OK button)
  const handleCloseTermsModal = () => {
    setShowTermsModal(false);
  };

  return (
    <div className={style.registerContainer}>
      <Row className="justify-content-center align-items-center">
        <div className={style.registerCard}>
          <Card>
            <Card.Body>
              <>
                <img src={tempLogo} className={style.loginLogo} alt="logo" />
                <Formik
                  initialValues={initialValues}
                  onSubmit={handleSubmit}
                  validationSchema={validationSchema}
                >
                  {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    isValid,
                    dirty
                  }) => (
                    <Form noValidate onSubmit={handleSubmit} autoComplete="off">
                      <Row>
                        <Col lg="6">
                          <Form.Group className="mb-3" controlId="firstName">
                            <Form.Label>First Name*</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Enter First Name"
                              value={values.firstName}
                              name="firstName"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              isInvalid={touched.firstName && !!errors.firstName}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.firstName}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        <Col lg="6">
                          <Form.Group className="mb-3" controlId="lastName">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Enter Last Name"
                              value={values.lastName}
                              name="lastName"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              isInvalid={touched.lastName && !!errors.lastName}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.lastName}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                      </Row>
                      <Form.Group className="mb-3" controlId="email">
                        <Form.Label>Email Id*</Form.Label>
                        <Form.Control
                          placeholder="Enter Email Id"
                          value={values.email}
                          name="email"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          autoComplete="username"
                          isInvalid={touched.email && !!errors.email}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.email}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group className="mb-3" controlId="phoneNumber">
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter Phone Number"
                          name="phone"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.phone}
                          isInvalid={touched.phone && !!errors.phone}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.phone}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group className="mb-3" controlId="registerPassword">
                        <Form.Label>Password*</Form.Label>
                        <InputGroup>
                          <Form.Control
                            placeholder="Enter Password"
                            value={values.password}
                            name="password"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            type={showPassword ? "text" : "password"}
                            autoComplete="new-password"
                            isInvalid={touched.password && !!errors.password}
                          />
                          <InputGroup.Text
                            onClick={() => setShowPassword(!showPassword)}
                            style={{ cursor: "pointer", borderLeft: "1px solid #ccc", background: "#fff" }}
                          >
                            {showPassword ? <VisibilityOff sx={{ color: 'grey' }} /> : <Visibility sx={{ color: 'grey' }} />}
                          </InputGroup.Text>
                          <Form.Control.Feedback type="invalid">
                            {errors.password}
                          </Form.Control.Feedback>
                        </InputGroup>
                      </Form.Group>
                      <Form.Group className="mb-3" controlId="confirmPassword">
                        <Form.Label>Confirm Password*</Form.Label>
                        <InputGroup>
                          <Form.Control
                            placeholder="Enter Password"
                            value={values.confirm}
                            name="confirm"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            type={showConfirmPassword ? "text" : "password"}
                            autoComplete="new-password"
                            isInvalid={touched.confirm && !!errors.confirm}
                          />
                          <InputGroup.Text
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            style={{ cursor: "pointer", borderLeft: "1px solid #ccc", background: "#fff" }}
                          >
                            {showConfirmPassword ? <VisibilityOff sx={{ color: 'grey' }} /> : <Visibility sx={{ color: 'grey' }} />}
                          </InputGroup.Text>
                          <Form.Control.Feedback type="invalid">
                            {errors.confirm}
                          </Form.Control.Feedback>
                        </InputGroup>
                      </Form.Group>
                      <Form.Group className="mb-3" controlId="terms">
                        <Form.Check
                          type="checkbox"
                          label={
                            <>
                              I agree to the{" "}
                              <a
                                href="/terms.html"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Terms and Conditions
                              </a>
                            </>
                          }
                          name="terms"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.terms && !!errors.terms}
                          feedback={errors.terms}
                        />
                      </Form.Group>

                      <Button
                        className="tdei-primary-button"
                        variant="primary col-12 mx-auto"
                        type="submit"
                        disabled={loading}
                      >
                        {loading ? "Creating Account..." : "Create Account"}
                      </Button>
                      <div className="mt-5">
                        Already have an account?{" "}
                        <Link className="tdei-primary-link" to={"/login"}>
                          Sign in
                        </Link>
                      </div>
                    </Form>
                  )}
                </Formik>
              </>
            </Card.Body>
          </Card>
        </div>
      </Row>
      <ResponseToast
        showtoast={showToast}
        handleClose={handleCloseToast}
        message={toastMessage}
        type={toastType}
      />
      <CustomModal
        show={showTermsModal}
        onHide={handleCloseTermsModal}
        message="Please accept Terms and Conditions to create your account."
        btnlabel="OK"
        modaltype="error"
        handler={handleCloseTermsModal}
      />
    </div>
  );
};

export default Register
