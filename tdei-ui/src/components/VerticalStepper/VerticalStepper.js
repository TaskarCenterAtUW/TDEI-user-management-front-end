import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
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
import { Icon } from '@mui/material';

export const ServiceIcon = () => (
  <Icon sx={{alignItems:"center",display:"flex"}}>
      <img src={serviceUpload} height={20} width={20} color='white' style={{width:"100%",height:"70%"}}/>
  </Icon>
)
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
    /**
     * Whether this step is active.
     * @default false
     */
    active: PropTypes.bool,
    className: PropTypes.string,
    /**
     * Mark the step as completed. Is passed to child components.
     * @default false
     */
    completed: PropTypes.bool,
    /**
     * The label displayed in the step icon.
     */
    icon: PropTypes.node,
  };
const steps = ['Service', 'Data File', 'Metadata File','Changeset'];

export default function VerticalStepper() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState({});

  const totalSteps = () => {
    return steps.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const handleNext = () => {
    const newCompleted = completed;
    const newActiveStep =
      isLastStep()
        ?
        activeStep
        : activeStep + 1;
    setActiveStep(newActiveStep);
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);
  };

  const handleBack = () => {
    const newCompleted = { ...completed };
    delete newCompleted[activeStep];
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    setCompleted(newCompleted);
  };

  const handleStep = (step) => () => {
    setActiveStep(step);
  };

  const handleComplete = () => {
    const newCompleted = completed;
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);
    handleNext();
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper nonLinear activeStep={activeStep} orientation='vertical'     sx={{
          '& .MuiStepConnector-line': {
           minHeight: '50px',
           borderLeftStyle: 'dashed',
           marginY: "-5px",
           marginX: "9px",
           borderColor: "#DDDDDD",
           borderWidth: "2px"
         }
    }} >
        {steps.map((label, index) => (
          <Step key={label} completed={completed[index]}>
             <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <div>
          <React.Fragment>
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              <Box sx={{ flex: '1 1 auto' }} />
              {activeStep === 0 ? (
                <Box></Box>
              ): (<Button
                sx={{border:"1px solid #4DA9AD", color:"#4DA9AD", marginRight: 1}}
                onClick={handleBack}
                startIcon = {<ChevronLeftIcon />}
              >
                Prev
              </Button>)}
              <Button className="tdei-primary-button" onClick={handleNext} endIcon={ isLastStep() ? <div></div> : <ChevronRightIcon /> } >
              { isLastStep() ?  'Submit' : 'Next' } 
              </Button>
            </Box>
          </React.Fragment>
      </div>
    </Box>
  );
}