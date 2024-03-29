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
import { useDispatch } from "react-redux";
import { useQueryClient } from "react-query";
import CustomSuccessModal from '../../components/SuccessModal/CustomSuccessModal';
import { Spinner } from "react-bootstrap";
import style from "./UploadDataset.module.css"
import ToastMessage from '../../components/ToastMessage/ToastMessage';

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
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showSuccessModal, setShowSuccessModal] = React.useState(false);
  const [loading, setLoading] = useState(false); // Track loading state
  const [errorMessage, setErrorMessage] = useState("");
  const [showToast, setToast] = useState(false);

  const onSuccess = (data) => {
    setLoading(false);
    console.log("sucessfully created", data);
    queryClient.invalidateQueries({ queryKey: [POST_DATASET] });
    setShowSuccessModal(true);
  };

  const handleClose = () => {
    setToast(false);
  };
  const onError = (err) => {
    setLoading(false);
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

  return (
    <Layout>
      <Container className="d-flex align-items-center mt-2">
        <div className="page-header-title">Upload Dataset</div>
        <VerticalStepper stepsData={stepsData} onStepsComplete={onStepsComplete} />
        {showSuccessModal && (
          <CustomSuccessModal
            show={showSuccessModal}
            message="Dataset upload job has been accepted!"
            content="You can proceed once the job is completed, please find the status in Datasets page."
            onClick={() => {
              setShowSuccessModal(false);
              // TODO: navigation to be changed when datasets list UI is available.
              navigate('../', { replace: true });
            }}
            btnlabel="Go to My Datasets"
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
        <ToastMessage showToast={showToast} toastMessage={errorMessage} onClose={handleClose} isSuccess={false} />
      </Container>
    </Layout>
  );
};

export default UploadDataset;