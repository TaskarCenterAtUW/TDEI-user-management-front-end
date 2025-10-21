import React, { useState } from "react";
import { Modal, Form, InputGroup, Button, Alert } from "react-bootstrap";
import { Formik } from "formik";
import * as yup from "yup";
import ResponseToast from "../ToastMessage/ResponseToast";
import useApplyReferralCode from "../../hooks/referrals/useApplyReferralCode";

const validationSchema = yup.object().shape({
  referral_code: yup
    .string()
    .trim()
    .required("Referral code is required")
    .max(64, "Referral code must be ≤ 64 characters"),
});

const ApplyReferralCode = ({ show, onHide }) => {
  const [toast, setToast] = useState({ show: false, type: "success", message: "" });

  const handleToastClose = () => setToast((t) => ({ ...t, show: false }));

  const { mutate, isLoading, error, reset } = useApplyReferralCode({
    onSuccess: () => {
      setToast({ show: true, type: "success", message: "Referral code applied successfully." });
      onHide?.();
    },
    onError: (err) => {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to apply referral code.";
      setToast({ show: true, type: "error", message: msg });
    },
  });

  const handleExit = () => {
    reset?.();
    onHide?.();
  };

  return (
    <>
      {show ? (
        <Modal
          onHide={handleExit}
          show={show}
          size="md"
          aria-labelledby="apply-referral-code-title"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="apply-referral-code-title">
              Apply Referral Code
            </Modal.Title>
          </Modal.Header>

          {error ? (
            <Alert variant="danger">
              {error?.response?.data?.message || "Failed to apply referral code."}
            </Alert>
          ) : null}

          <Formik
            initialValues={{ referral_code: "" }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              const code = (values.referral_code || "").trim();
              mutate(code);
            }}
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
                <Modal.Body>
                  <Form.Group className="mb-3" controlId="referral_code">
                    <Form.Label>Referral Code</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        name="referral_code"
                        placeholder="Enter referral code"
                        value={values.referral_code}
                        onChange={(e) => {
                          const v = e.target.value.replace(/^\s+/, "");
                          handleChange({ target: { name: "referral_code", value: v } });
                        }}
                        onBlur={handleBlur}
                        isInvalid={touched.referral_code && !!errors.referral_code}
                        autoComplete="off"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.referral_code}
                      </Form.Control.Feedback>
                    </InputGroup>
                    <div className="form-text mt-1">
                      Paste the code shared with you and click Apply.
                    </div>
                  </Form.Group>
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
                    disabled={isLoading || !values.referral_code.trim()}
                  >
                    {isLoading ? "Applying…" : "Apply"}
                  </Button>
                </Modal.Footer>
              </Form>
            )}
          </Formik>

          <ResponseToast
            handleClose={handleToastClose}
            showtoast={toast.show}
            type={toast.type}
            message={toast.message}
            autoHideDuration={3000}
          />
        </Modal>
      ) : null}
    </>
  );
};

export default ApplyReferralCode;
