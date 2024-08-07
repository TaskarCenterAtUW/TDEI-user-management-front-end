import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import FolderZipIcon from '@mui/icons-material/FolderZip';
import DescriptionIcon from '@mui/icons-material/Description';
import DatasetIcon from '@mui/icons-material/Dataset';
import serviceUpload from './../../assets/img/service_upload.svg'
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { Icon, List } from '@mui/material';
import { Grid, Button, Container, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ToastMessage from '../ToastMessage/ToastMessage';
import style from "./steps.module.css";

// Custom Icon component for service upload
export const ServiceIcon = () => (
  <Icon sx={{ alignItems: "center", display: "flex" }}>
    <img src={serviceUpload} height={20} width={20} color='white' style={{ width: "100%", height: "70%" }} />
  </Icon>
)
// Styled components for customized step icons in the stepper
const ColorlibStepIconRoot = styled('div')(({ theme, ownerState }) => ({
  position: 'relative',
  width: 45,
  height: 45,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}));

const OutlineCircle = styled('div')(({ ownerState }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: 45,
  height: 45,
  borderRadius: '50%',
  border: `1px solid ${ownerState.completed || ownerState.active ? 'var(--primary-color)' : '#ddd7e6'}`,
  boxSizing: 'border-box',
}));

const InnerCircle = styled('div')(({ theme, ownerState }) => ({
  backgroundColor: ownerState.completed || ownerState.active ? 'var(--primary-color)' : (theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ddd7e6'),
  zIndex: 1,
  zIndex: 1,
  color: '#fff',
  width: 35,
  height: 35,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
}));

// Custom step icon component for the stepper
function ColorlibStepIcon({ active, completed, icon, className }) {
  const icons = {
    1: <ServiceIcon />,
    2: <FolderZipIcon />,
    3: <DatasetIcon />,
    4: <DescriptionIcon />,
  };

  return (
    <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
      <OutlineCircle ownerState={{ active, completed }} />
      <InnerCircle ownerState={{ active, completed }}>
        {icons[String(icon)]}
      </InnerCircle>
    </ColorlibStepIconRoot>
  );
}

ColorlibStepIcon.propTypes = {
  active: PropTypes.bool,
  className: PropTypes.string,
  completed: PropTypes.bool,
  icon: PropTypes.node,
};
// Main VerticalStepper component
export default function VerticalStepper({ stepsData, onStepsComplete,currentStep}) {
  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState({});
  const [selectedData, setSelectedData] = React.useState({});
  const [previousSelectedData, setPreviousSelectedData] = React.useState({});
  const [showToast, setToast] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [metaDataErrorMsg, setMetaDataErrorMsg] = React.useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (currentStep == 0) {
      // If currentStep is 0, don't update activeStep
      return;
    }
    handleBackUntil()
  }, [currentStep]);

  // Function to update selected data
  const updateSelectedData = (stepIndex, data) => {
    setSelectedData(prevData => ({
      ...prevData,
      [stepIndex]: data
    }));
  };

  // Function to update previous selected data
  const updatePreviousSelectedData = (stepIndex, data) => {
    setPreviousSelectedData(prevData => ({
      ...prevData,
      [stepIndex]: data
    }));
  };
  // Calculate total number of steps
  const totalSteps = () => {
    return stepsData.length;
  };
  // Check if current step is the last step
  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };
  // Function to close toast message
  const handleClose = () => {
    setToast(false);
  };
  // Event handler for changing selected step data
  const handleSelectedDataChange = (selectedData) => {
    updateSelectedData(activeStep, selectedData)
  };

  // Function to handle next button click
  const handleNext = () => {
    let isValid = false;
    let errorMessage = "";
  
    // Perform validation based on active step
    switch (activeStep) {
      case 0:
        isValid = validateServiceUpload();
        if (!isValid) errorMessage = "Please select a service!";
        break;
      case 1:
        isValid = validateDataFile();
        if (!isValid) errorMessage = "Dataset zip file is required to upload a dataset. Please upload a dataset.zip file";
        break;
      case 2:
        errorMessage = validateMetadata();
        isValid = errorMessage === null;
        break;
      case 3:
        isValid = validateChangeset();
        break;
      default:
        isValid = true;
    }
    // Proceed to next step if validation passes
    if (isValid) {
      const newCompleted = { ...completed };
      const newActiveStep = isLastStep() ? activeStep : activeStep + 1;
      if (isLastStep()) {
        if(!(selectedData[2] instanceof File)){
          const finalData = {
            ...selectedData,
            2: {
              ...selectedData[2],
              dataset_detail: {
                ...selectedData[2].dataset_detail,
                custom_metadata: selectedData[2].dataset_detail && selectedData[2].dataset_detail.custom_metadata ? JSON.stringify(selectedData[2].dataset_detail.custom_metadata, null, 2) : "",
                dataset_area: selectedData[2].dataset_detail && selectedData[2].dataset_detail.dataset_area ? JSON.stringify(selectedData[2].dataset_detail.dataset_area, null, 2) : ""
              }
            }
          };
          onStepsComplete(finalData);
        }else{
          onStepsComplete(selectedData);
        }
        
      } else {
        setActiveStep(newActiveStep);
        newCompleted[activeStep] = true;
        setCompleted(newCompleted);
        // Store selected data for the current step
        updatePreviousSelectedData(activeStep, selectedData[activeStep]);
      }
    } else {
      // Display toast message
      setErrorMessage(errorMessage);
      setToast(true);
    }
  };
  const handleBackUntil = () => {
    // Calculate the target step to go back to
    const targetStep = currentStep;
    if (activeStep === targetStep) {
      return;
    }
    // Update completed steps and selected data until the target step
    const newCompleted = {};
    const newSelectedData = {};
    for (let i = 0; i <= targetStep; i++) {
      newCompleted[i] = completed[i];
      newSelectedData[i] = previousSelectedData[i];
    }
    setCompleted(newCompleted);
    setSelectedData(newSelectedData);
    setActiveStep(targetStep);
  };
  
  // Inside VerticalStepper component
  const handleBack = () => {
    const newCompleted = { ...completed };
    delete newCompleted[activeStep];
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    setCompleted(newCompleted);

    // Retrieve previously selected data for the DataFile step
    setSelectedData(prevData => ({
      ...prevData,
      [activeStep - 1]: previousSelectedData[activeStep - 1]
    }));
  };
  // Validation function for the first step (ServiceUpload)
  const validateServiceUpload = () => {
    if(selectedData[activeStep].tdei_service_id !== null && selectedData[activeStep].tdei_service_id !== ""){
      return true
    }
    return false;
  };

  // Validation function for the second step (DataFile)
  const validateDataFile = () => {
    if (selectedData[activeStep] != null && selectedData[activeStep].file != null) {
      return true
    }
    return false;
  };

  // Validation function for the third step (Metadata)
  const validateMetadata = () => {
    const metadata = selectedData[activeStep];
    if (!metadata) {
      return "Please attach metadata file!!";
    }
  
    if (!(metadata instanceof File)) {
      const { dataset_detail, data_provenance } = metadata;
      if (!dataset_detail) {
        return "Metadata details are missing!";
      }
  
      const requiredFields = [
        { field: 'name', message: 'Dataset Name is required' },
        { field: 'version', message: 'Dataset Version is required' },
        { field: 'collected_by', message: 'Collected By is required' },
        { field: 'collection_date', message: 'Collection Date is required' },
        { field: 'data_source', message: 'Data Source is required' },
        { field: 'schema_version', message: 'Schema Version is required' }
      ];
      for (const { field, message } of requiredFields) {
        if (!dataset_detail[field]) {
          return message;
        }
      }
      if (!data_provenance || !data_provenance.full_dataset_name) {
        return "Full Dataset Name in Data Provenance is required";
      }
    }
    return null;
  };  
  // Validation function for the fourth step (Changeset)
  const validateChangeset = () => {
    return true;
  };
  // To Determine the component to render based on active step and prepare component props
  const SelectedComponent = stepsData[activeStep].component;
  let componentProps = {};
  //TODO: To be changed/ make it generic based on rest of the steps data retrieval
  // Depending on the active step, prepare different props for the selected component
  if (activeStep === 0) {
    componentProps = {
      selectedData: selectedData[activeStep],
      onSelectedServiceChange: handleSelectedDataChange
    };
  } else if (activeStep === 1 || activeStep === 2 || activeStep === 3) {
    componentProps = {
      selectedData: selectedData[activeStep],
      onSelectedFileChange: handleSelectedDataChange
    };
  } else {
    componentProps = {
      selectedData: selectedData[activeStep],
      onSelectedFileChange: handleSelectedDataChange
    };
  }
  // Rendering the vertical stepper component
  return (
    <Box className={style.uploadDatasetStepsLayout}>
      <Grid container spacing={0} columns={15}>
        <Grid item xs={4}>
          <Box className={style.stepsBlock}>
            <Stepper nonLinear activeStep={activeStep} orientation='vertical' sx={{
              '& .MuiStepConnector-line': {
                minHeight: '50px',
                borderLeftStyle: 'dashed',
                marginY: "-5px",
                marginX: "9px",
                borderColor: "#DDDDDD",
                borderWidth: "2px",
              }
            }} >
              {stepsData.map((step, index) => (
                <Step key={index} completed={completed[index]}>
                  <StepLabel StepIconComponent={ColorlibStepIcon}>
                    <div className={style.stepTimelineTitle}>{step.title}</div>
                    <div className={style.stepTimelineSubTitle}>{step.subtitle}</div>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
        </Grid>
        <Grid item xs={11}>
          <Grid container >
            <Grid item xs={12}>
              <Container className={style.stepsTabContainer}>
                <SelectedComponent {...componentProps} />
              </Container>
            </Grid>
            <Grid item xs={12}>
              <Box className={style.uploadDatasetStepsFooterBlock}>
                <React.Fragment>
                  <Box className={style.footerButtonBlock}>
                    <Button
                      className={style.buttonSecondaryCustomised}
                      onClick={() => navigate(-1)}
                    >
                      Cancel
                    </Button>
                    <Box sx={{ flex: '1 1 auto' }} />
                    {activeStep === 0 ? (
                      <Box></Box>
                    ) : (<Button
                      className={style.buttonOutlineCustomised}
                      onClick={handleBack}
                      startIcon={<ChevronLeftIcon />}
                    >
                      Prev
                    </Button>)}
                    <Button className={`tdei-primary-button ${style.textUnset}`} onClick={handleNext} endIcon={isLastStep() ? <div></div> : <ChevronRightIcon />} >
                      {isLastStep() ? 'Submit' : 'Next'}
                    </Button>
                    <ToastMessage showToast={showToast} toastMessage={errorMessage} onClose={handleClose} isSuccess={false} />
                  </Box>
                </React.Fragment>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}