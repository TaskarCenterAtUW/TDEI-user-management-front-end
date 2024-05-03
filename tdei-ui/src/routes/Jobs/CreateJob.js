import React, {useState} from "react";
import Container from "../../components/Container/Container";
import Layout from "../../components/Layout";
import style from "./Jobs.module.css";
import Select from "react-select";
import Dropzone from "../../components/DropZone/Dropzone";
import {Button} from "@mui/material";
import {useNavigate} from "react-router-dom";
import useCreateJob from "../../hooks/jobs/useCreateJob";
import {POST_DATASET} from "../../utils";
import {Spinner} from "react-bootstrap";
import CustomModal from "../../components/SuccessModal/CustomModal";

const CreateJobService = () => {
    const navigate = useNavigate();
    const [jobType, setJobType] = React.useState();
    const [selectedFile, setSelectedFile] = React.useState();
    const [loading, setLoading] = useState(false); // Track loading state
    const [showSuccessModal, setShowSuccessModal] = React.useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showToast, setToast] = useState(false);

    const jobTypeOptions = [
        {value: 'osw-validate', label: 'OSW - Validate'},
        {value: 'flex-validate', label: 'Flex - Validate'},
        {value: 'pathways-validate', label: 'Pathways - Validate'},
        {value: 'osw-convert', label: 'OSW - Convert'}
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

    const handleCreate = () => {
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
        const  uploadData = []
        uploadData[0] = urlPath
        uploadData[1] = selectedFile
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
                                <p>Job Type</p>
                                <Select className={style.createJobSelectType}
                                    options={jobTypeOptions}
                                    placeholder="Select a Job type"
                                    onChange={handleJobTypeSelect}
                                />
                            </div>

                            <div className={style.formItems}>
                                <p>Attach data file</p>
                                <Dropzone onDrop={onDrop} accept={{
                                    'application/zip': ['.zip']
                                }} format={".zip"}/>
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
                            modaltype = {"success"}
                            title= "Success"
                        />
                    )}
                    {showToast && (
                        <CustomModal
                            show={showToast}
                            message="Dataset Upload Failed!"
                            content={errorMessage}
                            handler={handleClose}
                            btnlabel="Dismiss"
                            modaltype = {"error"}
                            title= "Error"
                        />
                    )}
                </>
            </div>
        </Layout>
    );
};

export default CreateJobService;
