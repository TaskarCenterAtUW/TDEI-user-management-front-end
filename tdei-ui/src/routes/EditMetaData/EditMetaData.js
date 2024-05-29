import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import { useQueryClient } from "react-query";
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import DatasetIcon from '@mui/icons-material/Dataset';
import { Icon, Button, Grid } from '@mui/material';
import ToastMessage from '../../components/ToastMessage/ToastMessage';
import style from '../../components/VerticalStepper/steps.module.css';
import Container from '../../components/Container/Container';
import Metadata from '../UploadDataset/Metadata';
import useEditMetadata from '../../hooks/datasets/useEditMetadata';
import { EDIT_META_DATA } from '../../utils';
import CustomModal from '../../components/SuccessModal/CustomModal';

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
        1: <DatasetIcon />,
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

export default function EditMetadata() {
    const location = useLocation();
    const navigate = useNavigate();
    const dataset = location.state?.dataset;
    const queryClient = useQueryClient();
    const [activeStep, setActiveStep] = useState(0);
    const [completed, setCompleted] = useState({});
    const [selectedData, setSelectedData] = useState({
        "dataset_detail": {
            "name": '',
            "version": '',
            "derived_from_dataset_id": null,
            "collection_date": null,
            "valid_from": null,
            "valid_to": null,
            "custom_metadata": null,
            "description": null,
            "dataset_area": null,
            "collection_method": null,
            "data_source": null,
            "schema_version": null,
            "collected_by": null
        },
        "data_provenance": {
            "full_dataset_name": null,
            "other_published_locations": null,
            "dataset_update_frequency_months": null,
            "schema_validation_run": null,
            "allow_crowd_contributions": null,
            "schema_validation_run_description": null,
            "location_inaccuracy_factors": null
        },
        "dataset_summary": {
            "collection_name": null,
            "department_name": null,
            "city": null,
            "region": null,
            "county": null,
            "key_limitations_of_the_dataset": null,
            "challenges": null
        },
        "maintenance": {
            "official_maintainer": [],
            "last_updated": null,
            "update_frequency": null,
            "authorization_chain": null,
            "maintenance_funded": null,
            "funding_details": null
        },
        "methodology": {
            "point_data_collection_device": null,
            "node_locations_and_attributes_editing_software": null,
            "data_collected_by_people": null,
            "data_collectors": null,
            "data_captured_automatically": null,
            "automated_collection": null,
            "data_collectors_organization": null,
            "data_collector_compensation": null,
            "preprocessing_location": null,
            "preprocessing_by": null,
            "preprocessing_steps": null,
            "data_collection_preprocessing_documentation": null,
            "documentation_uri": null,
            "validation_process_exists": null,
            "validation_process_description": null,
            "validation_conducted_by": null,
            "excluded_data": null,
            "excluded_data_reason": null
        }
    }
    );

    useEffect(() => {
        if (dataset) {
            const parsedDataset = {
                ...dataset.metadata,
                dataset_detail: {
                    ...dataset.metadata.dataset_detail,
                    custom_metadata:  dataset.metadata.dataset_detail.custom_metadata ? JSON.stringify(dataset.metadata.dataset_detail.custom_metadata, null, 2) : null,
                    dataset_area: dataset.metadata.dataset_detail.dataset_area ? JSON.stringify(dataset.metadata.dataset_detail.dataset_area, null, 2) : null
                }
            };
            setSelectedData(parsedDataset);
        }
    }, [dataset]);

    const [showSuccessModal, setShowSuccessModal] = React.useState(false);
    const [loading, setLoading] = useState(false); // Track loading state
    const [showToast, setToast] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [error, setError] = useState("");

    const onSuccess = (data) => {
        setLoading(false);
        console.log("sucessfully edited", data);
        queryClient.invalidateQueries({ queryKey: [EDIT_META_DATA] });
        setShowSuccessModal(true);
    };
    const onError = (err) => {
        setLoading(false);
        console.error("error message", err);
        setToast(true);
        setError(err.data)
    };
    const { isLoading, mutate } = useEditMetadata({ onSuccess, onError });
    const handleClose = () => {
        setToast(false);
    };

    const handleNext = () => {
        let errorMessage = validateMetadata();
        if (!errorMessage) {
            const dataToMutate = { tdei_dataset_id: dataset.tdei_dataset_id, metadata: selectedData };
            mutate(dataToMutate);
        } else {
            setErrorMessage(errorMessage);
            setToast(true);
        }
    };

    const handleSelectedDataChange = (selectedData) => {
        setSelectedData(selectedData);
    };

    const validateMetadata = () => {
        const metadata = selectedData;
        if (!metadata) {
            return "Please attach metadata file!";
        }
        if (!(metadata instanceof File)) {
        const { dataset_detail } = metadata;
        if (!dataset_detail) {
            return "Metadata details are missing!";
        }

        const requiredFields = [
            { field: 'name', message: 'Dataset Name is required' },
            { field: 'version', message: 'Dataset Version is required' },
            { field: 'collected_by', message: 'Collected By is required' },
            { field: 'collection_date', message: 'Collection Date is required' },
            { field: 'data_source', message: 'Data Source is required' }
        ];
        for (const { field, message } of requiredFields) {
            if (!dataset_detail[field]) {
                return message;
            }
        }
    }
        return null;
    };

    return (
        <div className={style.layout}>
            <Container>
                <div className={style.uploadWidgetTitle}>Update Metadata -</div>
                <Box className={style.uploadDatasetStepsLayout}>
                    <Grid container spacing={0} columns={15}>
                        <Grid item xs={4}>
                            <Box className={style.stepsBlock}>
                                <Stepper nonLinear activeStep={activeStep} orientation='vertical'>
                                    <Step key={0} completed={completed[0]}>
                                        <StepLabel StepIconComponent={ColorlibStepIcon}>
                                            <div className={style.stepTimelineTitle}>Metadata</div>
                                            <div className={style.stepTimelineSubTitle}>Attach Metadata File</div>
                                        </StepLabel>
                                    </Step>
                                </Stepper>
                            </Box>
                        </Grid>
                        <Grid item xs={11}>
                            <Grid container>
                                <Grid item xs={12}>
                                    <div className={style.stepsTabContainer}>
                                        <Metadata onSelectedFileChange={handleSelectedDataChange} selectedData={selectedData} />
                                    </div>
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
                                                <Button className={`tdei-primary-button ${style.textUnset}`} disabled={isLoading} onClick={handleNext}>
                                                    {isLoading ? "Submitting..." : "Submit"}
                                                </Button>
                                                <ToastMessage showToast={showToast} toastMessage={errorMessage} onClose={handleClose} isSuccess={false} />
                                            </Box>
                                        </React.Fragment>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    {showSuccessModal && (
                        <CustomModal
                            show={showSuccessModal}
                            message="Edit metadata successful!"
                            content="Find the updated metadata in datasets page."
                            handler={() => {
                                setShowSuccessModal(false);
                                navigate(-1);
                            }}
                            btnlabel="Ok"
                            modaltype="success"
                            title="Success"
                        />
                    )}
                    {showToast && (
                        <CustomModal
                            show={showToast}
                            message="Edit metadata Failed!"
                            content={error}
                            handler={() => {
                                setShowSuccessModal(false);
                            }}
                            btnlabel="Dismiss"
                            modaltype="error"
                            title="Error"
                        />
                    )}
                </Box>
            </Container>
        </div>
    );
}