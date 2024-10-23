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
import { GET_DATASETS } from '../../utils';

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
            "schema_version": "",
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
            "key_limitations_of_the_dataset": "",
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
    );

    useEffect(() => {
        if (dataset) {
            const parsedDataset = {
                ...dataset.metadata,
                dataset_detail: {
                    ...dataset.metadata.dataset_detail,
                    custom_metadata: dataset.metadata.dataset_detail.custom_metadata ? JSON.stringify(dataset.metadata.dataset_detail.custom_metadata, null, 2) : "",
                    dataset_area: dataset.metadata.dataset_detail.dataset_area ? JSON.stringify(dataset.metadata.dataset_detail.dataset_area, null, 2) : ""
                }
            };
            setSelectedData(parsedDataset);
        }
    }, [dataset]);

    const [showSuccessModal, setShowSuccessModal] = React.useState(false);
    const [showErrorModal, setShowErrorModal] = React.useState(false);
    const [loading, setLoading] = useState(false); // Track loading state
    const [showToast, setToast] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [error, setError] = useState("");

    const onSuccess = (data) => {
        setLoading(false);
        queryClient.invalidateQueries({ queryKey: [GET_DATASETS] });
        setShowSuccessModal(true);
    };
    const onError = (err) => {
        setLoading(false);
        console.error("error message", err);
        setShowErrorModal(true);
        setError(err.data ?? err.message.message);
        if (selectedData) {
            const { custom_metadata, dataset_area } = selectedData.dataset_detail;
            // if custom_metadata is not JSON and stringify it
            const formattedCustomMetadata = (typeof custom_metadata === 'object' && custom_metadata !== null)
                ? JSON.stringify(custom_metadata, null, 2)
                : custom_metadata
            // if dataset_area is not JSON and stringify it
            const formattedDatasetArea = (typeof dataset_area === 'object' && dataset_area !== null)
                ? JSON.stringify(dataset_area, null, 2)
                : dataset_area
    
            const parsedDataset = {
                ...selectedData,
                dataset_detail: {
                    ...selectedData.dataset_detail,
                    custom_metadata: formattedCustomMetadata,
                    dataset_area: formattedDatasetArea
                }
            };
            setSelectedData(parsedDataset);
        }
    };
    const { isLoading, mutate } = useEditMetadata({ onSuccess, onError });
    const handleClose = () => {
        setToast(false);
    };

    const handleNext = () => {
        let errorMessage = validateMetadata();
        if (!errorMessage) {
            const dataToMutate = { tdei_dataset_id: dataset.tdei_dataset_id, metadata: selectedData && selectedData.file instanceof File ? selectedData.formData : selectedData };
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
        return null;
    };

    return (
        <div className={style.layout}>
            <Container>
                <div className={style.uploadWidgetTitle}>Update Metadata - {dataset && dataset.metadata && dataset.metadata.dataset_detail && dataset.metadata.dataset_detail.name}</div>
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
                    {showErrorModal && (
                        <CustomModal
                            show={showErrorModal}
                            message="Edit metadata Failed!"
                            content={error}
                            handler={() => {
                                setShowErrorModal(false);
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