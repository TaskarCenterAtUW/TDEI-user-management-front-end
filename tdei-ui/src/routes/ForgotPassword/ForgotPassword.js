import React, { useState } from "react";
import { Row, Form, Button, Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { show } from "../../store/notification.slice";
import { Formik } from "formik";
import * as yup from "yup";
import style from "./style.module.css";
import tempLogo from "./../../assets/img/tdei_logo.svg";

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate(); 

  const initialValues = {
    email: "",
  };

  const validationSchema = yup.object().shape({
    email: yup
      .string()
      .email("Invalid email Id")
      .required("Please enter email Id"),
  });

  const handleForgotPassword = async ({ email }) => {
    setLoading(true);
    try {
      // Make the API call
      await axios.post(
        `${process.env.REACT_APP_OSM_URL}/recover-password`, 
        email, 
        {
          headers: {
            "Content-Type": "text/plain", 
          },
        }
      );
      // Dispatch success notification
      dispatch(show({ message: "Password recovery email sent successfully", type: "success" }));
      setLoading(false);

       // On success navigate to the VerifyComponent and pass state
       navigate("/passwordReset", {
        state: {
          heading: "Reset Password Request",      
          actionText: "password reset",   
          checkLink: "/check-username",    
          email                            
        },
      });
      
    } catch (err) {
      setLoading(false);
      if (err.status === 400) {
        dispatch(show({ message: "We couldn't recognize your account! Please verify your email", type: "danger" }));
      }
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
                <div className={style.loginTitle}>Forgot Password</div>
                <Formik
                  initialValues={initialValues}
                  onSubmit={handleForgotPassword}
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
                      <Form.Group className="mb-3" controlId="email">
                        <Form.Label>Email Id*</Form.Label>
                        <Form.Control
                          placeholder="Enter Email Id"
                          value={values.email}
                          name="email"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          autoComplete="email"
                          isInvalid={touched.email && !!errors.email}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.email}
                        </Form.Control.Feedback>
                      </Form.Group>

                      <Button
                        className="tdei-primary-button"
                        variant="primary col-12 mx-auto"
                        type="submit"
                        disabled={!dirty || !isValid}
                      >
                        {loading ? "Requesting..." : "Request"}
                      </Button>

                      <div className="mt-5">
                        Remember your password?{" "}
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

export default ForgotPassword;
