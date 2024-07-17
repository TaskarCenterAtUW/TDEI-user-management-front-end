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

const MyDatasets = () => {
    const queryClient = useQueryClient();
    const [query, setQuery] = useState("");
    const [debounceQuery, setDebounceQuery] = useState("");
    const [dataType, setDataType] = useState("");
    const [status, setStatus] = useState("All");
    const [sortedData, setSortedData] = useState([]);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [selectedDataset, setSelectedDataset] = useState(null);
    const [open, setOpen] = useState(false);
    const [eventKey, setEventKey] = useState("");
    const [operationResult, setOperationResult] = useState("");
    const { data = [], isError, hasNextPage, fetchNextPage, isFetchingNextPage, isLoading, refreshData } = useGetDatasets(debounceQuery, status, dataType);
    const navigate = useNavigate();

    useEffect(() => {
        if (data && data.pages && data.pages.length > 0) {
            const allData = data.pages.reduce((acc, page) => [...acc, ...page.data], []);
            setSortedData(allData);
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

    const onSuccess = (data) => {
        setOperationResult("success");
        setShowSuccessModal(false);
        handleToast();
        queryClient.invalidateQueries({ queryKey: [GET_DATASETS] });
    };

    const onError = (err) => {
        console.error("error message", err);
        setShowSuccessModal(false);
        handleToast();
        setOperationResult("error");
    };

    const { isLoading: isPublishing, mutate } = usePublishDataset({ onSuccess, onError });
    const { mutate: deactivateDataset, isLoading: isDeletingDataset } = useDeactivateDataset({ onSuccess, onError });
    const { mutate: downloadDataset, isLoading: isDownloadingDataset } = useDownloadDataset();

    const handlePublishDataset = () => {
        mutate({ service_type: selectedDataset.data_type, tdei_dataset_id: selectedDataset.tdei_dataset_id });
    };

    const handleDeactivate = () => {
        deactivateDataset(selectedDataset.tdei_dataset_id);
    };
    const handleDownloadDataset = (dataset) => {
        downloadDataset({tdei_dataset_id : dataset.tdei_dataset_id, data_type: dataset.data_type});
    };

    const onAction = (eventKey, dataset) => {
        setSelectedDataset(dataset);
        setEventKey(eventKey);
        if(eventKey === 'editMetadata'){
            navigate('/EditMetadata', { state: { dataset } });
        } else if(eventKey === 'cloneDataset'){
            navigate('/CloneDataset',{ state: { dataset } });
        
        }  else if(eventKey === 'cloneDataset'){
            navigate('/CloneDataset',{ state: { dataset } });
        }else if(eventKey === 'downLoadDataset'){
            handleDownloadDataset(dataset)
        }
        else {
            setShowSuccessModal(true);
        }
    };

    const handleRefresh = () => {
        refreshData();
    };

    const handleDropdownSelect = (eventKey) => {
        if (eventKey === 'status') {
            const sorted = [...sortedData].sort((a, b) => a.status.localeCompare(b.status));
            setSortedData(sorted);
        } else if (eventKey === 'type') {
            const sorted = [...sortedData].sort((a, b) => a.data_type.localeCompare(b.data_type));
            setSortedData(sorted);
        } else if (eventKey === 'asc') {
            const sorted = [...sortedData].sort((a, b) => a.metadata.data_provenance.full_dataset_name.localeCompare(b.metadata.data_provenance.full_dataset_name));
            setSortedData(sorted);
        }
    };

    const handleToast = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Form noValidate>
                <div className='mt-4 mb-3'>
                    <div className="d-flex justify-content-between flex-wrap">
                        <div className='d-flex mb-2'>
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
                        </div>
                        <div className='d-flex align-items-center mb-2'>
                            <SortRefreshComponent handleRefresh={handleRefresh} handleDropdownSelect={handleDropdownSelect} isReleasedDataset={false} />
                        </div>
                    </div>
                </div>
                <DatasetTableHeader isReleasedDataList={false} />
                {data.pages?.map((values, i) => (
                    <React.Fragment key={i}>
                        {values?.data?.length === 0 ? (
                            <div className="d-flex align-items-center mt-2">
                                <img
                                    src={iconNoData}
                                    className={style.noDataIcon}
                                    alt="no-data-icon"
                                />
                                <div className={style.noDataText}>No Dataset found..!</div>
                            </div>
                        ) : null}
                        {sortedData.map((list, index) => (
                            <DatasetRow
                                key={index}
                                dataset={list}
                                onAction={onAction}
                                isReleasedList={false}
                            />
                        ))}
                    </React.Fragment>
                ))}
                {isError ? " Error loading datasets" : null}
                {isLoading ? (
                    <div className="d-flex justify-content-center">
                        <Spinner size="md" />
                    </div>
                ) : null}
                {hasNextPage ? (
                    <Button
                        className="tdei-primary-button"
                        onClick={() => fetchNextPage()}
                        disabled={isFetchingNextPage || isError || !hasNextPage}
                    >
                        Load More {isFetchingNextPage && <Spinner size="sm" />}
                    </Button>
                ) : null}
                <CustomModal
                    show={showSuccessModal}
                    message={eventKey === 'release' ? `Are you sure you want to release dataset ${selectedDataset?.metadata?.data_provenance?.full_dataset_name}?` : `Are you sure you want to deactivate dataset ${selectedDataset?.metadata?.data_provenance?.full_dataset_name}?`}
                    content={eventKey === 'release' ? "Release job will take around 4 to 6 hours. You can find the status in the jobs page." : "Deactivation will remove the dataset from the system."}
                    handler={eventKey === 'release' ? handlePublishDataset : handleDeactivate}
                    btnlabel={eventKey === 'release' ? "Release" : "Deactivate"}
                    modaltype={eventKey === 'release' ? "release" : "deactivate"}
                    onHide={() => setShowSuccessModal(false)}
                    title={eventKey === 'release' ? "Release Dataset" : "Deactivate Dataset"}
                    isLoading={isPublishing || isDeletingDataset}
                />
                <ResponseToast
                    showtoast={open}
                    handleClose={handleClose}
                    type={operationResult === "success" ? "success" : "error"}
                    message={eventKey === 'release' ? (operationResult === "success" ? "Success! Dataset release job has been initiated." : "Error! Failed to initiate dataset release job.") : (operationResult === "success" ? "Success! Dataset has been deactivated." : "Error! Failed to deactivate dataset.")}
                />
            </Form>
        </div>
    );
};

export default MyDatasets;
