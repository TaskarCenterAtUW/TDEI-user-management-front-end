import React, { useState, useEffect, useCallback } from 'react';
import DatasetTableHeader from "./DatasetTableHeader";
import DatasetRow from "./DatasetRow";
import { useQueryClient } from 'react-query';
import useGetDatasets from '../../hooks/service/useGetDatasets';
import { GET_DATASETS, PUBLISH_DATASETS } from '../../utils';
import { debounce } from "lodash";
import style from "./Datasets.module.css";
import Select from 'react-select';
import iconNoData from "./../../assets/img/icon-noData.svg";
import SortRefreshComponent from './SortRefreshComponent';
import usePublishDataset from '../../hooks/datasets/usePublishDataset';
import useDeactivateDataset from '../../hooks/datasets/useDeactivateDataset';
import CustomModal from '../../components/SuccessModal/CustomModal';
import ResponseToast from '../../components/ToastMessage/ResponseToast';
import { useNavigate } from 'react-router-dom';
import useDownloadDataset from '../../hooks/datasets/useDownloadDataset';
import { useAuth } from '../../hooks/useAuth';
import useCreateInclinationJob from '../../hooks/jobs/useCreateInclinationJob';
import DatePicker from '../../components/DatePicker/DatePicker';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';
import dayjs from 'dayjs';
import { Button, Form, Spinner, Row, Col } from "react-bootstrap";
import ProjectAutocomplete from '../../components/ProjectAutocomplete/ProjectAutocomplete';
import ServiceAutocomplete from '../../components/ServiceAutocomplete/ServiceAutocomplete';
import DownloadModal from '../../components/DownloadModal/DownloadModal';

const MyDatasets = () => {
    const queryClient = useQueryClient();
    const { user } = useAuth();
    const [isLoadingDownload, setIsLoadingDownload] = useState(false);
    const [query, setQuery] = useState("");
    const [debounceQuery, setDebounceQuery] = useState("");
    const [datasetIdQuery, setDatasetIdQuery] = useState("");
    const [debounceDatasetIdQuery, setDebounceDatasetIdQuery] = useState("");
    const [dataType, setDataType] = useState("");
    const [status, setStatus] = useState("All");
    const [validFrom, setValidFrom] = useState(null);
    const [validTo, setValidTo] = useState(null);
    const [tdeiServiceId, setTdeiServiceId] = useState("");
    const [sortedData, setSortedData] = useState([]);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [selectedDataset, setSelectedDataset] = useState(null);
    const [open, setOpen] = useState(false);
    const [eventKey, setEventKey] = useState("");
    const [operationResult, setOperationResult] = useState("");
    const isAdmin = user && user.isAdmin;
    const [selectedProjectGroupId, setSelectedProjectGroupId] = useState(null);
    const [sortField, setSortField] = useState('uploaded_timestamp');
    const [sortOrder, setSortOrder] = useState('DESC');
    const [showDownloadModal, setShowDownloadModal] = useState(false);
    const [selectedFormat, setSelectedFormat] = useState(null);
    const [selectedFileVersion, setSelectedFileVersion] = useState(null);
    const { data = [], isError, hasNextPage, fetchNextPage, isFetchingNextPage, isLoading, refreshData } = useGetDatasets(
        isAdmin,
        debounceQuery,
        debounceDatasetIdQuery,
        status,
        dataType,
        validFrom,
        validTo,
        tdeiServiceId,
        selectedProjectGroupId,
        sortField,
        sortOrder
    );
    const [projectSearchText, setProjectSearchText] = useState("");
    const [serviceSearchText, setServiceSearchText] = useState("");
    const navigate = useNavigate();
    const [customErrorMessage, setCustomErrorMessage] = useState("");
    const [showFilters, setShowFilters] = useState(false);

    const toggleFilters = () => {
        setShowFilters(!showFilters);
    };
    const handleClearProjectGroup = () => {
        setSelectedProjectGroupId(null); 
        setProjectSearchText(""); 
        refreshData();
    };
    const handleClearService = () => {
        setTdeiServiceId("");
        setServiceSearchText("");
        refreshData();
    };


    useEffect(() => {
        if (data && data.pages && data.pages.length > 0) {
            const allData = data.pages.reduce((acc, page) => {
                page.data.forEach(dataset => {
                    acc.set(dataset.tdei_dataset_id, dataset);
                });
                return acc;
            }, new Map());

            const sorted = Array.from(allData.values());
            setSortedData(sorted);
        }
    }, [data]);

    useEffect(() => {
        console.log("Selected Project Group ID in MyDatasets:", selectedProjectGroupId);
    }, [selectedProjectGroupId]);

    const handleSelectedDataType = (value) => {
        setDataType(value.value);
    };

    const handleSelectedStatus = (list) => {
        setStatus(list.value);
    };

    const handleSearch = (e) => {
        setDebounceQuery(e.target.value);
    };

    const debouncedHandleSearch = useCallback(
        debounce(handleSearch, 300),
        []
    );

    const handleDatasetIdSearch = (e) => {
        setDebounceDatasetIdQuery(e.target.value);
    };

    const debouncedHandleDatasetIdSearch = useCallback(
        debounce(handleDatasetIdSearch, 300),
        []
    );

    const handleChangeDatePicker = (date, setter) => {
        const dateString = date ? dayjs(date).format('MM-DD-YYYY') : null;
        setter(dateString);
        refreshData();
    };

    const handleSortChange = (field, order) => {
        setSortField(field);
        setSortOrder(order);
        refreshData();
    };

    const options = [
        { value: '', label: 'All' },
        { value: 'flex', label: 'Flex' },
        { value: 'pathways', label: 'Pathways' },
        { value: 'osw', label: 'OSW' },
    ];

    const statusOptions = [
        { value: 'All', label: 'All' },
        { value: 'Publish', label: 'Released' },
        { value: 'Pre-Release', label: 'Pre-Release' },
    ];

    const onSuccess = () => {
        setOperationResult("success");
        setShowSuccessModal(false);
        queryClient.invalidateQueries({ queryKey: [GET_DATASETS] });
        setIsLoadingDownload(false);
        handleToast();
        setShowDownloadModal(false);
        setSelectedFormat(null);
        setSelectedFileVersion(null);
    };

    const onError = (err) => {
        const errorMessage = err.data || "Unknown error occured! Please try again!";
        console.error("Error message:", errorMessage);
        setOperationResult("error");
        setOpen(true);
        setCustomErrorMessage(errorMessage);
        setShowSuccessModal(false);
        setIsLoadingDownload(false);
        setShowDownloadModal(false);
        setSelectedFormat(null);
        setSelectedFileVersion(null);
    };

    const { mutate: publishDataset, isLoading: isPublishing } = usePublishDataset({ onSuccess, onError });
    const { mutate: deactivateDataset, isLoading: isDeletingDataset } = useDeactivateDataset({ onSuccess, onError });
    const { mutate: downloadDataset, isLoading: isDownloadingDataset } = useDownloadDataset({ onSuccess, onError });
    const { mutate: createInclinationJob, isLoading: isCreatingJob } = useCreateInclinationJob({ onSuccess, onError });

    const handlePublishDataset = (dataset) => {
        // Check if valid_from and valid_to dates are present
        if (!dataset?.metadata?.dataset_detail?.valid_from || !dataset?.metadata?.dataset_detail?.valid_to) {
            setEventKey("missingDates");
            setShowSuccessModal(true);
            return;
        }
        // If validation passes, show the release confirmation modal
        setEventKey("release");
        setShowSuccessModal(true);
    };

    const handleDeactivate = () => {
        deactivateDataset(selectedDataset.tdei_dataset_id);
    };

    const handleCreateInclinationJob = () => {
        createInclinationJob(selectedDataset.tdei_dataset_id);
    };

    const handleDownloadDataset = (dataset) => {
        setIsLoadingDownload(true);
        if (selectedDataset && selectedDataset.data_type === 'osw') {
            const format = selectedFormat ? selectedFormat.value : 'osw';
            const fileVersion = selectedFileVersion ? selectedFileVersion.value : 'latest';
            downloadDataset({
                tdei_dataset_id: selectedDataset.tdei_dataset_id,
                data_type: selectedDataset.data_type,
                format: format,
                file_version: fileVersion
            });
        } else {
            downloadDataset({ tdei_dataset_id: dataset.tdei_dataset_id, data_type: dataset.data_type });
        }
        setSelectedDataset(null);
    };
    const onAction = (eventKey, dataset) => {
        setSelectedDataset(dataset);
        setEventKey(eventKey);
        if (eventKey === 'editMetadata') {
            navigate('/EditMetadata', { state: { dataset } });
        } else if (eventKey === 'cloneDataset') {
            navigate('/CloneDataset', { state: { dataset } });
        } else if (eventKey === 'downLoadDataset') {
            if (dataset.data_type === 'osw') {
                setShowDownloadModal(true);
            } else {
                handleDownloadDataset(dataset);
            }
        } else if (eventKey === 'release') {
            handlePublishDataset(dataset);
        } else {
            setShowSuccessModal(true);
        }
    };
    const formatOptions = [
        { value: 'osm', label: 'OSM' },
        { value: 'osw', label: 'OSW' }
    ];

    const fileVersionOptions = [
        { value: 'latest', label: 'Latest' },
        { value: 'original', label: 'Original' }
    ];

    const handleRefresh = () => {
        refreshData();
    };
    // Modal configuration based on eventKey
    const modalConfig = {
        release: {
            message: `Are you sure you want to release dataset ${selectedDataset?.metadata?.data_provenance?.full_dataset_name}?`,
            content: "Release job will take around 4 to 6 hours. You can find the status in the jobs page.",
            handler: () => publishDataset({ service_type: selectedDataset.data_type, tdei_dataset_id: selectedDataset.tdei_dataset_id }),
            btnlabel: "Release",
            modaltype: "release"
        },
        deactivate: {
            message: `Are you sure you want to deactivate dataset ${selectedDataset?.metadata?.data_provenance?.full_dataset_name}?`,
            content: "Deactivation will remove the dataset from the system.",
            handler: handleDeactivate,
            btnlabel: "Deactivate",
            modaltype: "deactivate"
        },
        inclination: {
            message: `Are you sure you want to add an inclination job for dataset ${selectedDataset?.metadata?.data_provenance?.full_dataset_name}?`,
            content: "Adding incline may take around 10-15 mins of time depending on the size of the dataset. You can find the status in the jobs page.",
            handler: handleCreateInclinationJob,
            btnlabel: "Add Incline",
            modaltype: "inclination"
        },
        missingDates: {
            message: "Valid From and Valid To dates are mandatory for publishing the dataset.",
            content: "Please edit the metadata information before proceeding.",
            handler: () => setShowSuccessModal(false),
            btnlabel: "Close",
            modaltype: "error"
        }
    };

    const currentModalConfig = modalConfig[eventKey];

    const handleToast = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const getToastMessage = () => {
        switch (eventKey) {
            case 'release':
                return operationResult === "success"
                    ? "Success! Dataset release job has been initiated."
                    : "Error! Failed to initiate dataset release job.";
            case 'deactivate':
                return operationResult === "success"
                    ? "Success! Dataset has been deactivated."
                    : "Error! Failed to deactivate dataset.";
            case 'inclination':
                return operationResult === "success"
                    ? "Success! Inclination job has been initiated."
                    : customErrorMessage;
            case 'downLoadDataset':
                return operationResult === "success"
                    ? "Success! Download has been initiated."
                    : customErrorMessage;
            default:
                return "";
        }
    };
    // Callback to handle service selection from ServiceAutocomplete
    const handleServiceSelect = useCallback((serviceId) => {
        setTdeiServiceId(serviceId || "");
        refreshData();
    }, [refreshData]);

    return (
        <div>
            <Form noValidate>
                <Row className="mb-3" style={{ marginTop: '20px' }}>
                    <Col md={5}>
                        <Form.Group className="d-flex align-items-center">
                            <div style={{ width: '24vw', paddingRight: '20px' }}>
                                <Form.Label>Type</Form.Label>
                                <Select
                                    isSearchable={false}
                                    defaultValue={{ label: "All", value: "" }}
                                    onChange={handleSelectedDataType}
                                    options={options}
                                    components={{ IndicatorSeparator: () => null }}
                                />
                            </div>
                            <div style={{ width: '24vw' }}>
                                <Form.Label>Status</Form.Label>
                                <Select
                                    isSearchable={false}
                                    defaultValue={{ label: "All", value: "All" }}
                                    onChange={handleSelectedStatus}
                                    options={statusOptions}
                                    components={{ IndicatorSeparator: () => null }}
                                />
                            </div>
                        </Form.Group>
                    </Col>
                    <Col md={7}>
                        <SortRefreshComponent
                            handleRefresh={handleRefresh}
                            handleSortChange={handleSortChange}
                            sortField={sortField}
                            sortOrder={sortOrder}
                            toggleFilters={toggleFilters}
                        />
                    </Col>
                </Row>
                {showFilters && (
                    <div className={style.filterComponent}>
                        <Row className="mb-3">
                            <Col md={4}>
                                <Form.Group>
                                    <div className={style.labelWithClear}>
                                        <Form.Label>Dataset</Form.Label>
                                        <span
                                            className={style.clearButton}
                                            onClick={() => {
                                                setQuery("");
                                                debouncedHandleSearch({ target: { value: "" } });
                                            }}
                                        >
                                            Clear
                                        </span>
                                    </div>
                                    <Form.Control
                                        value={query}
                                        aria-label="Search Dataset"
                                        placeholder="Search Dataset"
                                        onChange={(e) => {
                                            setQuery(e.target.value);
                                            debouncedHandleSearch(e);
                                        }}
                                    />
                                </Form.Group>
                            </Col>
                            {isAdmin ? (
                                <Col md={4}>
                                    <Form.Group>
                                        <div className={style.labelWithClear}>
                                            <Form.Label>Project Group</Form.Label>
                                            <span
                                                className={style.clearButton}
                                                onClick={handleClearProjectGroup}
                                            >
                                                Clear
                                            </span>
                                        </div>
                                        <ProjectAutocomplete
                                            selectedProjectGroupId={selectedProjectGroupId}
                                            projectSearchText={projectSearchText} 
                                            setProjectSearchText={setProjectSearchText}
                                            onSelectProjectGroup={(projectGroupId) => setSelectedProjectGroupId(projectGroupId)}
                                        />
                                    </Form.Group>
                                </Col>
                            ) : (
                                <Col md={4}>
                                    <Form.Group>
                                    <div className={style.labelWithClear}>
                                            <Form.Label>Dataset ID</Form.Label>
                                            <span
                                                className={style.clearButton}
                                                onClick={() => {
                                                    setDatasetIdQuery("");
                                                    handleDatasetIdSearch({ target: { value: "" } });
                                                }}
                                            >
                                                Clear
                                            </span>
                                        </div>
                                        <Form.Control
                                            aria-label="Search Dataset ID"
                                            placeholder="Search Dataset ID"
                                            value={datasetIdQuery}
                                            onChange={(e) => {
                                                setDatasetIdQuery(e.target.value);
                                                debouncedHandleDatasetIdSearch(e);
                                            }}
                                        />
                                    </Form.Group>
                                </Col>
                            )}
                            <Col md={4}>
                            <Form.Group>
                                    <div className={style.labelWithClear}>
                                        <Form.Label>Service</Form.Label>
                                        <span className={style.clearButton} onClick={handleClearService}>
                                            Clear
                                        </span>
                                    </div>
                                    <ServiceAutocomplete
                                        serviceSearchText={serviceSearchText}
                                        setServiceSearchText={setServiceSearchText}
                                        onSelectService={handleServiceSelect}
                                        isAdmin={user && user.isAdmin}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row className="d-flex justify-content-start">
                            {isAdmin && (
                                <Col md={4}>
                                    <Form.Group>
                                        <div className={style.labelWithClear}>
                                            <Form.Label>Dataset ID</Form.Label>
                                            <span
                                                className={style.clearButton}
                                                onClick={() => {
                                                    setDatasetIdQuery("");
                                                    handleDatasetIdSearch({ target: { value: "" } });
                                                }}
                                            >
                                                Clear
                                            </span>
                                        </div>
                                        <Form.Control
                                            aria-label="Search Dataset ID"
                                            placeholder="Search Dataset ID"
                                            value={datasetIdQuery}
                                            onChange={(e) => {
                                                setDatasetIdQuery(e.target.value);
                                                debouncedHandleDatasetIdSearch(e);
                                            }}
                                        />
                                    </Form.Group>
                                </Col>
                            )}
                            <Col md={4}>
                                <div className={style.labelWithClear}>
                                    <Form.Label>Valid From</Form.Label>
                                    <span
                                        className={style.clearButton}
                                        onClick={() => {
                                            setValidFrom(null);
                                            refreshData();
                                        }}
                                    >
                                        Clear
                                    </span>
                                </div>
                                <DatePicker
                                    label="Valid From"
                                    onChange={(date) => handleChangeDatePicker(date, setValidFrom)}
                                    dateValue={validFrom}
                                    isFilter={true}
                                />
                            </Col>
                            <Col md={4}>
                                <div className={style.labelWithClear}>
                                    <Form.Label>Valid To</Form.Label>
                                    <span
                                        className={style.clearButton}
                                        onClick={() => {
                                            setValidTo(null);
                                            refreshData();
                                        }}
                                    >
                                        Clear
                                    </span>
                                </div>
                                <DatePicker
                                    label="Valid To"
                                    onChange={(date) => handleChangeDatePicker(date, setValidTo)}
                                    dateValue={validTo}
                                    isFilter={true}
                                />
                            </Col>
                        </Row>
                    </div>)}
                <DatasetTableHeader isReleasedDataList={false} />
                {isLoading ? (
                    <div className="d-flex justify-content-center">
                        <Spinner size="md" />
                    </div>
                ) : sortedData.length > 0 ? (
                    sortedData.map((list, index) => (
                        <DatasetRow
                            key={list.tdei_dataset_id}
                            dataset={list}
                            onAction={onAction}
                            isReleasedList={false}
                        />
                    ))
                ) : (
                    <div className="d-flex align-items-center mt-2">
                        <img
                            src={iconNoData}
                            className={style.noDataIcon}
                            alt="no-data-icon"
                        />
                        <div className={style.noDataText}>No datasets found..!</div>
                    </div>
                )}

                {isError && "Error loading datasets"}
                {hasNextPage && !isLoading && (
                    <Button
                        className="tdei-primary-button"
                        onClick={() => fetchNextPage()}
                        disabled={isFetchingNextPage || isError || !hasNextPage}
                    >
                        Load More {isFetchingNextPage && <Spinner size="sm" />}
                    </Button>
                )}
                <CustomModal
                    show={showSuccessModal}
                    message={currentModalConfig?.message}
                    content={currentModalConfig?.content}
                    handler={currentModalConfig?.handler}
                    btnlabel={currentModalConfig?.btnlabel}
                    modaltype={currentModalConfig?.modaltype}
                    onHide={() => setShowSuccessModal(false)}
                    isLoading={isPublishing || isDeletingDataset || isCreatingJob}
                />
                <DownloadModal
                    show={showDownloadModal}
                    handleClose={() => {
                        if (!isLoadingDownload) {
                            setShowDownloadModal(false);
                            setSelectedFormat(null);
                            setSelectedFileVersion(null);
                            setSelectedDataset(null);
                        }
                    }}
                    handleDownload={handleDownloadDataset}
                    formatOptions={formatOptions}
                    fileVersionOptions={fileVersionOptions}
                    selectedFormat={selectedFormat}
                    setSelectedFormat={setSelectedFormat}
                    selectedFileVersion={selectedFileVersion}
                    setSelectedFileVersion={setSelectedFileVersion}
                    isLoading={isLoadingDownload}
                />
                <ResponseToast
                    showtoast={open}
                    handleClose={handleClose}
                    type={operationResult === "success" ? "success" : "error"}
                    message={getToastMessage()}
                />
            </Form>
        </div>
    );
};

export default MyDatasets;
