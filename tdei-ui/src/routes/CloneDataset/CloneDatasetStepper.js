import React, { useState, useEffect, version } from 'react';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import DescriptionIcon from '@mui/icons-material/Description';
import DatasetIcon from '@mui/icons-material/Dataset';
import serviceUpload from './../../assets/img/service_upload.svg';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { Icon, Grid, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ToastMessage from '../../components/ToastMessage/ToastMessage';
import style from "../../components/VerticalStepper/steps.module.css";
import { useAuth } from '../../hooks/useAuth';
import { useSelector } from "react-redux";
import { getSelectedProjectGroup } from '../../selectors';

// Custom Icon component for service upload
export const ServiceIcon = () => (
  <Icon sx={{ alignItems: "center", display: "flex" }}>
    <img src={serviceUpload} height={20} alt='service-icon' width={20} color='white' style={{ width: "100%", height: "70%" }} />
  </Icon>
);

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
    2: <DatasetIcon />,
    3: <DescriptionIcon />,
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

CloneDatasetStepper.propTypes = {
  stepsData: PropTypes.array.isRequired,
  onStepsComplete: PropTypes.func.isRequired,
  currentStep: PropTypes.number.isRequired,
  dataset: PropTypes.object.isRequired,
};

// Main CloneDatasetStepper component
export default function CloneDatasetStepper({ stepsData, onStepsComplete, currentStep, dataset }) {
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState({});
  const selectedProjectGroup = useSelector(getSelectedProjectGroup);
  const [selectedData, setSelectedData] = useState({
    0: {
      tdei_project_group_id: selectedProjectGroup?.tdei_project_group_id ?? "",
      project_group_name: selectedProjectGroup?.name ?? "",
      roles: selectedProjectGroup?.roles || [],
    }});
  const [previousSelectedData, setPreviousSelectedData] = useState({});
  const [showToast, setToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.isAdmin;
 
  useEffect(() => {
    if (dataset && dataset.service && dataset.service.tdei_service_id) {
      setSelectedData(prevData => ({
        ...prevData,
        1: {
          tdei_project_group_id: selectedData[0]?.tdei_project_group_id ?? "",
          project_group_name: selectedData[0]?.project_group_name ?? "",
          tdei_service_id: "",
          service_type: dataset.data_type
        },
        2:{
            "dataset_detail": {
                "name": "",
                "version": "",
                "collection_date": "",
                "valid_from": "",
                "valid_to": "",
                "custom_metadata": "",
                "description": "",
                "dataset_area": "",
                "collection_method": "",
                "data_source": "",
                "schema_version": dataset.metadata.dataset_detail.schema_version ?? "",
                "collected_by": ""
            },
            "data_provenance": {
                "full_dataset_name": "",
                "other_published_locations": "",
                "dataset_update_frequency_months": "",
                "schema_validation_run": null,
                "allow_crowd_contributions": null,
                "schema_validation_run_description": "",
                "location_inaccuracy_factors": ""
            },
            "dataset_summary": {
                "collection_name": "",
                "department_name": "",
                "city": "",
                "region": "",
                "county": "",
                "key_limitations": "",
                "release_notes":"",
                "challenges": ""
            },
            "maintenance": {
                "official_maintainer": null,
                "last_updated": "",
                "update_frequency": "",
                "authorization_chain": "",
                "maintenance_funded": null,
                "funding_details": ""
            },
            "methodology": {
                "point_data_collection_device": "",
                "node_locations_and_attributes_editing_software": "",
                "data_collected_by_people": null,
                "data_collectors": "",
                "data_captured_automatically": null,
                "automated_collection": "",
                "data_collectors_organization": "",
                "data_collector_compensation": "",
                "preprocessing_location": "",
                "preprocessing_by": "",
                "preprocessing_steps": "",
                "data_collection_preprocessing_documentation": null,
                "documentation_uri": "",
                "validation_process_exists": null,
                "validation_process_description": "",
                "validation_conducted_by": "",
                "excluded_data": "",
                "excluded_data_reason": ""
            }
        }
      }));
    }
  }, [dataset,selectedData[0]]);

  useEffect(() => {
    if (currentStep === 0) {
      // If currentStep is 0, don't update activeStep
      return;
    }
    handleBackUntil();
    // eslint-disable-next-line
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
  const totalSteps = () => stepsData.length;

  // Check if current step is the last step
  const isLastStep = () => activeStep === totalSteps() - 1;

  // Function to close toast message
  const handleClose = () => setToast(false);

  // Event handler for changing selected step data
  const handleSelectedDataChange = (selectedData) => {
    updateSelectedData(activeStep, selectedData);
  };

  // Function to handle next button click
  const handleNext = () => {
    let isValid = false;
    let errMsg = "";

    // Perform validation based on active step
    switch (activeStep) {
      case 0:
        errMsg = validateProjectGroupSelection();
        isValid = errMsg === null;
        break;
      case 1:
        isValid = validateServiceUpload();
        if (!isValid) errMsg = "Please select a service!";
        break;
      case 2:
        errMsg = validateMetadata();
        isValid = errMsg === null;
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
        if((selectedData[2] && selectedData[2].file instanceof File) || !(selectedData[2] && selectedData[2] instanceof File)){
          const validMetadata = selectedData[2].file ? selectedData[2].formData : selectedData[2]
          const finalData = {
            ...selectedData,
            2: {
              ...validMetadata,
              dataset_detail: {
                ...validMetadata.dataset_detail,
                custom_metadata: validMetadata.dataset_detail.custom_metadata ? JSON.stringify(validMetadata.dataset_detail.custom_metadata, null, 2) : "",
                dataset_area: validMetadata.dataset_detail.dataset_area ? JSON.stringify(validMetadata.dataset_detail.dataset_area, null, 2) : ""
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
      setErrorMessage(errMsg);
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

  const handleBack = () => {
    const newCompleted = { ...completed };
    delete newCompleted[activeStep];

    updatePreviousSelectedData(activeStep, selectedData[activeStep]);
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    setCompleted(newCompleted);

    // Retrieve previously selected data for the DataFile step
    setSelectedData(prevData => ({
      ...prevData,
      [activeStep - 1]: previousSelectedData[activeStep - 1]
    }));
  };

  const validateProjectGroupSelection = () => {
    const selectedProjectGroup = selectedData[0]?.tdei_project_group_id;
    const userRoles = selectedData[0]?.roles || [];
    
    if (!selectedProjectGroup) {
      return "Please select a project group!";
    }
    const datasetType = dataset.data_type;
    const requiredRole = `${datasetType}_data_generator`;
    const projectGroupName = selectedData[0]?.project_group_name ?? "";
    
    const hasValidRole = userRoles.includes(requiredRole) || userRoles.includes("poc") || isAdmin;
    
    if (!hasValidRole) {
      return (
        <>
          To clone this dataset to project group <strong>{projectGroupName}</strong>, you need <strong>{requiredRole}</strong> role in <strong>{projectGroupName}</strong>.
        </>
      );
    }
    return null;
  };
  

  // Validation function for the first step (ServiceUpload)
  const validateServiceUpload = () => selectedData[activeStep].tdei_service_id !== null && selectedData[activeStep].tdei_service_id !== "";

  // Validation function for the third step (Metadata)
  const validateMetadata = () => {
    const metadata = selectedData[activeStep];
    if (!metadata) {
      return "Please attach metadata file!!";
    }

    // if (!(metadata && metadata.file instanceof File)) {
      const { dataset_detail, data_provenance } = metadata && metadata.file instanceof File ? metadata.formData : metadata;
      if (!dataset_detail) {
        return "Metadata details are missing!";
      }

      const requiredFields = [
        { field: 'name', message: 'Dataset Name is required' },
        { field: 'version', message: 'Dataset Version is required' },
        { field: 'collected_by', message: 'Collected By is required' },
        { field: 'collection_date', message: 'Collection Date is required' },
        { field: 'data_source', message: 'Data Source is required' },
        { field: 'schema_version', message: 'Schema Version is required' },
      ];
      for (const { field, message } of requiredFields) {
        if (!dataset_detail[field]) {
          return message;
        }
      }
    // Validate data_source
    const validDataSources = ["3rdParty", "TDEITools", "InHouse"];
    if (!validDataSources.includes(dataset_detail.data_source)) {
      return `Data Source must be one of: ${validDataSources.join(", ")}`;
    }

    // Validate schema_version based on service_type
    const serviceType = selectedData[1].service_type;
    const schemaVersion = dataset_detail.schema_version;
    const custom_metadata = dataset_detail.custom_metadata;
    const schemaVersionMapping = {
      osw: "v0.2",
      flex: "v2.0",
      pathways: "v1.0",
    };
    if (custom_metadata) {
      try {
        JSON.parse(custom_metadata);
      } catch (e) {
        return "Custom Metadata is not a valid JSON string.";
      }
    }
    if (schemaVersionMapping[serviceType] && schemaVersion !== schemaVersionMapping[serviceType]) {
      return `For service type "${serviceType}", Schema Version must be "${schemaVersionMapping[serviceType]}"`;
    }
      if (!data_provenance || !data_provenance.full_dataset_name) {
        return "Full Dataset Name in Data Provenance is required";
      }
    // }
    // Validate version
    const version = dataset_detail.version;
    const versionRegex = /^\d+(\.\d+)?$/;
    if (!version || !versionRegex.test(version)) {
      return "Dataset Version must be a valid number in the format x, or x.y (e.g., 1, 2.3)";
    }
    dataset_detail.version = version;
    return null;
  };

  // Validation function for the fourth step (Changeset)
  const validateChangeset = () => true;

  // To Determine the component to render based on active step and prepare component props
  const SelectedComponent = stepsData[activeStep].component;
  let componentProps = {};

  if (activeStep === 0) {
    componentProps = {
      selectedData: selectedData[activeStep],
      onSelectedProjectGroupChange: handleSelectedDataChange,
    };
  } else if (activeStep === 1) {
    componentProps = {
      selectedData: selectedData[activeStep],
      onSelectedServiceChange: handleSelectedDataChange,
      dataset,
      fromCloneDataset: true,
    };
  } else {
    componentProps = {
      selectedData: selectedData[activeStep],
      onSelectedFileChange: handleSelectedDataChange,
      dataType: dataset.data_type,
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