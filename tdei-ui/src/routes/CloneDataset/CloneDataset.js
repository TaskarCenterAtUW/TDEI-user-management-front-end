import React, { useState, useEffect } from 'react';
import Container from "../../components/Container/Container";
import ServiceUpload from '../UploadDataset/ServiceUpload';
import Metadata from '../UploadDataset/Metadata';
import Changeset from '../UploadDataset/Changeset';
import useUploadDataset from "../../hooks/useUploadDataset";
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { GET_DATASETS } from '../../utils';
import { useQueryClient } from "react-query";
import CustomModal from '../../components/SuccessModal/CustomModal';
import { Spinner } from "react-bootstrap";
import style from "../../routes/UploadDataset/UploadDataset.module.css";
import { useAuth } from '../../hooks/useAuth';
import useIsDatasetsAccessible from '../../hooks/useIsDatasetsAccessible';
import CloneDatasetStepper from './CloneDatasetStepper';
// import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import cloneFileImage from "../../assets/img/clone-file-img.svg";
import useCloneDataset from '../../hooks/datasets/useCloneDataset';


// Array of steps data for the vertical stepper
const stepsData = [
    {
        title: 'Service',
        subtitle: 'Select the service',
        component: ServiceUpload,
    },
    {
        title: 'Metadata File',
        subtitle: 'Attach metadata file (.json)',
        component: Metadata,
    }
];

// Functional component CloneDataset
const CloneDataset = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const location = useLocation();
    const [showSuccessModal, setShowSuccessModal] = React.useState(false);
    const [loading, setLoading] = useState(false); // Track loading state
    const [errorMessage, setErrorMessage] = useState("");
    const [showToast, setToast] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const { user } = useAuth();
    const isDataGenerator = useIsDatasetsAccessible();
    const dataset = location.state?.dataset;

    const onSuccess = (data) => {
        setLoading(false);
        queryClient.invalidateQueries({ queryKey: [GET_DATASETS] });
        setShowSuccessModal(true);
    };

    const handleClose = () => {
        setToast(false);
        setCurrentStep(1); // reverting to metadata step.
    };
    const onError = (err) => {
        setLoading(false);
        // resetting current step
        setCurrentStep(0);
        console.error("error message", err);
        setToast(true);
        setErrorMessage(err.response ? err.response.data :  err.data ?? err.message ?? err)
    };

    // Using useUploadDataset hook to get mutate function
    const { isLoading, mutate } = useCloneDataset({ onSuccess, onError });
    const onStepsComplete = (cloneDataset) => {
        const dataToMutate = { tdei_dataset_id: dataset.tdei_dataset_id, selectedData: cloneDataset };
        mutate(dataToMutate);
        setLoading(true)
    };

    // Check if the user is not an admin, not a flex data generator, not a PoC
    if (!(user.isAdmin || isDataGenerator)) {
        return (
            <div className="p-4">
                <div className="alert alert-warning" role="alert">
                    Oops! User doesn't have permission to access this page!
                </div>
            </div>
        );
    }
    if (!dataset) {
        return <Navigate to="/datasets" replace />;
    }

    return (
        <div className={style.layout}>
            <Container>
                <div className={style.uploadWidgetTitle}>
                    <span className={style.cloneDatasetTitle}>Clone Dataset</span>
                    <span className={style.content}>
                        <img src={cloneFileImage} className={style.icon} alt="" />
                        <span>Data file cloning from <span className={style.description}>{dataset && dataset.metadata.dataset_detail.name}</span></span>
                    </span>
                </div>
                <CloneDatasetStepper
                    stepsData={stepsData}
                    onStepsComplete={onStepsComplete}
                    currentStep={currentStep}
                    dataset={dataset}
                />
                {showSuccessModal && (
                    <CustomModal
                        show={showSuccessModal}
                        message="Dataset clone has been accepted!"
                        content="Find cloned dataset in datasets page."
                        handler={() => {
                            setShowSuccessModal(false);
                            navigate('../datasets', { replace: true });
                        }}
                        btnlabel="Go to datasets page"
                        modaltype="success"
                        title="Success"
                    />
                )}
                {loading && (
                    <div className={style.loaderOverlay}>
                        <div className={style.spinnerContainer}>
                            <Spinner animation="border" role="status" color='white'>
                            </Spinner>
                        </div>
                    </div>
                )}
                {showToast && (
                    <CustomModal
                        show={showToast}
                        message="Dataset Clone Failed!"
                        content={errorMessage}
                        handler={() => {
                            handleClose()
                        }}
                        btnlabel="Dismiss"
                        modaltype="error"
                        title="Error"
                    />
                )}
            </Container>
        </div>
    );
};

export default CloneDataset;
