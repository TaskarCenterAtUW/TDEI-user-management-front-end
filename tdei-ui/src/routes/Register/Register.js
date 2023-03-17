import React from "react";
import { Row, Form, Button, Card, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";
import style from "./style.module.css";
import tempLogo from "./../../assets/img/tdei_logo.svg";
import { useDispatch } from "react-redux";
import { show } from "../../store/notification.slice";
import { PHONE_REGEX } from "../../utils";
import { Formik } from "formik";
import * as yup from "yup";

const Register = () => {
  const [loading, setLoading] = React.useState(false);
  const auth = useAuth();
  const dispatch = useDispatch();

  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
  };

  const validationSchema = yup.object().shape({
    email: yup.string().required("Email is required"),
    password: yup
      .string()
      .matches(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}/,
        "Password must be 8 characters long, requires a number, requires an uppercase letter, requires an lowercase letter, requires a symbol"
      ),
    phone: yup.string().matches(PHONE_REGEX, "Phone number is not valid"),
    confirm: yup
      .string()
      .oneOf([yup.ref("password"), null], 'Must match "Password" field value'),
  });

  const handleCreateAccount = async ({
    firstName,
    lastName,
    email,
    phone,
    password,
  }) => {
    setLoading(true);
    try {
      await axios.post(
        "https://tdei-usermanagement-ts-dev.azurewebsites.net/api/v1/register",
        {
          firstName,
          lastName,
          email,
          phone,
          password,
        }
      );
      auth.signin(
        { username: email, password },
        (data) => {
          setLoading(false);
        },
        (err) => {
          console.error(err);
          setLoading(false);
        }
      );
    } catch (err) {
      setLoading(false);
      dispatch(show({ message: "Error in registering", type: "danger" }));
    }
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
                  onSubmit={handleCreateAccount}
                  validationSchema={validationSchema}
                >
                  {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                  }) => (
                    <Form noValidate onSubmit={handleSubmit} autoComplete="off">
                      <Row>
                        <Col lg="6">
                          <Form.Group className="mb-3" controlId="firstName">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Enter First Name"
                              value={values.firstName}
                              name="firstName"
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
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
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Form.Group className="mb-3" controlId="emailId">
                        <Form.Label>Email Id</Form.Label>
                        <Form.Control
                          placeholder="Enter Email Id"
                          value={values.email}
                          name="email"
                          isInvalid={touched.email && !!errors.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          autoComplete="username"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.email}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group className="mb-3" controlId="phoneNumber">
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control
                          type="number"
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
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                          placeholder="Enter Password"
                          value={values.password}
                          name="password"
                          isInvalid={touched.password && !!errors.password}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          type="password"
                          autoComplete="new-password"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.password}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group className="mb-3" controlId="confirmPassword">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                          placeholder="Enter Password"
                          value={values.confirm}
                          name="confirm"
                          isInvalid={touched.confirm && !!errors.confirm}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          type="password"
                          autoComplete="new-password"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.confirm}
                        </Form.Control.Feedback>
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
    </div>
  );
};

export default Register;
