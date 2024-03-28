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
import { ToastContainer, toast } from 'react-toastify';
import CustomSuccessModal from '../../components/SuccessModal/CustomSuccessModal';

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
  const [isLoadingKey, setIsLoadingKey] = React.useState(0); // Key to force re-render of VerticalStepper
  const [showSuccessModal, setShowSuccessModal] = React.useState(false);
    // Function to display toast message
  const showToastMessage = (error) => {
      toast.error(error, {
        position: "top-center"
      });
  };
  const onSuccess = (data) => {
    console.log("sucessfully created", data);
    queryClient.invalidateQueries({ queryKey: [POST_DATASET] });
    setShowSuccessModal(true);
  };
  const onError = (err) => {
    console.error("error message", err);
    dispatch(
    showToastMessage(err.data));
  };
   // Using useUploadDataset hook to get mutate function
   const { isLoading, mutate } = useUploadDataset({ onSuccess, onError });
  const onStepsComplete = (uploadData) => {
    console.log(uploadData);
    mutate(uploadData);
  };
  // Update isLoadingKey whenever isLoading changes
  useEffect(() => {
    setIsLoadingKey(prevKey => prevKey + 1);
  }, [isLoading]);
  return (
    <Layout>
      <Container className="d-flex align-items-center mt-2">
      <div className="page-header-title">Upload Dataset</div>
      <VerticalStepper stepsData={stepsData} onStepsComplete={onStepsComplete} isLoading={isLoading}/>
      <ToastContainer />
      {showSuccessModal && (
          <CustomSuccessModal
            show={showSuccessModal}
            message="Dataset upload job has been accepted!"
            content="You can proceed once the job is completed, please find the status in Datasets page."
            onClick={() => {
              setShowSuccessModal(false);
              navigate(-1);
            }}
            btnLabel="Go to My Datasets"
          />
        )}
     </Container>
    </Layout>
  );
};

export default UploadDataset;