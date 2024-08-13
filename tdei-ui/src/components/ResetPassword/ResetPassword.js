import React from "react";
import { Form, Button, Spinner, Alert, Modal } from "react-bootstrap";
import useResetPassword from "../../hooks/useResetPassword";
import { useDispatch } from "react-redux";
import { show as showModal } from "../../store/notificationModal.slice";
import { Formik } from "formik";
import * as yup from "yup";
import { useAuth } from "../../hooks/useAuth";
import InfoIcon from '@mui/icons-material/Info';
import style from './ResetPassword.module.css';

const ResetPassword = (props) => {
  const { user } = useAuth();
  const [passwordData, setPasswordData] = React.useState({
    new_password: "",
    confirm_password: "",
  });
  const dispatch = useDispatch();

  const validationSchema = yup.object().shape({
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

  const onError = (err) => {
    console.error(err);
  };

  const {
    mutate,
    isLoading,
    error,
    isError: resetPasswordError,
    reset,
  } = useResetPassword({ onError, onSuccess });

  const handleResetPassword = (values) => {
    console.log(`passs userid -> ${user.emailId} new pass -> ${values.new_password  }`,)
    mutate({
        username: user.emailId ?? "",
        password: values.new_password  
    });
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
            initialValues={passwordData}
            onSubmit={handleResetPassword}
            validationSchema={validationSchema}
            enableReinitialize
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
                    <InfoIcon fontSize="small" sx={{ marginRight: '4px', color: '#888', fontSize:"14px" }} />
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
                    disabled={isLoading || !isValid}
                  >
                    {isLoading ? "Submitting..." : "Submit"}
                  </Button>
                </Modal.Footer>
              </Form>
            )}
          </Formik>
        </Modal>
      ) : null}
    </>
  );
};

export default ResetPassword;
