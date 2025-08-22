import React, { useState } from "react";
import { Modal, Button, Form, InputGroup } from "react-bootstrap";
import style from "./ProjectGroupSettings.module.css";
import { FaCopy } from "react-icons/fa";
import * as yup from "yup";
import { Formik } from "formik";
import ResponseToast from "../ToastMessage/ResponseToast";

const ProjectGroupSettings = (props) => {
  const { projectGroup } = props;
  const [isDataViewerEnabled, setDataViewerEnabled] = useState(false);
  const [copySuccess, setCopySuccess] = useState("");
  const [showToast, setShowToast] = useState(false);

  const handleClose = () => {
    props.onHide();
    setCopySuccess("");
    setShowToast(false);
  };

  const handleToastClose = () => {
    setShowToast(false);
  };

  const validationSchema = yup.object().shape({
    turnaroundTime: yup
      .number()
      .min(1, "Must be at least 1")
      .required("This field is required."),
  });

  const generateViewerUrl = () => {
    return `dataviewer.tdei.us/${projectGroup.tdei_project_group_id}`;
  };

  const copyViewerUrl = async () => {
    try {
      await navigator.clipboard.writeText(generateViewerUrl());
      setCopySuccess("Copied!");
      setTimeout(() => setCopySuccess(""), 2000);
    } catch (err) {
      console.error("Failed to copy URL: ", err);
      setCopySuccess("Failed");
      setTimeout(() => setCopySuccess(""), 2000);
    }
  };

  const handleSaveSettings = (values, { setSubmitting }) => {
    // Here you would typically save to backend/database
    console.log("Saving settings:", values);
    setSubmitting(false);
    handleClose();
  };

  return (
    <>
      {props.show ? (
        <Modal show={props.show} onHide={handleClose} centered>
          <Formik
            initialValues={{
              turnaroundTime: "1",
              turnaroundUnit: "days",
            }}
            onSubmit={handleSaveSettings}
            validationSchema={validationSchema}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
              isValid,
            }) => (
              <Form onSubmit={handleSubmit}>
                <Modal.Header closeButton>
                  <Modal.Title>Project Group Settings</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form.Text className={style.description}>
                    Configure data viewer access and feedback response settings
                    for {projectGroup.project_group_name}.
                  </Form.Text>
                  <Form.Group className="mb-3" controlId="enableDataViewer">
                    <Form.Group className="d-flex  align-items-center mt-3">
                      <Form.Label className="mb-0">
                        Enable Data Viewer
                      </Form.Label>
                      <Form.Check
                        type="switch"
                        id="custom-switch"
                        checked={isDataViewerEnabled}
                        onChange={(e) => setDataViewerEnabled(e.target.checked)}
                        style={{
                          marginLeft: "auto",
                          fontSize: "1.5rem",
                        }}
                      />
                    </Form.Group>
                    <Form.Text className={style.description}>
                      Allow public access to released datasets.
                    </Form.Text>
                    {isDataViewerEnabled && (
                      <div className="mt-3">
                        <Form.Label>Viewer URL</Form.Label>
                        <InputGroup>
                          <Form.Control
                            type="text"
                            value={generateViewerUrl()}
                            readOnly
                          />
                          <Button
                            variant="outline-secondary"
                            onClick={copyViewerUrl}
                          >
                            {copySuccess ? copySuccess : <FaCopy />}
                          </Button>
                        </InputGroup>
                      </div>
                    )}
                  </Form.Group>
                  <Form.Group
                    className="mb-3"
                    controlId="expectedTurnaroundTime"
                  >
                    <Form.Label>Expected Turnaround Time</Form.Label>
                    <Form.Text className={style.description}>
                      What is the expected turn around time to resolve user's
                      feedback and comments?
                    </Form.Text>
                    <InputGroup className="mt-2">
                      <Form.Control
                        type="number"
                        name="turnaroundTime"
                        value={values.turnaroundTime}
                        min="1"
                        style={{ maxWidth: "120px" }}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={
                          touched.turnaroundTime && !!errors.turnaroundTime
                        }
                        required
                      />
                      <Form.Group style={{ width: "10px" }} />
                      <Form.Select
                        name="turnaroundUnit"
                        value={values.turnaroundUnit}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        style={{ maxWidth: "120px" }}
                      >
                        <option value="days">Days</option>
                        <option value="weeks">Weeks</option>
                        <option value="months">Months</option>
                        <option value="years">Years</option>
                      </Form.Select>
                    </InputGroup>
                    {touched.turnaroundTime && errors.turnaroundTime && (
                      <Form.Control.Feedback type="invalid" className="d-block">
                        {errors.turnaroundTime}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    variant="outline-secondary"
                    className="tdei-secondary-button"
                    onClick={handleClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="tdei-primary-button"
                    disabled={isSubmitting || !isValid}
                  >
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </Button>
                </Modal.Footer>
              </Form>
            )}
          </Formik>
          <ResponseToast
            handleClose={handleToastClose}
            showtoast={showToast}
            type={"error"}
            message={
              "Error! Not able to update project group settings. please try again."
            }
          />
        </Modal>
      ) : null}
    </>
  );
};

export default ProjectGroupSettings;
