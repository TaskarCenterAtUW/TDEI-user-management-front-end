import React, { useState, useEffect } from 'react';
import DatasetTableHeader from "./DatasetTableHeader";
import DatasetRow from "./DatasetRow";
import { useQueryClient } from 'react-query';
import useGetDatasets from '../../hooks/service/useGetDatasets';
import { GET_DATASETS, PUBLISH_DATASETS } from '../../utils';
import { debounce } from "lodash";
import { Button, Form, Spinner } from "react-bootstrap";
import style from "./Datasets.module.css";
import Select from 'react-select';
import iconNoData from "./../../assets/img/icon-noData.svg";
import { toPascalCase } from '../../utils';
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

const MyDatasets = () => {
    const queryClient = useQueryClient();
    const { user } = useAuth();
    const [query, setQuery] = useState("");
    const [debounceQuery, setDebounceQuery] = useState("");
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
    const [debounceProjectId, setDebounceProjectId] = useState("");
    const [sortField, setSortField] = useState('uploaded_timestamp');
    const [sortOrder, setSortOrder] = useState('DESC');
    const { data = [], isError, hasNextPage, fetchNextPage, isFetchingNextPage, isLoading, refreshData } = useGetDatasets(isAdmin, debounceQuery, status, dataType, validFrom, validTo, tdeiServiceId,debounceProjectId,sortField,sortOrder);
    const navigate = useNavigate();
    const [customErrorMessage, setCustomErrorMessage] = useState("");

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

    const handleSelectedDataType = (value) => {
        setDataType(value.value);
    };

    const handleSelectedStatus = (list) => {
        setStatus(list.value);
    };

    const handleSearch = (e) => {
        setDebounceQuery(e.target.value);
    };

    const debouncedHandleSearch = debounce(handleSearch, 300);

    const handleChangeDatePicker = (date, setter) => {
        const dateString = date ? dayjs(date).format('MM-DD-YYYY') : null;
        setter(dateString);
        refreshData();
    };
    const handleSortChange = (field, order) => {
        setSortField(field);
        setSortOrder(order);
        refreshData();  
      }

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
        handleToast();
    };

    const onError = (err) => {
        const errorMessage = err.data || "An unexpected error occurred";
        console.error("Error message:", errorMessage);
        setOperationResult("error");
        setOpen(true);
        setCustomErrorMessage(errorMessage);
        setShowSuccessModal(false);
    };

    const { mutate: publishDataset, isLoading: isPublishing } = usePublishDataset({ onSuccess, onError });
    const { mutate: deactivateDataset, isLoading: isDeletingDataset } = useDeactivateDataset({ onSuccess, onError });
    const { mutate: downloadDataset, isLoading: isDownloadingDataset } = useDownloadDataset();
    const { mutate: createInclinationJob, isLoading: isCreatingJob } = useCreateInclinationJob({ onSuccess, onError });

    const handlePublishDataset = () => {
        publishDataset({ service_type: selectedDataset.data_type, tdei_dataset_id: selectedDataset.tdei_dataset_id });
    };

    const handleDeactivate = () => {
        deactivateDataset(selectedDataset.tdei_dataset_id);
    };

    const handleCreateInclinationJob = () => {
        createInclinationJob(selectedDataset.tdei_dataset_id);
    };

    const handleDownloadDataset = (dataset) => {
        downloadDataset({ tdei_dataset_id: dataset.tdei_dataset_id, data_type: dataset.data_type });
    };

    const onAction = (eventKey, dataset) => {
        setSelectedDataset(dataset);
        setEventKey(eventKey);
        if (eventKey === 'editMetadata') {
            navigate('/EditMetadata', { state: { dataset } });
        } else if (eventKey === 'cloneDataset') {
            navigate('/CloneDataset', { state: { dataset } });
        } else if (eventKey === 'downLoadDataset') {
            handleDownloadDataset(dataset);
        } else {
            setShowSuccessModal(true);
        }
    };

    const handleRefresh = () => {
        refreshData();
    };

    const handleDropdownSelect = (eventKey) => {
        const sortData = (dataToSort, key) => {
            return [...dataToSort].sort((a, b) => {
                const aValue = key === 'metadata.dataset_detail.name'
                    ? a?.metadata?.dataset_detail?.name ?? ''
                    : a[key] ?? '';
                const bValue = key === 'metadata.dataset_detail.name'
                    ? b?.metadata?.dataset_detail?.name ?? ''
                    : b[key] ?? '';

                return aValue.localeCompare(bValue);
            });
        };

        let sorted = [];
        if (eventKey === 'status') {
            sorted = sortData(sortedData, 'status');
        } else if (eventKey === 'type') {
            sorted = sortData(sortedData, 'data_type');
        } else if (eventKey === 'asc') {
            sorted = sortData(sortedData, 'metadata.dataset_detail.name');
        }

        setSortedData(sorted);
    };
    // Modal configuration based on eventKey
    const modalConfig = {
        release: {
            message: `Are you sure you want to release dataset ${selectedDataset?.metadata?.data_provenance?.full_dataset_name}?`,
            content: "Release job will take around 4 to 6 hours. You can find the status in the jobs page.",
            handler: handlePublishDataset,
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
            default:
                return "";
        }
    };
      // To show Project ID search if the user is an admin
      const debouncedHandleProjectIdSearch = React.useMemo(
        () => debounce((e) => setDebounceProjectId(e.target.value), 300),
        []
    );

    return (
        <div>
            <Form noValidate>
                <div className='mt-4 mb-3'>
                    <div className={style.filterWrapper}>
                        <div className={style.filtersContainer}>
                            <div className={style.filterSection}>
                                <Form.Control
                                    className={style.customFormControl}
                                    aria-label="Text input with dropdown button"
                                    placeholder="Search Dataset"
                                    onChange={(e) => {
                                        setQuery(e.target.value);
                                        debouncedHandleSearch(e);
                                    }}
                                />
                            </div>
                            {isAdmin && (
                                <div className={style.filterSection}>
                                    <Form.Control
                                        className={style.customFormControl}
                                        aria-label="Search Project ID"
                                        placeholder="Search Project ID"
                                        onChange={debouncedHandleProjectIdSearch}
                                    />
                                </div>
                            )}
                            <div className={style.filterSection}>
                                <Form.Control
                                    className={style.customFormControl}
                                    aria-label="Search Service ID"
                                    placeholder="Search By Service ID"
                                    onChange={(e) => setTdeiServiceId(e.target.value)}
                                />
                            </div>
                            <div className={style.filterSection}>
                                <div className={style.filterLabel}>Type</div>
                                <div className={style.filterField}>
                                    <Select
                                        isSearchable={false}
                                        defaultValue={{ label: "All", value: "" }}
                                        onChange={handleSelectedDataType}
                                        options={options}
                                        components={{
                                            IndicatorSeparator: () => null
                                        }}
                                    />
                                </div>
                            </div>
                            <div className={style.filterSection}>
                                <div className={style.filterLabel}>Status</div>
                                <div className={style.filterField}>
                                    <Select
                                        isSearchable={false}
                                        defaultValue={{ label: "All", value: "" }}
                                        onChange={handleSelectedStatus}
                                        options={statusOptions}
                                        components={{
                                            IndicatorSeparator: () => null
                                        }}
                                    />
                                </div>
                            </div>
                            <div className={style.dateSection}>
                                <DatePicker
                                    label="Valid From"
                                    onChange={(date) => handleChangeDatePicker(date, setValidFrom)}
                                    dateValue={validFrom}
                                />
                                <IconButton aria-label="clear valid from" onClick={() => {
                                    setValidFrom(null);
                                    refreshData();
                                }}>
                                    <ClearIcon />
                                </IconButton>
                            </div>
                            <div className={style.dateSection}>
                                <DatePicker
                                    label="Valid To"
                                    onChange={(date) => handleChangeDatePicker(date, setValidTo)}
                                    dateValue={validTo}
                                />
                                <IconButton aria-label="clear valid to" onClick={() => {
                                    setValidTo(null);
                                    refreshData();
                                }}>
                                    <ClearIcon />
                                </IconButton>
                            </div>
                        </div>
                        <div className={style.sortContainer}>
                            <SortRefreshComponent
                                handleRefresh={handleRefresh}
                                handleSortChange={handleSortChange}
                                sortField={sortField}
                                sortOrder={sortOrder}
                            />
                        </div>
                    </div>
                </div>
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
