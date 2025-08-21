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

  const handleClose = () => {
    props.onHide();
    setCopySuccess("");
    setTurnaroundTime("");
    setTurnaroundUnit("days");
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
            <p className={style.description}>
              Configure data viewer access and feedback response settings for{" "}
              {projectGroup.project_group_name}.
            </p>
            <div className="mt-3">
              <div className="d-flex  align-items-center">
                <div>
                  <h5>Enable Data Viewer</h5>
                </div>
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
              </div>
              <p className={style.description}>
                Allow public access to released datasets.
              </p>
              {isDataViewerEnabled && (
                <div className="mt-3">
                  <Form.Label>Viewer URL</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="text"
                      value={generateViewerUrl()}
                      readOnly
                    />
                    <Button variant="outline-secondary" onClick={copyViewerUrl}>
                      {copySuccess ? copySuccess : <FaCopy />}
                    </Button>
                  </InputGroup>
                </div>
              )}
            </div>
            <div className="mt-4">
              <h5>Expected Turnaround Time</h5>
              <p className={style.description}>
                What is the expected turn around time to resolve user's feedback
                and comments?
              </p>
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
                    }
                  }}
                />
                <div style={{ width: "10px" }}></div>
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
              {turnaroundTime && (
                <Form.Text className="text-muted">
                  Current setting: {turnaroundTime} {turnaroundUnit}
                </Form.Text>
              )}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSaveSettings}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      ) : null}
    </>
  );
};

export default ProjectGroupSettings;
