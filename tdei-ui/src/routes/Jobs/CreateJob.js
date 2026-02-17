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
import notSelectedIcon from "../../assets/img/notSelectedIcon.png";
import InfoIcon from '@mui/icons-material/Info';
import { extractLinks } from "../../utils";
import QualityMetricAlgo from "./QualityMetricAlgo";
import JobJsonResponseModal from "../../components/JobJsonResponseModal/JobJsonResponseModal";
import { SPATIAL_JOIN, SAMPLE_SPATIAL_JOIN } from "../../utils";
import useIsDatasetsAccessible from "../../hooks/useIsDatasetsAccessible";
import { useAuth } from "../../hooks/useAuth";

// Options for the Job Type dropdown
const jobTypeOptions = [
    { value: 'osw-validate', label: 'OSW - Validate' },
    { value: 'flex-validate', label: 'Flex - Validate' },
    { value: 'pathways-validate', label: 'Pathways - Validate' },
    { value: 'osw-convert', label: 'OSW - Convert' },
    { value: 'confidence', label: 'Confidence Calculation' },
    { value: 'quality-metric', label: 'Quality Metric IXN Calculation' },
    { value: 'dataset-bbox', label: 'Filter Dataset By BBox' },
    { value: 'dataset-tag-road', label: 'Dataset Tag Road' },
    { value: 'quality-metric-tag', label: 'Quality Metric Tag' },
    { value: 'spatial-join', label: 'Spatial Join' },
    { value: 'dataset-union', label: 'Dataset Union' },
];

// Options for the Format dropdown (e.g., OSW, OSM)
const formatOptions = [
    { value: 'osw', label: 'OSW' },
    { value: 'osm', label: 'OSM' }
];

// Configuration object defining form fields for each job type
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
        { label: "Attach GeoJson file", type: "dropzone" }
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
    "spatial-join": [
        { label: "Spatial join operation request body", type: "textarea", stateSetter: "setSpatialRequestBody" }
    ],
    "dataset-union": [
        { label: "First Dataset Id", type: "text", stateSetter: "setDatasetIdOne" },
        { label: "Second Dataset Id", type: "text", stateSetter: "setDatasetIdTwo" },
        { label: "Proximity", type: "text", stateSetter: "setProximity" }
    ],
};

/**
 * This component provides a form for creating various types of jobs.
 * It dynamically renders form fields based on the selected job type.
 */
const CreateJobService = () => {
    const baseBody = document.querySelector('body');
    const navigate = useNavigate();
    const { user } = useAuth();
    const isDataAccessible = useIsDatasetsAccessible();
    // State variables to manage form inputs and UI states
    const [jobType, setJobType] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showToast, setToast] = useState(false);
    const [sourceFormat, setSourceFormat] = useState(null);
    const [targetFormat, setTargetFormat] = useState(null);
    const [showValidateToast, setShowValidateToast] = useState(false);
    const [validateErrorMessage, setValidateErrorMessage] = useState("");
    const [tdeiDatasetId, setTdeiDatasetId] = useState("");
    const [sourceDatasetId, setSourceDatasetId] = useState("");
    const [targetDatasetId, setTargetDatasetId] = useState("");
    const [showJsonSuccessModal, setShowJsonSuccessModal] = useState(false);
    const [jobSuccessJson, setJobSuccessJson] = useState("");
    const [bboxValues, setBboxValues] = useState({
        west: "",
        south: "",
        east: "",
        north: ""
    });
    const [fileType, setFileType] = useState(null);
    const [algorithmConfig, setAlgorithmConfig] = useState(null);
    const [spatialRequestBody, setSpatialRequestBody] = useState(JSON.stringify(SPATIAL_JOIN, null, 2));
    const [showModal, setShowModal] = useState(false);
    const [firstDatasetId, setFirstDatasetId] = useState("");
    const [secondDatasetId, setSecondDatasetId] = useState("");
    const [proximity, setProximity] = useState("");
    const [spatialAssignmentMethod, setSpatialAssignmentMethod] = useState({ value: 'default', label: 'Default' });

    const spatialAssignmentOptions = [
        { value: 'default', label: 'Default' },
        { value: 'exclusive', label: 'Exclusive' },
        { value: 'shared', label: 'Shared' }
    ];

    const spatialSampleJson = React.useMemo(() => {
        const sample = { ...SAMPLE_SPATIAL_JOIN };
        if (spatialAssignmentMethod.value === 'exclusive' || spatialAssignmentMethod.value === 'shared') {
            sample.assignment_method = spatialAssignmentMethod.value;
        }
        return JSON.stringify(sample, null, 2);
    }, [spatialAssignmentMethod]);

    const filteredJobTypeOptions = jobTypeOptions.filter(option =>
        !(option.value === "dataset-tag-road" && (!isDataAccessible && !user?.isAdmin))
    );

    // Callback function invoked when a job creation API call is successful.
    const onSuccess = (data) => {
        setLoading(false);
        if (Array.isArray(data)) {
            // If the response is an array, show the JSON success modal
            setShowJsonSuccessModal(true);
            setJobSuccessJson(data);
        } else {
            // Otherwise, show a standard success modal
            setShowSuccessModal(true);
        }
    };

    // Callback function invoked when a job creation API call fails.
    const onError = (err) => {
        setLoading(false);
        console.error("error message", err);
        // Extract a meaningful error message
        const error = err.data ?? err.message ?? err ?? "An unexpected error occurred";
        setErrorMessage(error);
        setToast(true); // Show error toast
    };

    // whenever `sourceFormat` changes, update `targetFormat` if only one choice remains
    const targetFormatOptions = sourceFormat
        ? formatOptions.filter(o => o.value !== sourceFormat.value)
        : formatOptions;

    React.useEffect(() => {
        if (targetFormatOptions.length === 1) {
            setTargetFormat(targetFormatOptions[0]);
        }
    }, [targetFormatOptions]);

    // Custom hook to handle job creation via API
    const { isLoading, mutate } = useCreateJob({ onSuccess, onError });

    /**
     * Handles the selection of a job type from the dropdown.
     * Resets all dependent states to their initial values.
     */
    function handleJobTypeSelect(type) {
        setJobType(type);
        // Reset dependent states
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

    /**
     * Handles changes to the source format dropdown in the OSW-Convert job type.
     * Resets the selected file when the source format changes.
     */
    const handleSourceFormatChange = (value) => {
        setSourceFormat(value);
        setSelectedFile(null);
    };

    // Navigates back to the previous page in the browser history.
    const handlePop = () => {
        navigate(-1);
    };

    /**
     * Handles the file drop event from the Dropzone component.
     * Sets the selected file in the state.
     */
    const onDrop = (files) => {
        const selectedFile = files[0];
        setSelectedFile(selectedFile);
    };

    //Closes the toast message by setting its visibility to false.
    const handleClose = () => {
        setToast(false);
    };

    //Closes the sample spatial join request modal.
    const handleModalClose = () => setShowModal(false);

    //Opens the sample spatial join request modal.
    const handleShow = () => {
        setShowModal(true);
    };

    //Closes the validation error toast message.
    const handleCloseToast = () => {
        setShowValidateToast(false);
    };

    // Maps a job type to its corresponding API endpoint path.
    const getPathFromJobType = (jobType) => {
        const jobTypePathMap = {
            "osw-validate": "/api/v1/osw/validate",
            "flex-validate": "/api/v1/gtfs-flex/validate",
            "pathways-validate": "/api/v1/gtfs-pathways/validate",
            "osw-convert": "/api/v1/osw/convert",
            "confidence": "/api/v1/osw/confidence/{tdei_dataset_id}",
            "quality-metric": "/api/v1/osw/quality-metric/ixn/{tdei_dataset_id}",
            "dataset-bbox": "/api/v1/osw/dataset-bbox",
            "dataset-tag-road": "/api/v1/osw/dataset-tag-road",
            "quality-metric-tag": "/api/v1/osw/quality-metric/tag/{tdei_dataset_id}",
            "spatial-join": "/api/v1/osw/spatial-join",
            "dataset-union": "/api/v1/osw/union",
        };

        return jobTypePathMap[jobType] || "";
    };

    // Retrieves the description for a given job type from the API specification.
    const getDescription = (jobType) => {
        const path = getPathFromJobType(jobType);
        return apiSpec.paths[path]?.post?.description || "";
    };

    // Retrieves descriptions for bounding box related fields based on the label.
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

    // Retrieves descriptions for dataset tag road related fields based on the label.
    const getDatasetTagInputDescription = (label) => {
        const path = getPathFromJobType("dataset-tag-road");
        if (label === "Source Dataset Id") {
            return apiSpec.paths[path]?.post?.parameters?.find(param => param.name === "source_dataset_id")?.description || "";
        } else {
            return apiSpec.paths[path]?.post?.parameters?.find(param => param.name === "target_dataset_id")?.description || "";
        }
    };

    // Retrieves descriptions for confidence calculation related fields based on the label.
    const getConfidenceInputDescription = (label) => {
        const path = getPathFromJobType("confidence");
        if (label === "Tdei Dataset Id") {
            return apiSpec.paths[path]?.post?.parameters?.find(param => param.name === "tdei_dataset_id")?.description || "";
        } else {
            return apiSpec.paths[path]?.post?.requestBody?.content["multipart/form-data"]?.schema?.properties?.file?.description || "";
        }
    };

    // Retrieves descriptions for quality metric calculation related fields based on the label.
    const getQualityMetricDescription = (label) => {
        const path = getPathFromJobType("quality-metric");
        if (label === "Tdei Dataset Id") {
            return apiSpec.paths[path]?.post?.parameters?.find(param => param.name === "tdei_dataset_id")?.description || "";
        } else if (label === "Attach GeoJson file") {
            return apiSpec.paths[path]?.post?.requestBody?.content["multipart/form-data"]?.schema?.properties?.file?.description || "";
        } else {
            return apiSpec.paths[path]?.post?.requestBody?.content["multipart/form-data"]?.schema?.properties?.algorithm?.description || "";
        }
    };

    // Retrieves descriptions for quality metric tag calculation related fields based on the label.
    const getQualityMetricTagDescription = (label) => {
        const path = getPathFromJobType("quality-metric-tag");
        if (label === "Tdei Dataset Id") {
            return apiSpec.paths[path]?.post?.parameters?.find(param => param.name === "tdei_dataset_id")?.description || "";
        } else {
            return apiSpec.paths[path]?.post?.requestBody?.content["multipart/form-data"]?.schema?.properties?.file?.description || "";
        }
    };
    const getUnionDescription = (label) => {
        const path = getPathFromJobType("dataset-union");
        if (label === "First Dataset Id") {
            return apiSpec.paths[path]?.post?.requestBody?.content["application/json"]?.schema?.properties?.tdei_dataset_id_one?.description || "";
        } else if (label === "Second Dataset Id") {
            return apiSpec.paths[path]?.post?.requestBody?.content["application/json"]?.schema?.properties?.tdei_dataset_id_two?.description || "";
        } else {
            return apiSpec.paths[path]?.post?.requestBody?.content["application/json"]?.schema?.properties?.proximity?.description || "";
        }
    };

    /**
     * Validates the form inputs and triggers the job creation process.
     * Constructs the API endpoint and payload based on the selected job type and inputs.
     */
    const handleCreate = () => {
        // Validate required fields based on job type
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

        if (jobType.value === "quality-metric" && (!tdeiDatasetId || !algorithmConfig)) {
            setValidateErrorMessage("Tdei Dataset Id and Algorithm fields are required for Quality Metric Calculation job");
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
        if (jobType.value === "dataset-union" && (!firstDatasetId || !secondDatasetId)) {
            setValidateErrorMessage("First and Second Dataset Ids are required for Job Union");
            setShowValidateToast(true);
            return;
        }

        // Determine the API path based on the job type
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
                urlPath = "osw/quality-metric/ixn";
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
            case "dataset-union":
                urlPath = "osw/union";
                break;
            default:
                break;
        }

        // Construct the payload for the API call based on job type
        const uploadData = [urlPath, selectedFile];
        if (jobType.value === "osw-convert") {
            uploadData.push(sourceFormat.value, targetFormat.value);
        } else if (["confidence", "quality-metric-tag"].includes(jobType.value)) {
            uploadData.push(tdeiDatasetId);
        } else if (jobType.value === "quality-metric") {
            uploadData.push(tdeiDatasetId);
        } else if (jobType.value === "dataset-bbox") {
            uploadData.push(tdeiDatasetId, fileType.value, bboxValues);
        } else if (jobType.value === "dataset-tag-road") {
            uploadData.push(sourceDatasetId, targetDatasetId);
        } else if (jobType.value === "spatial-join") {
            try {
                JSON.parse(spatialRequestBody);
            } catch (e) {
                setValidateErrorMessage("Invalid JSON format in spatial request body. Please check the syntax.");
                setShowValidateToast(true);
                return;
            }
            uploadData.push(spatialRequestBody);
        } if (jobType.value === "dataset-union") {
            if (proximity) {
                const proximityFloat = parseFloat(proximity);
                if (!isNaN(proximityFloat)) {
                    uploadData.push(firstDatasetId, secondDatasetId, proximityFloat);
                } else {
                    uploadData.push(firstDatasetId, secondDatasetId);
                }
            } else {
                uploadData.push(firstDatasetId, secondDatasetId);
            }
        }
        setLoading(true);
        mutate(uploadData);
    };

    /**
     * Renders a form field based on its type and configuration.
     * Supports various field types such as select, text, dropzone, textarea, and bounding box.
  */
    const renderField = (field, index) => {
        // Determine if the current job type is a special one requiring additional styling
        const isSpecialJobType = ["confidence", "quality-metric", "quality-metric-tag"].includes(jobType?.value);

        // Retrieves the description text for a given field label based on the job type.
        const getDescriptionForField = (label) => {
            switch (jobType.value) {
                case "dataset-bbox":
                    return getBBoxDescription(label);
                case "dataset-tag-road":
                    return getDatasetTagInputDescription(label);
                case "confidence":
                    return getConfidenceInputDescription(label);
                case "quality-metric":
                    return getQualityMetricDescription(label);
                case "quality-metric-tag":
                    return getQualityMetricTagDescription(label);
                case "dataset-union":
                    return getUnionDescription(label);
                default:
                    return "";
            }
        };

        // Updates the corresponding state based on the field's stateSetter property.
        const handleInputChange = (e) => {
            const value = e.target.value;
            switch (field.stateSetter) {
                case "setTdeiDatasetId":
                    setTdeiDatasetId(value);
                    break;
                case "setSourceDatasetId":
                    setSourceDatasetId(value);
                    break;
                case "setTargetDatasetId":
                    setTargetDatasetId(value);
                    break;
                case "setDatasetIdOne":
                    setFirstDatasetId(value);
                    break;
                case "setDatasetIdTwo":
                    setSecondDatasetId(value);
                    break;
                case "setProximity":
                    setProximity(value);
                    break;
                default:
                    break;
            }
        };
        // Renders a text input field with appropriate state management.
        const renderTextField = () => {
            // Map state setters to their corresponding state values for easier access
            const stateValues = {
                setTdeiDatasetId: tdeiDatasetId,
                setSourceDatasetId: sourceDatasetId,
                setTargetDatasetId: targetDatasetId,
                setDatasetIdOne: firstDatasetId,
                setDatasetIdTwo: secondDatasetId,
                setProximity: proximity
            };

            return (
                <Form.Group key={index} controlId={field.label} className={style.formItem}>
                    <Form.Label>
                        {field.label}
                        {!(jobType?.value === "dataset-union" && field.label === "Proximity") && (
                            <span style={{ color: 'red' }}> *</span>
                        )}
                    </Form.Label>
                    <Form.Control
                        placeholder={`Enter ${field.label}`}
                        type="text"
                        className={isSpecialJobType ? style.createJobSelectType : ''}
                        name={field.label}
                        onChange={handleInputChange}
                        value={stateValues[field.stateSetter] || ""}
                    />
                    <div className="d-flex align-items-start mt-2">
                        <Form.Text id="passwordHelpBlock" className={style.description}>
                            {getDescriptionForField(field.label)}
                        </Form.Text>
                    </div>
                </Form.Group>
            );
        };

        // Renders a select dropdown field with appropriate options and state management.
        const renderSelectField = () => (
            <div key={index} className={style.formItem}>
                <label htmlFor={`${field.stateSetter}-selectInput`} className={style.formLabelP}>{field.label}<span style={{ color: 'red' }}> *</span></label>
                <Select
                    inputId={`${field.stateSetter}-selectInput`}
                    isSearchable={false}
                    className={style.selectFieldCommon}
                    value={
                        field.stateSetter === "setSourceFormat"
                            ? sourceFormat
                            : field.stateSetter === "setTargetFormat"
                                ? targetFormat
                                : fileType
                    }
                    options={
                        field.stateSetter === "setTargetFormat"
                            ? targetFormatOptions
                            : field.options
                    }
                    placeholder={`Select ${field.label.toLowerCase()}`}
                    onChange={(value) => {
                        if (field.stateSetter === "setSourceFormat") handleSourceFormatChange(value);
                        if (field.stateSetter === "setTargetFormat") setTargetFormat(value);
                        if (field.stateSetter === "setFileType") setFileType(value);
                    }}
                />
                <div className="d-flex align-items-start mt-2">
                    <Form.Text id="passwordHelpBlock" className={style.description}>
                        {getDescriptionForField(field.label)}
                    </Form.Text>
                </div>
            </div>
        );
        // Renders a Dropzone component for file uploads with appropriate accepted file types and state management.
        const renderDropzoneField = () => (
            <div key={index} className={style.formItems}>
                <p className={style.formLabelP}>
                    {field.label}
                    <span style={{ color: jobType.value === "confidence" || jobType.value === "quality-metric" ? 'white' : 'red' }}> *</span>
                </p>
                <Dropzone
                    onDrop={onDrop}
                    accept={getAcceptedFileTypes()}
                    format={getFileFormat()}
                    selectedFile={selectedFile}
                />
                <div className="d-flex align-items-start mt-2">
                    <Form.Text id="passwordHelpBlock" className={style.description}>
                        {extractLinks(getDescriptionForField(field.label))}
                    </Form.Text>
                </div>
            </div>
        );


        // Determines the accepted file types based on the selected job type and source format.
        const getAcceptedFileTypes = () => {
            switch (jobType.value) {
                case "quality-metric-tag":
                    return { 'application/json': ['.json'] };
                case "osw-convert":
                    if (sourceFormat && sourceFormat.value === "osm") {
                        return {
                            'application/octet-stream': ['.pbf', '.osm'],
                            'application/xml': ['.xml']
                        };
                    } else if (!sourceFormat) {
                        return "";
                    }
                    return { 'application/zip': ['.zip'] };
                case "confidence":
                case "quality-metric":
                    return { 'application/geo+json': ['.geojson'] };
                default:
                    return { 'application/zip': ['.zip'] };
            }
        };


        // Determines the file format string based on the selected job type and source format.
        const getFileFormat = () => {
            switch (jobType.value) {
                case "quality-metric-tag":
                    return ".json";
                case "osw-convert":
                    if (sourceFormat && sourceFormat.value === "osm") {
                        return ".pbf, .osm, .xml";
                    } else if (!sourceFormat) {
                        return "-";
                    }
                    return ".zip";
                case "confidence":
                case "quality-metric":
                    return ".geojson";
                default:
                    return ".zip";
            }
        };

        // Renders the bounding box input fields (West, South, East, North) with state management.
        const renderBBoxField = (index, field) => (
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
                    <Form.Text id="passwordHelpBlock" className={style.description}>
                        {getDescriptionForField(field.label)}
                    </Form.Text>
                </div>
            </div>
        );

        // Render the appropriate form field based on its type
        switch (field.type) {
            case "select":
                return renderSelectField();
            case "text":
                return renderTextField();
            case "dropzone":
                return renderDropzoneField();
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
            case "bbox":
                return renderBBoxField(index, field);
            default:
                return null;
        }
    };

    /**
     * Renders all the form fields based on the selected job type and its configuration.
     * Handles specific layout arrangements for certain job types.
     */
    const renderFormFields = () => {
        if (!jobType) return null;
        const fields = formConfig[jobType.value];
        if (!fields) return null;

        // Specific layout handling for certain job types
        if (["osw-convert", "dataset-tag-road", "dataset-bbox", "dataset-union"].includes(jobType.value)) {
            return (
                <div>
                    <div className={style.formRow}>
                        {/* Render select and text fields in a row */}
                        {fields.filter(field => field.type === "select" || field.type === "text").map(renderField)}
                    </div>
                    {/* Render dropzone and bounding box fields below */}
                    {fields.filter(field => field.type === "dropzone" || field.type === "bbox").map(renderField)}
                </div>
            );
        }

        // Default rendering for other job types
        return fields.map(renderField);
    };


    return (
        <div className={style.createJobLayout}>
            <div className={` ${jobType ? style.createJobContainer : style.createJobContainerWithJobType}`}>
                <>
                    <h1 className={style.createJobTitle}>Create New Job</h1>
                    <div className={style.divider}></div>
                    <div className={`${jobType ? style.rectangleBox : style.fixedRectangleBox}`}>
                        <form className={style.form}>
                            <div className={style.formItems}>
                                <label htmlFor="selectJobType" className={style.formLabelP}>Job Type<span style={{ color: 'red' }}> *</span></label>
                                <Select
                                    inputId="selectJobType"
                                    isSearchable={false}
                                    className={style.createJobSelectType}
                                    options={filteredJobTypeOptions}
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
                                    <img src={notSelectedIcon} className={style.selectIconsize} alt="" />
                                    <div className={style.selectItemText}>Please select the job type and the respective attributes will appear here.</div>
                                </div>
                            )}
                            {renderFormFields()}
                        </form>
                    </div>
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
                            message="Job Creation Failed!"
                            content={errorMessage}
                            handler={handleClose}
                            btnlabel="Dismiss"
                            modaltype="error"
                            title="Error"
                        />
                    )}
                    {showJsonSuccessModal && (
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
                    {showModal && (
                        <JobJsonResponseModal
                            show={showModal}
                            message=""
                            content={spatialSampleJson ?? ""}
                            handler={() => {
                                setShowModal(false);
                            }}
                            btnlabel="Cancel"
                            modaltype="regular"
                            title="Sample Spatial Join Request Body"
                            controlLabel="Assignment Method"
                            customControl={
                                <div style={{ width: '200px' }}>
                                    <Select
                                        options={spatialAssignmentOptions}
                                        value={spatialAssignmentMethod}
                                        onChange={setSpatialAssignmentMethod}
                                        placeholder="Assignment Method"
                                        menuPortalTarget={baseBody}
                                        styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                    />
                                </div>
                            }
                        />
                    )}
                </>
            </div>
        </div>
    );
};

export default CreateJobService;
