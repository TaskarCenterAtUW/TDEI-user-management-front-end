import React, { useState } from "react";
import { Modal, Button, Form, InputGroup } from "react-bootstrap";
import style from "./ProjectGroupSettings.module.css";
import { FaCopy } from "react-icons/fa";

const ProjectGroupSettings = (props) => {
  const { projectGroup } = props;
  const [isDataViewerEnabled, setDataViewerEnabled] = useState(false);
  const [copySuccess, setCopySuccess] = useState("");
  const [turnaroundTime, setTurnaroundTime] = useState("1");
  const [turnaroundUnit, setTurnaroundUnit] = useState("days");
  const [turnaroundTimeError, setTurnaroundTimeError] = useState("");

  const handleClose = () => {
    props.onHide();
    setCopySuccess("");
    setTurnaroundTime("1");
    setTurnaroundUnit("days");
    setTurnaroundTimeError("");
  };

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

  const handleSaveSettings = () => {
    if (!turnaroundTime) {
      setTurnaroundTimeError("This field is required.");
      return;
    }
    // Here you would typically save to backend/database
    handleClose();
  };

  return (
    <>
      {props.show ? (
        <Modal show={props.show} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>Project Group Settings</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Text className={style.description}>
              Configure data viewer access and feedback response settings for{" "}
              {projectGroup.project_group_name}.
            </Form.Text>
            <Form.Group className="mb-3" controlId="enableDataViewer">
              <Form.Group>
                <Form.Group className="d-flex  align-items-center">
                  <Form.Label>Enable Data Viewer</Form.Label>
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
                  <div className="mb-3">
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
            </Form.Group>
            <Form.Group className="mb-3" controlId="expectedTurnaroundTime">
              <Form.Group>
                <Form.Label>Expected Turnaround Time</Form.Label>
              </Form.Group>
              <Form.Text className={style.description}>
                What is the expected turn around time to resolve user's feedback
                and comments?
              </Form.Text>
              <InputGroup>
                <Form.Control
                  type="number"
                  value={turnaroundTime}
                  min="0"
                  style={{ maxWidth: "120px" }}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "" || Number(value) >= 0) {
                      setTurnaroundTime(value);
                      if (value) {
                        setTurnaroundTimeError("");
                      } else {
                        setTurnaroundTimeError("This field is required.");
                      }
                    }
                  }}
                  isInvalid={!!turnaroundTimeError}
                  required
                />
                <Form.Group style={{ width: "10px" }} />
                <Form.Select
                  value={turnaroundUnit}
                  onChange={(e) => setTurnaroundUnit(e.target.value)}
                  style={{ maxWidth: "120px" }}
                >
                  <option value="days">Days</option>
                  <option value="weeks">Weeks</option>
                  <option value="months">Months</option>
                  <option value="years">Years</option>
                </Form.Select>
              </InputGroup>
              {turnaroundTimeError && (
                <Form.Control.Feedback type="invalid" className="d-block">
                  {turnaroundTimeError}
                </Form.Control.Feedback>
              )}
              {turnaroundTime && !turnaroundTimeError && (
                <Form.Text className={style.description}>
                  Current setting: {turnaroundTime} {turnaroundUnit}
                </Form.Text>
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
              onClick={handleSaveSettings}
            >
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      ) : null}
    </>
  );
};

export default ProjectGroupSettings;
