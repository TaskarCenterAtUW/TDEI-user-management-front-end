import React, { useState } from "react";
import { Modal, Button, Form, InputGroup } from "react-bootstrap";
import style from "./ProjectGroupSettings.module.css";
import { FaCopy, FaGlobe } from "react-icons/fa";
import * as yup from "yup";
import { Formik } from "formik";
import ResponseToast from "../ToastMessage/ResponseToast";
import { useDispatch } from "react-redux";
import { useQueryClient } from "react-query";
import { show as showModal } from "../../store/notificationModal.slice";
import useUpdateProjectGroupSettings from "../../hooks/useUpdateProjectGroupSettings";
import { GET_PROJECT_GROUP_ROLES } from "../../utils/react-query-constant";

const ProjectGroupSettings = (props) => {
  const { projectGroup } = props;
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [copySuccess, setCopySuccess] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { mutate, isLoading } = useUpdateProjectGroupSettings({
    onSuccess: () => {
      queryClient.invalidateQueries(GET_PROJECT_GROUP_ROLES);
      dispatch(
        showModal({
          message: "Project group settings updated successfully.",
          type: "success",
        })
      );
      handleClose();
    },
    onError: (error) => {
      console.error(error);
      setErrorMessage(error.response.data);
      setShowToast(true);
    },
  });

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
    return `${process.env.REACT_APP_DATAVIEWER_URL}project-group/${projectGroup.tdei_project_group_id}`;
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

  const handleSaveSettings = (values) => {
    const payload = {
      dataset_viewer_allowed: values.isDataViewerEnabled,
      feedback_turnaround_time: {
        number: Number(values.turnaroundTime),
        units: values.turnaroundUnit,
      },
    };
    mutate({
      projectGroupId: projectGroup.tdei_project_group_id,
      payload,
    });
  };

  return (
    <>
      {props.show ? (
        <Modal show={props.show} onHide={handleClose} centered>
          <Formik
            initialValues={{
              isDataViewerEnabled:
                projectGroup.data_viewer_config?.dataset_viewer_allowed ??
                false,
              turnaroundTime:
                projectGroup.data_viewer_config?.feedback_turnaround_time
                  ?.number ?? "1",
              turnaroundUnit:
                projectGroup.data_viewer_config?.feedback_turnaround_time
                  ?.units ?? "days",
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
              isValid,
            }) => (
              <Form onSubmit={handleSubmit}>
                <Modal.Header closeButton>
                  <Modal.Title as="h4">Project Group Settings</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form.Text className={style.description}>
                    Configure data viewer access and feedback response settings
                    for {projectGroup.project_group_name}.
                  </Form.Text>
                  <Form.Group className="mb-3" controlId="enableDataViewer">
                    <Form.Group className="d-flex  align-items-center mt-3">
                      <Form.Label className="mb-0" htmlFor="custom-switch">
                        Enable Data Viewer
                      </Form.Label>
                      <Form.Check
                        type="switch"
                        id="custom-switch"
                        name="isDataViewerEnabled"
                        checked={values.isDataViewerEnabled}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        style={{
                          marginLeft: "auto",
                          fontSize: "1.5rem",
                        }}
                      />
                    </Form.Group>
                    <Form.Text className={style.description}>
                      Allow public access to released datasets.
                    </Form.Text>
                    {values.isDataViewerEnabled && (
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
                            aria-label="Copy viewer URL to clipboard"
                          >
                            {copySuccess ? copySuccess : <FaCopy />}
                          </Button>
                          <Button
                            variant="outline-secondary"
                            onClick={() =>
                              window.open(generateViewerUrl(), "_blank")
                            }
                            aria-label="Open viewer URL in new tab"
                          >
                            <FaGlobe />
                          </Button>
                        </InputGroup>
                        <Form.Group style={{ height: "10px" }} />
                        <Form.Group
                          className="mb-3"
                          controlId="expectedTurnaroundTime"
                        >
                          <Form.Group>
                            <Form.Label>Expected Turnaround Time</Form.Label>
                          </Form.Group>
                          <Form.Group>
                            <Form.Text className={style.description}>
                              What is the expected turn around time to resolve
                              user's feedback and comments?
                            </Form.Text>
                          </Form.Group>
                          <InputGroup className="mt-2">
                            <Form.Control
                              type="number"
                              name="turnaroundTime"
                              value={values.turnaroundTime}
                              aria-label="Turnaround time"
                              min="1"
                              style={{ maxWidth: "120px" }}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              isInvalid={
                                touched.turnaroundTime &&
                                !!errors.turnaroundTime
                              }
                              required
                            />
                            <Form.Group style={{ width: "10px" }} />
                            <Form.Select
                              name="turnaroundUnit"
                              value={values.turnaroundUnit}
                              aria-label="Turnaround time unit"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              style={{ maxWidth: "120px" }}
                            >
                              <option value="days">Days</option>
                              <option value="months">Months</option>
                              <option value="years">Years</option>
                            </Form.Select>
                          </InputGroup>
                          {touched.turnaroundTime && errors.turnaroundTime && (
                            <Form.Control.Feedback
                              type="invalid"
                              className="d-block"
                            >
                              {errors.turnaroundTime}
                            </Form.Control.Feedback>
                          )}
                        </Form.Group>
                      </div>
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
                    disabled={isLoading || !isValid}
                  >
                    {isLoading ? "Saving..." : "Save Changes"}
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
              errorMessage ??
              "Error! Not able to update project group settings. please try again."
            }
          />
        </Modal>
      ) : null}
    </>
  );
};

export default ProjectGroupSettings;
