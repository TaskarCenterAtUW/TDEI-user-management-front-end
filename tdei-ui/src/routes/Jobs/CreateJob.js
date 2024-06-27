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
import { Spinner } from "react-bootstrap";
import CustomModal from "../../components/SuccessModal/CustomModal";
import ToastMessage from "../../components/ToastMessage/ToastMessage";

const CreateJobService = () => {
    const navigate = useNavigate();
    const [jobType, setJobType] = React.useState();
    const [selectedFile, setSelectedFile] = React.useState();
    const [loading, setLoading] = useState(false); // Track loading state
    const [showSuccessModal, setShowSuccessModal] = React.useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showToast, setToast] = useState(false);
    const [sourceFormat, setSourceFormat] = React.useState();
    const [targetFormat, setTargetFormat] = React.useState();
    const [showValidateToast, setShowValidateToast] = useState(false);
    const [validateErrorMessage, setValidateErrorMessage] = useState("");

    const jobTypeOptions = [
        { value: 'osw-validate', label: 'OSW - Validate' },
        { value: 'flex-validate', label: 'Flex - Validate' },
        { value: 'pathways-validate', label: 'Pathways - Validate' },
        { value: 'osw-convert', label: 'OSW - Convert' }
    ];
    const formatOptions = [
        { value: 'osw', label: 'OSW' },
        { value: 'osm', label: 'OSM' },
    ];

    const onSuccess = (data) => {
        setLoading(false);
        console.log("sucessfully created", data);
        // queryClient.invalidateQueries({ queryKey: [POST_DATASET] });
        setShowSuccessModal(true);
    };

    const onError = (err) => {
        setLoading(false);
        // resetting current step
        console.error("error message", err);
        setToast(true);
        setErrorMessage(err.data)
    };
    const { isLoading, mutate } = useCreateJob({ onSuccess, onError });
    const onStepsComplete = (uploadData) => {
        console.log(uploadData);
        setLoading(true)
        //mutate(uploadData);
    };

    function handleJobTypeSelect(type) {
        setJobType(type)
    }
    function handleSourceFormatSelect(type) {
        setSourceFormat(type)
    }
    function handleTargetFormatSelect(type) {
        setTargetFormat(type)
    }

    const handlePop = () => {
        navigate(-1);
    };

    const onDrop = (files) => {
        const selectedFile = files[0];
        setSelectedFile(selectedFile)
    };

    const handleClose = () => {
        setToast(false);
    };
    const handleCloseToast = () => {
        setShowValidateToast(false);
    }
    const handleCreate = () => {
        if (!jobType) {
            setValidateErrorMessage("Job type is required");
            setShowValidateToast(true);
            return;
        }
        if (!selectedFile) {
            setValidateErrorMessage("File is required");
            setShowValidateToast(true);
            return;
        }
        let urlPath = ""
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
        setLoading(true)
        mutate(uploadData);
    }

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
                                <Select className={style.createJobSelectType}
                                    options={jobTypeOptions}
                                    placeholder="Select a Job type"
                                    onChange={handleJobTypeSelect}
                                />
                            </div>
                            { jobType && jobType.value && jobType.value === "osw-convert" && (
                                <div>
                                    <div className={style.formItems}>
                                        <p>Source Format<span style={{ color: 'red' }}> *</span></p>
                                        <Select className={style.createJobSelectType}
                                            options={formatOptions}
                                            placeholder="Select source format"
                                            onChange={handleSourceFormatSelect}
                                        />
                                    </div>
                                    <div className={style.formItems}>
                                        <p>Target Format<span style={{ color: 'red' }}> *</span></p>
                                        <Select className={style.createJobSelectType}
                                            options={formatOptions}
                                            placeholder="Select target format"
                                            onChange={handleTargetFormatSelect}
                                        />
                                    </div>
                                </div>

                            )}
                            <div className={style.formItems}>
                                <p>Attach data file<span style={{ color: 'red' }}> *</span></p>
                                <Dropzone onDrop={onDrop} accept={{
                                    'application/zip': ['.zip']
                                }} format={".zip"} />
                            </div>
                        </form>
                    </div>
                    <div className={style.divider}></div>
                    <div className={style.buttonContainer}>
                        <Button className={style.buttonSecondaryCustomised}
                            onClick={handlePop}>Cancel</Button>
                        <Button className={`tdei-primary-button ${style.textUnset}`}
                            onClick={handleCreate}>Create</Button>
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
                     <ToastMessage showToast={showValidateToast} toastMessage={validateErrorMessage} onClose={handleCloseToast} isSuccess={false} />
                </>
            </div>
        </Layout>
    );
};

export default CreateJobService;
