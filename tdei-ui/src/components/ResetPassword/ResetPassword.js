import React, { useState } from "react";
import { Form, Button, Spinner, Alert, Modal } from "react-bootstrap";
import useResetPassword from "../../hooks/useResetPassword";
import { useDispatch } from "react-redux";
import { show as showModal } from "../../store/notificationModal.slice";
import { Formik } from "formik";
import * as yup from "yup";
import { useAuth } from "../../hooks/useAuth";
import InfoIcon from '@mui/icons-material/Info';
import style from './ResetPassword.module.css';
import axios from "axios";
import ResponseToast from "../ToastMessage/ResponseToast";

const ResetPassword = (props) => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const [showToast, setShowToast] = useState(false);
  const [isValidate, setValidate] = useState(false);
  const validationSchema = yup.object().shape({
    current_password: yup.string().required("Current Password is required"),
    new_password: yup
      .string()
      .required("New Password is required")
      .min(8, "Password must be at least 8 characters long")
      .matches(/[0-9]/, "Password must contain a number")
      .matches(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain a special character"),
    confirm_password: yup
      .string()
      .required("Confirm Password is required")
      .oneOf([yup.ref('new_password'), null], 'Passwords must match'),
  });

  const onSuccess = () => {
    props.onHide();
    setValidate(false);
    dispatch(
      showModal({
        message: "Password changed successfully!"
      })
    );
    setTimeout(() => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.location.reload();
    }, 2000);
  };
  const handleToastClose = () => {
    setShowToast(false);
  };
  const onError = (err) => {
    console.error(err);
    setValidate(false);
  };

  const {
    mutate,
    isLoading,
    error,
    isError: resetPasswordError,
    reset,
  } = useResetPassword({ onError, onSuccess });

  const handleResetPassword = async (values) => {
    try {
      setValidate(true);
      // Validate the current password
      const response = await axios.post(
        `${process.env.REACT_APP_URL}/authenticate`,
        {
          username: user.emailId ?? "",
          password: values.current_password,
        }
      );

      // If the current password is valid, proceed with password reset
      if (response.data) {
        mutate({
          username: user.emailId ?? "",
          password: values.new_password,
        });
      }
    } catch (error) {
      // If validation fails, show an error message
      console.error("error message", error);
      setShowToast(true);
      setValidate(false);
    }
  };

  const handleExit = () => {
    reset();
    props.onHide();
  };

  return (
    <>
      {props.show ? (
        <Modal
          onHide={handleExit}
          show={props.show}
          size="md"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Reset Password
            </Modal.Title>
          </Modal.Header>
          {resetPasswordError ? (
            <Alert variant={"danger"}>
              {error.data || "Error in resetting password"}
            </Alert>
          ) : null}
          <Formik
            initialValues={{
              current_password: "",
              new_password: "",
              confirm_password: "",
            }}
            onSubmit={handleResetPassword}
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
            }) => (
              <Form noValidate onSubmit={handleSubmit}>
                <Modal.Body>
                  <Form.Group className="mb-3" controlId="current_password">
                    <Form.Label>Current Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter current password"
                      value={values.current_password}
                      name="current_password"
                      isInvalid={touched.current_password && !!errors.current_password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      autoComplete="current-password"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.current_password}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="new_password">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter new password"
                      value={values.new_password}
                      name="new_password"
                      isInvalid={touched.new_password && !!errors.new_password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      autoComplete="new-password"
                    />
                    <InfoIcon fontSize="small" sx={{ marginRight: '4px', color: '#888', fontSize: "14px" }} />
                    <Form.Text id="passwordHelpBlock" className={style.description} muted>
                      Password should be at least 8 characters, a number, at least one special character.
                    </Form.Text>
                    <Form.Control.Feedback type="invalid">
                      {errors.new_password}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="confirm_password">
                    <Form.Label>Confirm New Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Confirm new password"
                      value={values.confirm_password}
                      name="confirm_password"
                      isInvalid={touched.confirm_password && !!errors.confirm_password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      autoComplete="new-password"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.confirm_password}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Text className={style.disclaimer}>
                    Upon successfully resetting your password, you will be logged out and will need to log in again with your new password.
                  </Form.Text>
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    variant="outline-secondary"
                    className="tdei-secondary-button"
                    onClick={handleExit}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="tdei-primary-button"
                    disabled={isLoading || isValidate}
                  >
                    {isLoading || isValidate ? "Submitting..." : "Submit"}
                  </Button>
                </Modal.Footer>
              </Form>
            )}
          </Formik>
          <ResponseToast
            handleClose={handleToastClose}
            showtoast={showToast}
            type={"error"}
            message={"Error! Invalid Current Password."}
          />
        </Modal>
      ) : null}
    </>
  );
};

export default ResetPassword;
