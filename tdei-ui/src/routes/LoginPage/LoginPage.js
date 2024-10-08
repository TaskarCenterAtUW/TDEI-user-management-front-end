import React, { useState } from "react";
import { Row, Form, Button, Card, InputGroup } from "react-bootstrap";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import style from "./style.module.css";
import tempLogo from "./../../assets/img/tdei_logo.svg";
import { useDispatch } from "react-redux";
import { show } from "../../store/notification.slice";
import { Formik } from "formik";
import * as yup from "yup";
import ForgotPassModal from "../../components/ForgotPassModal/ForgotPassModal";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const LoginPage = () => {
  const [loading, setLoading] = React.useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const location = useLocation();
  const auth = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate(); 
  const initialValues = {
    username: "",
    password: "",
  };

  const validationSchema = yup.object().shape({
    username: yup.string().required("Email Id is required"),
    password: yup.string().required("Password is required"),
  });

  const handleSignIn = async (values) => {
    setLoading(true);
    auth.signin(
      values,
      (data) => {
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setLoading(false);
        if(err.status === 403 || err.response.status === 403){
           navigate("/emailVerify", {
            state: {  
              actionText: "Your email address has not been verified. Please verify your email before logging in.",
              email: values.username 
            }
          });
        } else {
          dispatch(show({ message: "Invalid credentials or Error in signing in", type: "danger" }));
        }
      }
    );
  };

  if (auth.user) {
    return <Navigate to={location.state?.from?.pathname || "/"} replace />;
  }

  return (
    <div className={style.loginContainer}>
      <Row className="justify-content-center align-items-center">
        <div className={style.loginCard}>
          <Card>
            <Card.Body>
              <>
                <img src={tempLogo} className={style.loginLogo} alt="logo" />
                <div className={style.loginTitle}>Welcome!</div>
                <div className={style.loginSubTitle}>
                  Please login to your account.
                </div>
                <Formik
                  initialValues={initialValues}
                  onSubmit={handleSignIn}
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
                    <Form noValidate onSubmit={handleSubmit}>
                      <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email Id</Form.Label>
                        <Form.Control
                          type="email"
                          placeholder="Enter Email Id"
                          value={values.username}
                          name="username"
                          isInvalid={touched.username && !!errors.username}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          autoComplete="username"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.username}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group
                        className="mb-3"
                        controlId="formBasicPassword"
                      >
                        <Form.Label>Password</Form.Label>
                        <InputGroup>
                          <Form.Control
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter Password"
                            value={values.password}
                            name="password"
                            isInvalid={touched.password && !!errors.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            autoComplete="current-password"
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
                      <Form.Group
                        className="mb-3 d-flex justify-content-between align-items-center"
                        controlId="formBasicCheckbox"
                      >
                        {/* <Form.Check type="checkbox" label="Remember me" /> */}
                        {/* <Button className="tdei-primary-link" variant="link">Reset Password?</Button> */}
                      </Form.Group>
                      <Button
                        className="tdei-primary-button"
                        variant="primary col-12 mx-auto"
                        type="submit"
                        disabled={loading}
                      >
                        {loading ? "Signing In..." : "Sign In"}
                      </Button>
                      <div className="mt-5 mb-2">
                        New to TDEI?{" "}
                        <Link className="tdei-primary-link" to={"/register"}>
                          Register Now
                        </Link>
                        
                      </div>
                      <Link className="tdei-primary-link" to={"/ForgotPassword"}>
                        Forgot Password?
                        </Link>
                    </Form>
                  )}
                </Formik>
              </>
            </Card.Body>
          </Card>
        </div>
      </Row>
      <div className={style.appVersionText}>V 0.2.1</div>
    </div>
  );
};

export default LoginPage;
