import React, { useState } from "react";
import Container from "../../components/Container/Container";
import Layout from "../../components/Layout";
import style from "./Jobs.module.css";
import Select from "react-select";
import Dropzone from "../../components/DropZone/Dropzone";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import useCreateJob from "../../hooks/jobs/useCreateJob";
import { Spinner, Form } from "react-bootstrap";
import CustomModal from "../../components/SuccessModal/CustomModal";
import ToastMessage from "../../components/ToastMessage/ToastMessage";
import apiSpec from "../../assets/api_spec.json";
import notSelectedIcon from "../../assets/img/notSelectedIcon.png"
import InfoIcon from '@mui/icons-material/Info';
import { extractLinks } from "../../utils";
import QualityMetricAlgo from "./QualityMetricAlgo";
import JobJsonResponseModal from "../../components/JobJsonResponseModal/JobJsonResponseModal";
import { SPATIAL_JOIN, SAMPLE_SPATIAL_JOIN } from "../../utils";


const jobTypeOptions = [
    { value: 'osw-validate', label: 'OSW - Validate' },
    { value: 'flex-validate', label: 'Flex - Validate' },
    { value: 'pathways-validate', label: 'Pathways - Validate' },
    { value: 'osw-convert', label: 'OSW - Convert' },
    { value: 'confidence', label: 'Confidence Calculation' },
    { value: 'quality-metric', label: 'Quality Metric Calculation' },
    { value: 'dataset-bbox', label: 'Dataset BBox' },
    { value: 'dataset-tag-road', label: 'Dataset Tag Road' },
    { value: 'quality-metric-tag', label: 'Quality Metric Tag' },
    { value: 'spatial-join', label: 'Spatial Join' }
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
        { label: "Attach Subregion File", type: "dropzone" }
    ],
    "quality-metric": [
        { label: "Tdei Dataset Id", type: "text", stateSetter: "setTdeiDatasetId" },
        { label: "Algorithms & Optional Persistence", type: "dropdown", stateSetter: "setAlgorithmConfig" }
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
    ],
    "quality-metric-tag": [
        { label: "Tdei Dataset Id", type: "text", stateSetter: "setTdeiDatasetId" },
        { label: "Attach File", type: "dropzone" }
    ],
    "spatial-join" : [
        { label: "Spatial join operation request body", type: "textarea", stateSetter: "setSpatialRequestBody" }
    ]
};

const CreateJobService = () => {
    const navigate = useNavigate();
    const [jobType, setJobType] = React.useState(null);
    const [selectedFile, setSelectedFile] = React.useState(null);
    const [loading, setLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = React.useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showToast, setToast] = useState(false);
    const [sourceFormat, setSourceFormat] = React.useState(null);
    const [targetFormat, setTargetFormat] = React.useState(null);
    const [showValidateToast, setShowValidateToast] = useState(false);
    const [validateErrorMessage, setValidateErrorMessage] = useState("");
    const [tdeiDatasetId, setTdeiDatasetId] = React.useState("");
    const [sourceDatasetId, setSourceDatasetId] = React.useState("");
    const [targetDatasetId, setTargetDatasetId] = React.useState("");
    const [showJsonSuccessModal, setShowJsonSuccessModal] = React.useState(false);
    const [jobSuccessJson, setJobSuccessJson] = React.useState("");
    const [bboxValues, setBboxValues] = React.useState({
        west: "",
        south: "",
        east: "",
        north: ""
    });
    const [fileType, setFileType] = React.useState(null);
    const [algorithmConfig, setAlgorithmConfig] = useState({
        algorithms: [],
        persist: {}
    });
    const [spatialRequestBody, setSpatialRequestBody] = React.useState(JSON.stringify(SPATIAL_JOIN, null, 2));
    const [showModal, setShowModal] = useState(false);
    const handleAlgorithmUpdate = (updatedConfig) => {
        setAlgorithmConfig(updatedConfig);
    };

    const onSuccess = (data) => {
        setLoading(false);
        if (Array.isArray(data)){
            setShowJsonSuccessModal(true);
            setJobSuccessJson(data)
        }else{
            setShowSuccessModal(true);
        }
    };

    const onError = (err) => {
        setLoading(false);
        console.error("error message", err);
        setToast(true);
        setErrorMessage(err.data ?? err.message.message ?? err);
    };

    const { isLoading, mutate } = useCreateJob({ onSuccess, onError });

    function handleJobTypeSelect(type) {
        setJobType(type);
        setSelectedFile(null);
        setSourceFormat(null);
        setTargetFormat(null);
        setTdeiDatasetId("");
        setSourceDatasetId("");
        setTargetDatasetId("");
        setSpatialRequestBody(JSON.stringify(SPATIAL_JOIN, null, 2));
        setAlgorithmConfig({
            algorithms: [],
            persist: {}
        });
        setBboxValues({
            west: "",
            south: "",
            east: "",
            north: ""
        });
        setFileType(null);
    }
    const handleSourceFormatChange = (value) => {
        setSourceFormat(value);
        setSelectedFile(null); 
    };

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
    const handleModalClose = () => setShowModal(false);
    const handleShow = () => {
        setShowModal(true);
      };
    

    const handleCloseToast = () => {
        setShowValidateToast(false);
    };
    const getPathFromJobType = (jobType) => {
        const jobTypePathMap = {
            "osw-validate": "/api/v1/osw/validate",
            "flex-validate": "/api/v1/gtfs-flex/validate",
            "pathways-validate": "/api/v1/gtfs-pathways/validate",
            "osw-convert": "/api/v1/osw/convert",
            "confidence": "/api/v1/osw/confidence/{tdei_dataset_id}",
            "quality-metric": "/api/v1/osw/quality-metric/{tdei_dataset_id}",
            "dataset-bbox": "/api/v1/osw/dataset-bbox",
            "dataset-tag-road": "/api/v1/osw/dataset-tag-road",
            "quality-metric-tag": "/api/v1/osw/quality-metric/tag/{tdei_dataset_id}",
            "spatial-join": "/api/v1/osw/spatial-join"
        };

        return jobTypePathMap[jobType] || "";
    };

    const getDescription = (jobType) => {
        const path = getPathFromJobType(jobType);
        return apiSpec.paths[path]?.post?.description || "";
    };
    // Handle file input specific cases for description
    const getBBoxDescription = (label) => {
        const path = getPathFromJobType("dataset-bbox");
        if (label === "Tdei Dataset Id") {
            return apiSpec.paths[path]?.post?.parameters?.find(param => param.name === "tdei_dataset_id")?.description || "";
        } else if (label === "File Type") {
            return apiSpec.paths[path]?.post?.parameters?.find(param => param.name === "file_type")?.description || "";
        } else {
            return apiSpec.paths[path]?.post?.parameters?.find(param => param.name === "bbox")?.description || "";
        }
    };
    const getDatasetTagInputDescription = (label) => {
        const path = getPathFromJobType("dataset-tag-road");
        if (label === "Source Dataset Id") {
            return apiSpec.paths[path]?.post?.parameters?.find(param => param.name === "source_dataset_id")?.description || "";
        } else {
            return apiSpec.paths[path]?.post?.parameters?.find(param => param.name === "target_dataset_id")?.description || "";
        }
    }
    const getConfidenceInputDescription = (label) => {
        const path = getPathFromJobType("confidence");
        if (label === "Tdei Dataset Id") {
            return apiSpec.paths[path]?.post?.parameters?.find(param => param.name === "tdei_dataset_id")?.description || "";
        } else {
            return apiSpec.paths[path]?.post?.requestBody?.content["multipart/form-data"]?.schema?.properties?.file?.description || "";
        }
    }
    const getQualityMetricDescription = (label) => {
        const path = getPathFromJobType("quality-metric");
        if (label === "Tdei Dataset Id") {
            return apiSpec.paths[path]?.post?.parameters?.find(param => param.name === "tdei_dataset_id")?.description || "";
        }
    }
    const getQualityMetricTagDescription = (label) => {
        const path = getPathFromJobType("quality-metric-tag");
        if (label === "Tdei Dataset Id") {
            return apiSpec.paths[path]?.post?.parameters?.find(param => param.name === "tdei_dataset_id")?.description || "";
        }else{
            return apiSpec.paths[path]?.post?.requestBody?.content["multipart/form-data"]?.schema?.properties?.file?.description || "";
        }
    }
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

        if (jobType.value === "confidence" && !tdeiDatasetId) {
            setValidateErrorMessage("Tdei Dataset Id is required for Confidence Calculation job");
            setShowValidateToast(true);
            return;
        }

        if (jobType.value === "quality-metric" && (!tdeiDatasetId || !(algorithmConfig.algorithms.length > 0))) {
            setValidateErrorMessage("Tdei Dataset Id and Algorithms, Persist are required for Quality Metric Calculation job");
            setShowValidateToast(true);
            return;
        }

        if (jobType.value === "dataset-bbox" && (!bboxValues.west || !bboxValues.south || !bboxValues.east || !bboxValues.north || !tdeiDatasetId)) {
            setValidateErrorMessage("Bounding Box values and Tdei Dataset Id are required for Dataset BBox job");
            setShowValidateToast(true);
            return;
        }

        if (jobType.value === "dataset-tag-road" && (!sourceDatasetId || !targetDatasetId)) {
            setValidateErrorMessage("Source and Target Dataset Ids are required for Dataset Tag Road job");
            setShowValidateToast(true);
            return;
        }

        if (jobType.value === "osw-convert") {
            if (!sourceFormat?.value || !targetFormat?.value) {
                setValidateErrorMessage("Source and target formats are required for OSW - Convert job");
                setShowValidateToast(true);
                return;
            }
        }
        if (jobType.value === "quality-metric-tag" && (!tdeiDatasetId || !selectedFile)) {
            setValidateErrorMessage("Tdei Dataset Id and File attachment are required for Quality Metric Tag Calculation job");
            setShowValidateToast(true);
            return;
        }
        if (jobType.value === "spatial-join" && (!spatialRequestBody || spatialRequestBody.trim() === "" || spatialRequestBody === JSON.stringify(SPATIAL_JOIN, null, 2))) {
            setValidateErrorMessage("A valid request body is required for the spatial join calculation job.");
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
                urlPath = "osw/confidence";
                break;
            case "quality-metric":
                urlPath = "osw/quality-metric";
                break;
            case "dataset-bbox":
                urlPath = "osw/dataset-bbox";
                break;
            case "dataset-tag-road":
                urlPath = "osw/dataset-tag-road";
                break;
            case "quality-metric-tag":
                urlPath = "osw/quality-metric/tag";
                break;
            case "spatial-join":
                urlPath = "osw/spatial-join";
                break;
        }

        const uploadData = [urlPath, selectedFile];
        if (jobType.value === "osw-convert") {
            uploadData.push(sourceFormat.value, targetFormat.value);
        } else if (jobType.value === "confidence" || jobType.value === "quality-metric-tag") {
            uploadData.push(tdeiDatasetId);
        } else if (jobType.value === "quality-metric") {
            uploadData.push(tdeiDatasetId, algorithmConfig);
        } else if (jobType.value === "dataset-bbox") {
            uploadData.push(tdeiDatasetId, fileType.value, bboxValues);
        } else if (jobType.value === "dataset-tag-road") {
            uploadData.push(sourceDatasetId, targetDatasetId);
        }else if (jobType.value === "spatial-join"){
            uploadData.push(spatialRequestBody);
        }

        setLoading(true);
        mutate(uploadData);
    };

    const renderField = (field, index) => {
        const isSpecialJobType = ["confidence", "quality-metric","quality-metric-tag"].includes(jobType?.value);
        const getDescriptionForField = (label) => {
            if (jobType.value === "dataset-bbox") {
                return getBBoxDescription(label);
            } else if (jobType.value === "dataset-tag-road") {
                return getDatasetTagInputDescription(label);
            } else if (jobType.value === "confidence") {
                return getConfidenceInputDescription(label);
            } else if (jobType.value === "quality-metric") {
                return getQualityMetricDescription(label);
            }else if (jobType.value === "quality-metric-tag"){
                return getQualityMetricTagDescription(label);
            }
            return "";
        };

        switch (field.type) {
            case "select":
                return (
                    <div key={index} className={style.formItem}>
                        <p className={style.formLabelP}>{field.label}<span style={{ color: 'red' }}> *</span></p>
                        <Select
                            options={field.options}
                            placeholder={`Select ${field.label.toLowerCase()}`}
                            onChange={(value) => {
                                if (field.stateSetter === "setSourceFormat") handleSourceFormatChange(value);
                                if (field.stateSetter === "setTargetFormat") setTargetFormat(value);
                                if (field.stateSetter === "setFileType") setFileType(value);
                            }}
                        />
                        <div className="d-flex align-items-start mt-2">
                            {/* {jobType !== null && jobType.value === "dataset-bbox" && (
                                <InfoIcon className="infoIconImg" />
                            )} */}
                            <Form.Text id="passwordHelpBlock" className={style.description}>
                                {getDescriptionForField(field.label)}
                            </Form.Text>
                        </div>
                    </div>
                );
            case "text":
                return (
                    <Form.Group key={index} controlId={field.label} className={style.formItem}>
                        <Form.Label>
                            {field.label}<span style={{ color: 'red' }}> *</span>
                        </Form.Label>
                        <Form.Control
                            placeholder={`Enter ${field.label}`}
                            type="text"
                            className={isSpecialJobType ? style.createJobSelectType : ''}
                            name={field.label}
                            onChange={(e) => {
                                if (field.stateSetter === "setTdeiDatasetId") setTdeiDatasetId(e.target.value);
                                if (field.stateSetter === "setSourceDatasetId") setSourceDatasetId(e.target.value);
                                if (field.stateSetter === "setTargetDatasetId") setTargetDatasetId(e.target.value);
                            }}
                            value={
                                field.stateSetter === "setTdeiDatasetId"
                                    ? tdeiDatasetId
                                    : field.stateSetter === "setSourceDatasetId"
                                        ? sourceDatasetId
                                        : field.stateSetter === "setTargetDatasetId"
                                            ? targetDatasetId
                                            : ""
                            }
                        />
                        <div className="d-flex align-items-start mt-2">
                            {/* <InfoIcon className="infoIconImg" /> */}
                            <Form.Text id="passwordHelpBlock" className={style.description}>
                                {getDescriptionForField(field.label)}
                            </Form.Text>
                        </div>
                    </Form.Group>
                );
            case "dropdown":
                return (
                    <div key={index} style={{ marginTop: '20px' }}>
                        <Form.Label>{field.label}<span style={{ color: 'red' }}> *</span></Form.Label>
                        <div className="jsonContent">
                        <QualityMetricAlgo onUpdate={handleAlgorithmUpdate} />
                        </div>
                    </div>
                );
                case "textarea":
                return (
                    <div key={index} style={{ marginTop: '20px' }}>
                        <Form.Label>{field.label}<span style={{ color: 'red' }}> *</span></Form.Label>
                        <div className="jsonContent">
                            <Form.Control
                                as="textarea"
                                type="text"
                                name={field.label}
                                onChange={(e) => {
                                    if (field.stateSetter === "setSpatialRequestBody") setSpatialRequestBody(e.target.value);
                                }}
                                value={spatialRequestBody}
                                rows={15}
                            />
                            <div className="d-flex align-items-start mt-2">
                                <div className="tdei-hint-text">
                                    (hint: check out the sample request{' '}
                                    <a href="#" onClick={handleShow} style={{ textDecoration: 'underline', cursor: 'pointer' }}>
                                        here
                                    </a>)
                                </div>
                        </div>
                        </div>
                    </div>
                );
                case "dropzone":
                    return (
                        <div key={index} className={style.formItems}>
                            <p className={style.formLabelP}>
                                {field.label}
                                <span style={{ color: jobType.value === "confidence" ? 'white' : 'red' }}> *</span>
                            </p>
                            <Dropzone
                                onDrop={onDrop}
                                accept={
                                    jobType.value === "quality-metric-tag"
                                        ? { 'application/json': ['.json'] }
                                        : jobType.value === "osw-convert" && (sourceFormat && sourceFormat.value === "osm")
                                            ? {
                                                'application/octet-stream': ['.pbf', '.osm'],
                                                'application/xml': ['.xml']
                                              }
                                            : jobType.value === "confidence"
                                                ? { 'application/geo+json': ['.geojson'] }
                                                : { 'application/zip': ['.zip'] }
                                }
                                format={
                                    jobType.value === "quality-metric-tag"
                                        ? ".json"
                                        : jobType.value === "osw-convert" && (sourceFormat && sourceFormat.value === "osm")
                                            ? ".pbf, .osm, .xml"
                                            : jobType.value === "confidence"
                                                ? ".geojson"
                                                : ".zip"
                                }
                                selectedFile={selectedFile}
                            />
                            <div className="d-flex align-items-start mt-2">
                                <Form.Text id="passwordHelpBlock" className={style.description}>
                                    {extractLinks(getDescriptionForField(field.label))}
                                </Form.Text>
                            </div>
                        </div>
                    );                
            case "bbox":
                return (
                    <div key={index} style={{ paddingTop: "25px" }}>
                        <p className={style.formLabelP}>{field.label}<span style={{ color: 'red' }}> *</span></p>
                        <div className={style.bBoxContainer}>
                            <Form.Group controlId="west" className={style.bboxFormGroup}>
                                <Form.Label className={style.bboxLabel}>West</Form.Label>
                                <Form.Control
                                    className={style.bboxForm}
                                    type="text"
                                    placeholder="Enter Coordinates"
                                    onChange={(e) => setBboxValues({ ...bboxValues, west: e.target.value })}
                                    value={bboxValues.west}
                                />
                            </Form.Group>
                            <Form.Group controlId="south" className={style.bboxFormGroup}>
                                <Form.Label className={style.bboxLabel}>South</Form.Label>
                                <Form.Control
                                    className={style.bboxForm}
                                    type="text"
                                    placeholder="Enter Coordinates"
                                    onChange={(e) => setBboxValues({ ...bboxValues, south: e.target.value })}
                                    value={bboxValues.south}
                                />
                            </Form.Group>
                            <Form.Group controlId="east" className={style.bboxFormGroup}>
                                <Form.Label className={style.bboxLabel}>East</Form.Label>
                                <Form.Control
                                    className={style.bboxForm}
                                    type="text"
                                    placeholder="Enter Coordinates"
                                    onChange={(e) => setBboxValues({ ...bboxValues, east: e.target.value })}
                                    value={bboxValues.east}
                                />
                            </Form.Group>
                            <Form.Group controlId="north" className={style.bboxFormGroup}>
                                <Form.Label className={style.bboxLabel}>North</Form.Label>
                                <Form.Control
                                    className={style.bboxForm}
                                    type="text"
                                    placeholder="Enter Coordinates"
                                    onChange={(e) => setBboxValues({ ...bboxValues, north: e.target.value })}
                                    value={bboxValues.north}
                                />
                            </Form.Group>

                        </div>
                        <div className="d-flex align-items-start mt-2">
                            {/* {jobType !== null && jobType.value === "dataset-bbox" && (
                                <InfoIcon className="infoIconImg" />
                            )} */}
                            <Form.Text id="passwordHelpBlock" className={style.description}>
                                {getDescriptionForField(field.label)}
                            </Form.Text>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };


    const renderFormFields = () => {
        if (!jobType) return null;

        const fields = formConfig[jobType.value];
        if (!fields) return null;

        if (jobType.value === "osw-convert" || jobType.value === "dataset-tag-road" || jobType.value === "dataset-bbox") {
            return (
                <div>
                    <div className={style.formRow}>
                        {fields.filter(field => field.type === "select" || field.type === "text").map(renderField)}
                    </div>
                    {fields.filter(field => field.type === "dropzone" || field.type === "bbox").map(renderField)}
                </div>
            );
        }

        return fields.map(renderField);
    };


    return (
        <div className={style.createJobLayout}>
            <div className={` ${jobType ? style.createJobContainer : style.createJobContainerWithJobType}`}>
                <>
                    <div className={style.createJobTitle}>Create New Job</div>
                    <div className={style.divider}></div>
                    <div className={`${jobType ? style.rectangleBox : style.fixedRectangleBox}`}>
                        <form className={style.form}>
                            <div className={style.formItems}>
                                <p className={style.formLabelP}>Job Type<span style={{ color: 'red' }}> *</span></p>
                                <Select
                                    className={style.createJobSelectType}
                                    options={jobTypeOptions}
                                    placeholder="Select a Job type"
                                    onChange={handleJobTypeSelect}
                                />
                                <div className="d-flex align-items-start mt-2">
                                {/* {jobType !== null && <InfoIcon className="infoIconImg" />} */}
                                    <div id="passwordHelpBlock" className={style.description}>
                                        {getDescription(jobType == null ? "" : jobType.value)}
                                    </div>
                                </div>
                            </div>
                            <div className={style.dottedLine}></div>
                            {jobType == null && (
                                <div className={style.noJobItems}>
                                    <img src={notSelectedIcon} className={style.selectIconsize} />
                                    <div className={style.selectItemText}>Please select the job type and the respective attributes will appear here.</div>
                                </div>
                            )}
                            {renderFormFields()}
                        </form>
                    </div>
                    <div className={`${jobType ? style.buttonContainer : style.fixedButtonContainer}`}>
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
                            message="Job Creation Failed!"
                            content={errorMessage}
                            handler={handleClose}
                            btnlabel="Dismiss"
                            modaltype="error"
                            title="Error"
                        />
                    )}
                    { showJsonSuccessModal &&(
                        <JobJsonResponseModal
                        show={showJsonSuccessModal}
                            message="Job has been completed!"
                            content={JSON.stringify(jobSuccessJson, null, 2) ?? ""}
                            handler={() => {
                                setShowJsonSuccessModal(false);
                                navigate('/jobs', { replace: true });
                            }}
                            btnlabel="Back to jobs page"
                            modaltype="success"
                            title="Success"
                        />
                    )}
                    <ToastMessage
                        showToast={showValidateToast}
                        toastMessage={validateErrorMessage}
                        onClose={handleCloseToast}
                        isSuccess={false}
                    />
                       { showModal &&(
                        <JobJsonResponseModal
                        show={showModal}
                            message=""
                            content={JSON.stringify(SAMPLE_SPATIAL_JOIN, null, 2) ?? ""}
                            handler={() => {
                                setShowModal(false);
                            }}
                            btnlabel="Cancel"
                            modaltype="regular"
                            title="Sample Spatial Join Request Body"
                        />
                    )}
                </>
            </div>
        </div>
    );
};

export default CreateJobService;