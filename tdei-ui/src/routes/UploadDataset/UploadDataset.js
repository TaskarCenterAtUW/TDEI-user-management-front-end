import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import Container from "../../components/Container/Container";
import VerticalStepper from "../../components/VerticalStepper/VerticalStepper";
import ServiceUpload from './ServiceUpload';
import Metadata from './Metadata';
import DataFile from './DataFile';
import Changeset from './Changeset';
import useUploadDataset from "../../hooks/useUploadDataset";
import { useNavigate } from 'react-router-dom';
import { POST_DATASET } from "../../utils/react-query-constant";
import { useQueryClient } from "react-query";
import CustomModal from '../../components/SuccessModal/CustomModal';
import { Spinner } from "react-bootstrap";
import style from "./UploadDataset.module.css"
import { useAuth } from '../../hooks/useAuth';
import useIsDatasetsAccessible from '../../hooks/useIsDatasetsAccessible';

// Array of steps data for the vertical stepper
const stepsData = [
  {
    title: 'Service',
    subtitle: 'Select the service',
    component: ServiceUpload,
  },
  {
    title: 'Data File',
    subtitle: 'Attach data file (.zip)',
    component: DataFile,
  },
  {
    title: 'Metadata File',
    subtitle: 'Attach metadata file (.json)',
    component: Metadata,
  },
  {
    title: 'Changeset',
    subtitle: 'Attach changeset file (.txt)',
    component: Changeset,
  },
];
// Functional component UploadDataset
const UploadDataset = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [showSuccessModal, setShowSuccessModal] = React.useState(false);
  const [loading, setLoading] = useState(false); // Track loading state
  const [errorMessage, setErrorMessage] = useState("");
  const [showToast, setToast] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const { user } = useAuth();
  const isDataGenerator = useIsDatasetsAccessible();

  const onSuccess = (data) => {
    setLoading(false);
    console.log("sucessfully created", data);
    queryClient.invalidateQueries({ queryKey: [POST_DATASET] });
    setShowSuccessModal(true);
  };

  const handleClose = () => {
    setToast(false);
    setCurrentStep(2); // reverting to metadata step.
    console.log(currentStep)
  };
  const onError = (err) => {
    setLoading(false);
    // resetting current step
    setCurrentStep(0);
    console.error("error message", err);
    setToast(true);
    setErrorMessage(err.data)
  };
  // Using useUploadDataset hook to get mutate function
  const { isLoading, mutate } = useUploadDataset({ onSuccess, onError });
  const onStepsComplete = (uploadData) => {
    console.log(uploadData);
    mutate(uploadData);
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
  return (
    <div className={style.layout}>
      <Container className="d-flex align-items-center mt-2">
        <div className="page-header-title">Upload Dataset</div>
        <VerticalStepper 
        stepsData={stepsData} 
        onStepsComplete={onStepsComplete} 
        currentStep={currentStep}
        />
        {showSuccessModal && (
          <CustomModal
            show={showSuccessModal}
            message="Dataset upload job has been accepted!"
            content="Find the status of the job in jobs page."
            onClick={() => {
              setShowSuccessModal(false);
              navigate('../jobs', { replace: true });
            }}
            btnlabel="Go to Jobs page"
            isSuccess = {true}
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
            message="Dataset Upload Failed!"
            content={errorMessage}
            onClick={() => {
              handleClose()            
            }}
            btnlabel="Dismiss"
            isSuccess = {false}
          />
        )}
      </Container>
      </div>
  );
};

export default UploadDataset;