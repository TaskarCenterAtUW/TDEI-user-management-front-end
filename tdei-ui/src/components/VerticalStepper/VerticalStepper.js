import * as React from 'react';
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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
  border: `1px solid ${ownerState.completed || ownerState.active ? '#59C3C8' : '#ccc'}`,
  boxSizing: 'border-box',
}));

const InnerCircle = styled('div')(({ theme, ownerState }) => ({
  backgroundColor: ownerState.completed || ownerState.active ? '#59C3C8' : (theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc'),
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
export default function VerticalStepper({ stepsData }) {
  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState({});
  const [selectedData, setSelectedData] = React.useState({});
  const [previousSelectedData, setPreviousSelectedData] = React.useState({});

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
  // Event handler for changing selected step data
  const handleSelectedDataChange = (selectedData) => {
    updateSelectedData(activeStep, selectedData)
  };
  // Function to display toast message
  const showToastMessage = () => {
    toast.error("Fill the required fields!", {
      position: "top-center"
    });
  };

  // Function to handle next button click
  const handleNext = () => {
    let isValid = false;

    // Perform validation based on active step
    switch (activeStep) {
      case 0:
        isValid = validateServiceUpload();
        break;
      case 1:
        isValid = validateDataFile();
        break;
      case 2:
        isValid = validateMetadata();
        break;
      case 3:
        isValid = validateChangeset();
        break;
      default:
        isValid = true;
    }

    // Proceed to next step if validation passes
    if (isValid) {
      const newCompleted = completed;
      const newActiveStep = isLastStep() ? activeStep : activeStep + 1;
      setActiveStep(newActiveStep);
      newCompleted[activeStep] = true;
      setCompleted(newCompleted);
      // To store selected data for the current step
      updatePreviousSelectedData(activeStep, selectedData[activeStep]);
    } else {
      showToastMessage()
    }
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
    if (selectedData[activeStep] != null && selectedData[activeStep].length > 0) {
      return true
    }
    return false;
  };

  // Validation function for the second step (DataFile)
  const validateDataFile = () => {
    if (selectedData[activeStep] != null) {
      return true
    }
    return false;
  };

  // Validation function for the third step (Metadata)
  const validateMetadata = () => {
    return true;
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
  } else if (activeStep === 1) {
    componentProps = {
      selectedData: selectedData[activeStep],
      onSelectedFileChange: handleSelectedDataChange
    };
  } else if (activeStep === 2) {
    componentProps = {
      selectedData: selectedData,
    };
  } else if (activeStep === 3) {
    componentProps = {
      selectedData: selectedData,
    };
  }
  // Rendering the vertical stepper component
  return (
    <Box sx={{ width: '100%', borderTop: 1, marginTop: "10px", borderColor: "grey.300" }}>
      <Grid container spacing={0} columns={15}>
        <Grid item xs={4}>
          <Box sx={{ borderRight: 1, height: "100%", borderColor: "grey.300" }}>
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
                    <Typography variant="h6" sx={{
                      font: 'normal normal bold 16px/20px Lato',
                      color: '#162848'
                    }}>{step.title}</Typography>
                    <Typography variant="subtitle2" sx={{
                      font: 'normal normal medium 10px/12px Lato',
                      color: '#83879B'
                    }}>
                      {step.subtitle}
                    </Typography>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
        </Grid>
        <Grid item xs={11}>
          <Grid container >
            <Grid item xs={12}>
              <Container style={{ height: 500, overflow: 'auto', margin: "20px" }}>
                <SelectedComponent {...componentProps} />
              </Container>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ width: '100%', borderTop: 1, borderColor: "grey.300" }}>
                <React.Fragment>
                  <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', pt: 2 }}>
                    <Button
                      variant="ouline-secondary"
                      className="tdei-secondary-button"
                      sx={{ border: "1px solid #83879B", marginLeft: "20px" }}
                    >
                      Cancel
                    </Button>
                    <Box sx={{ flex: '1 1 auto' }} />
                    {activeStep === 0 ? (
                      <Box></Box>
                    ) : (<Button
                      sx={{ border: "1px solid #4DA9AD", color: "#4DA9AD", marginRight: 1 }}
                      onClick={handleBack}
                      startIcon={<ChevronLeftIcon />}
                    >
                      Prev
                    </Button>)}
                    <Button className="tdei-primary-button" onClick={handleNext} endIcon={isLastStep() ? <div></div> : <ChevronRightIcon />} >
                      {isLastStep() ? 'Submit' : 'Next'}
                    </Button>
                    <ToastContainer />
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