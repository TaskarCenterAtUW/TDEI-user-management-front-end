import React, { useState } from "react";
import Container from "../../components/Container/Container";
import Layout from "../../components/Layout";
import style from "./Jobs.module.css";
import Select from "react-select";
import Dropzone from "../../components/DropZone/Dropzone";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import useCreateJob from "../../hooks/jobs/useCreateJob";
import { POST_DATASET } from "../../utils";
import { Spinner, Form, Row, Col } from "react-bootstrap";
import CustomModal from "../../components/SuccessModal/CustomModal";
import ToastMessage from "../../components/ToastMessage/ToastMessage";

const jobTypeOptions = [
    { value: 'osw-validate', label: 'OSW - Validate' },
    { value: 'flex-validate', label: 'Flex - Validate' },
    { value: 'pathways-validate', label: 'Pathways - Validate' },
    { value: 'osw-convert', label: 'OSW - Convert' },
    { value: 'confidence', label: 'Confidence Calculation' },
    { value: 'quality-metric', label: 'Quality Metric Calculation' },
    { value: 'dataset-bbox', label: 'Dataset BBox' },
    { value: 'dataset-tag-road', label: 'Dataset Tag Road' }
];

const formatOptions = [
    { value: 'osw', label: 'OSW' },
    { value: 'osm', label: 'OSM' }
];

const formConfig = {
    "osw-convert": [
        { label: "Source Format", type: "select", options: formatOptions, stateSetter: "setSourceFormat" },
        { label: "Target Format", type: "select", options: formatOptions, stateSetter: "setTargetFormat" },
        { label: "Attach data file", type: "dropzone" }
    ],
    "flex-validate": [
        { label: "Attach data file", type: "dropzone" }
    ],
    "pathways-validate": [
        { label: "Attach data file", type: "dropzone" }
    ],
    "osw-validate": [
        { label: "Attach data file", type: "dropzone" }
    ],
    "confidence": [
        { label: "Tdei Dataset Id", type: "text", stateSetter: "setTdeiDatasetId" },
        { label: "Attach data file", type: "dropzone" }
    ],
    "quality-metric": [
        { label: "Tdei Dataset Id", type: "text", stateSetter: "setTdeiDatasetId" },
        { label: "Algorithms & Optional Persistence", type: "textarea", stateSetter: "setAlgorithmsJson" }
    ],
    "dataset-bbox": [
        { label: "Tdei Dataset Id", type: "text", stateSetter: "setTdeiDatasetId" },
        { label: "File Type", type: "select", options: formatOptions, stateSetter: "setFileType" },
        {
            label: "Bounding Box Value", type: "bbox", stateSetters: {
                west: "setBboxWest",
                south: "setBboxSouth",
                east: "setBboxEast",
                north: "setBboxNorth"
            }
        }
    ],
    "dataset-tag-road": [
        { label: "Source Dataset Id", type: "text", stateSetter: "setSourceDatasetId" },
        { label: "Target Dataset Id", type: "text", stateSetter: "setTargetDatasetId" }
    ]
};

const CreateJobService = () => {
    const navigate = useNavigate();
    const [jobType, setJobType] = React.useState();
    const [selectedFile, setSelectedFile] = React.useState();
    const [loading, setLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = React.useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showToast, setToast] = useState(false);
    const [sourceFormat, setSourceFormat] = React.useState();
    const [targetFormat, setTargetFormat] = React.useState();
    const [showValidateToast, setShowValidateToast] = useState(false);
    const [validateErrorMessage, setValidateErrorMessage] = useState("");
    const [tdeiDatasetId, setTdeiDatasetId] = React.useState("");
    const [sourceDatasetId, setSourceDatasetId] = React.useState("");
    const [targetDatasetId, setTargetDatasetId] = React.useState("");
    const [algorithmsJson, setAlgorithmsJson] = React.useState("");
    const [bboxValues, setBboxValues] = React.useState({
        west: "",
        south: "",
        east: "",
        north: ""
    });
    const [fileType, setFileType] = React.useState();

    const onSuccess = (data) => {
        setLoading(false);
        console.log("successfully created", data);
        setShowSuccessModal(true);
    };

    const onError = (err) => {
        setLoading(false);
        console.error("error message", err);
        setToast(true);
        setErrorMessage(err.data);
    };

    const { isLoading, mutate } = useCreateJob({ onSuccess, onError });

    const onStepsComplete = (uploadData) => {
        console.log(uploadData);
        setLoading(true)
        //mutate(uploadData);
    };

    function handleJobTypeSelect(type) {
        setJobType(type);
    }

    const handlePop = () => {
        navigate(-1);
    };

    const onDrop = (files) => {
        const selectedFile = files[0];
        setSelectedFile(selectedFile);
    };

    const handleClose = () => {
        setToast(false);
    };

    const handleCloseToast = () => {
        setShowValidateToast(false);
    };

    const handleCreate = () => {
        if (!jobType) {
            setValidateErrorMessage("Job type is required");
            setShowValidateToast(true);
            return;
        }
        if (!selectedFile && ["osw-validate", "flex-validate", "pathways-validate", "osw-convert"].includes(jobType.value)) {
            setValidateErrorMessage("File is required");
            setShowValidateToast(true);
            return;
        }

        let urlPath = "";
        switch (jobType?.value) {
            case "osw-validate":
                urlPath = "osw/validate";
                break;
            case "flex-validate":
                urlPath = "gtfs-flex/validate";
                break;
            case "pathways-validate":
                urlPath = "gtfs-pathways/validate";
                break;
            case "osw-convert":
                urlPath = "osw/convert";
                break;
            case "confidence":
                urlPath = "osw/confidence/";
                break;
            case "quality-metric":
                urlPath = "quality-metric/calculate";
                break;
            case "dataset-bbox":
                urlPath = "dataset/bbox";
                break;
            case "dataset-tag-road":
                urlPath = "dataset/tag-road";
                break;
        }

        if (urlPath === "osw/convert") {
            if (!sourceFormat?.value || !targetFormat?.value) {
                setValidateErrorMessage("Source and target formats are required for OSW - Convert job");
                setShowValidateToast(true);
                return;
            }
        }

        const uploadData = [urlPath, selectedFile];
        if (urlPath === "osw/convert") {
            uploadData.push(sourceFormat.value, targetFormat.value);
        }

        setLoading(true);
        mutate(uploadData);
    };

    const renderFormFields = () => {
        if (!jobType) return null;

        const fields = formConfig[jobType.value];
        if (!fields) return null;

        return fields.map((field, index) => {
            switch (field.type) {
                case "select":
                    return (
                        <div key={index} className={style.formItems}>
                            <p>{field.label}<span style={{ color: 'red' }}> *</span></p>
                            <Select
                                className={style.createJobSelectType}
                                options={field.options}
                                placeholder={`Select ${field.label.toLowerCase()}`}
                                onChange={(value) => {
                                    if (field.stateSetter === "setSourceFormat") setSourceFormat(value);
                                    if (field.stateSetter === "setTargetFormat") setTargetFormat(value);
                                    if (field.stateSetter === "setFileType") setFileType(value);
                                }}
                            />
                        </div>
                    );
                case "text":
                    return (
                        <Form.Group key={index}>
                            <Form.Label>{field.label}<span style={{ color: 'red' }}> *</span></Form.Label>
                            <Form.Control
                                type="text"
                                name={field.label}
                                className={style.createJobSelectType}
                                onChange={(e) => {
                                    if (field.stateSetter === "setTdeiDatasetId") setTdeiDatasetId(e.target.value);
                                    if (field.stateSetter === "setSourceDatasetId") setSourceDatasetId(e.target.value);
                                    if (field.stateSetter === "setTargetDatasetId") setTargetDatasetId(e.target.value);
                                }}
                            />
                        </Form.Group>
                    );
                case "textarea":
                    return (
                        <div key={index} style={{ marginTop: '10px' }}>
                            <Form.Label>{field.label}<span style={{ color: 'red' }}> *</span></Form.Label>
                            <div className="jsonContent">
                                <Form.Control
                                    as="textarea"
                                    type="text"
                                    name={field.label}
                                    onChange={(e) => {
                                        if (field.stateSetter === "setAlgorithmsJson") setAlgorithmsJson(e.target.value);
                                    }}
                                    rows={10}
                                />
                            </div>
                        </div>
                    );
                case "dropzone":
                    return (
                        <div key={index} className={style.formItems}>
                            <p>{field.label}<span style={{ color: 'red' }}> *</span></p>
                            <Dropzone
                                onDrop={onDrop}
                                accept={{ 'application/zip': ['.zip'] }}
                                format=".zip"
                            />
                        </div>
                    );
                case "bbox":
                    return (
                        <div key={index}>
                            <p>{field.label}<span style={{ color: 'red' }}> *</span></p>
                            <div>
                                <Form.Group controlId="west" className={style.bboxFormGroup}>
                                    <Form.Label className={style.bboxLabel}>West</Form.Label>
                                    <Form.Control
                                        className={style.bboxForm}
                                        type="text"
                                        placeholder="Enter Coordinates"
                                        onChange={(e) => setBboxValues({ ...bboxValues, west: e.target.value })}
                                    />

                                </Form.Group>
                                <Form.Group controlId="south" className={style.bboxFormGroup}>
                                    <Form.Label className={style.bboxLabel}>South</Form.Label>
                                    <Form.Control
                                        className={style.bboxForm}
                                        type="text"
                                        placeholder="Enter Coordinates"
                                        onChange={(e) => setBboxValues({ ...bboxValues, south: e.target.value })}
                                    />
                                </Form.Group>
                                <Form.Group controlId="east" className={style.bboxFormGroup}>
                                    <Form.Label className={style.bboxLabel}>East</Form.Label>
                                    <Form.Control
                                        className={style.bboxForm}
                                        type="text"
                                        placeholder="Enter Coordinates"
                                        onChange={(e) => setBboxValues({ ...bboxValues, east: e.target.value })}
                                    />
                                </Form.Group>
                                <Form.Group controlId="north" className={style.bboxFormGroup}>
                                    <Form.Label className={style.bboxLabel}>North</Form.Label>
                                    <Form.Control
                                        className={style.bboxForm}
                                        type="text"
                                        placeholder="Enter Coordinates"
                                        onChange={(e) => setBboxValues({ ...bboxValues, north: e.target.value })}
                                    />
                                </Form.Group>
                            </div>
                        </div>
                    );
                default:
                    return null;
            }
        });
    };

    return (
        <Layout>
            <div className={style.createJobContainer}>
                <>
                    <div className={style.createJobTitle}>Create New Job</div>
                    <div className={style.divider}></div>
                    <div className={style.rectangleBox}>
                        <form className={style.form}>
                            <div className={style.formItems}>
                                <p>Job Type<span style={{ color: 'red' }}> *</span></p>
                                <Select
                                    className={style.createJobSelectType}
                                    options={jobTypeOptions}
                                    placeholder="Select a Job type"
                                    onChange={handleJobTypeSelect}
                                />
                            </div>
                            {renderFormFields()}
                        </form>
                    </div>
                    <div className={style.divider}></div>
                    <div className={style.buttonContainer}>
                        <Button
                            className={style.buttonSecondaryCustomised}
                            onClick={handlePop}
                        >
                            Cancel
                        </Button>
                        <Button
                            className={`tdei-primary-button ${style.textUnset}`}
                            onClick={handleCreate}
                        >
                            Create
                        </Button>
                    </div>

                    {loading && (
                        <div className={style.loaderOverlay}>
                            <div className={style.spinnerContainer}>
                                <Spinner animation="border" role="status" color='white'>
                                </Spinner>
                            </div>
                        </div>
                    )}
                    {showSuccessModal && (
                        <CustomModal
                            show={showSuccessModal}
                            message="Job has been created!"
                            content="Find the status of the job in jobs page."
                            handler={() => {
                                setShowSuccessModal(false);
                                navigate('/jobs', { replace: true });
                            }}
                            btnlabel="Go to Jobs page"
                            modaltype="success"
                            title="Success"
                        />
                    )}
                    {showToast && (
                        <CustomModal
                            show={showToast}
                            message="Dataset Upload Failed!"
                            content={errorMessage}
                            handler={handleClose}
                            btnlabel="Dismiss"
                            modaltype="error"
                            title="Error"
                        />
                    )}
                    <ToastMessage
                        showToast={showValidateToast}
                        toastMessage={validateErrorMessage}
                        onClose={handleCloseToast}
                        isSuccess={false}
                    />
                </>
            </div>
        </Layout>
    );
};

export default CreateJobService;
