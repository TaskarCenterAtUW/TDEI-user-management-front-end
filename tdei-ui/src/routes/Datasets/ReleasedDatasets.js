import React, { useState, useEffect, useCallback } from 'react';
import DatasetTableHeader from "./DatasetTableHeader";
import DatasetRow from "./DatasetRow";
import { useQueryClient } from 'react-query';
import { useAuth } from '../../hooks/useAuth';
import { debounce } from "lodash";
import { Button, Form, Spinner, Col, Row } from "react-bootstrap";
import style from "./Datasets.module.css";
import Select from 'react-select';
import iconNoData from "./../../assets/img/icon-noData.svg";
import { toPascalCase, formatDate } from '../../utils';
import SortRefreshComponent from './SortRefreshComponent';
import useGetReleasedDatasets from '../../hooks/service/useGetReleaseDatasets';
import useDownloadDataset from '../../hooks/datasets/useDownloadDataset';
import { useNavigate } from 'react-router-dom';
import DatePicker from '../../components/DatePicker/DatePicker';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';
import dayjs from 'dayjs';
import ProjectAutocomplete from './../../components/ProjectAutocomplete/ProjectAutocomplete';
import ServiceAutocomplete from '../../components/ServiceAutocomplete/ServiceAutocomplete';
import DownloadModal from '../../components/DownloadModal/DownloadModal';
import ResponseToast from '../../components/ToastMessage/ResponseToast';

const ReleasedDatasets = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [isLoadingDownload, setIsLoadingDownload] = useState(false);
  const [query, setQuery] = useState("");
  const [debounceQuery, setDebounceQuery] = useState("");
  const [datasetIdQuery, setDatasetIdQuery] = useState("");
  const [debounceDatasetIdQuery, setDebounceDatasetIdQuery] = useState("");
  const [dataType, setDataType] = useState("");
  const [sortedData, setSortedData] = useState([]);
  const [eventKey, setEventKey] = useState("");
  const navigate = useNavigate();
  const [projectGroupId, setProjectGroupId] = useState("");
  const [tdeiServiceId, setTdeiServiceId] = useState("");
  const [sortField, setSortField] = useState('uploaded_timestamp');
  const [sortOrder, setSortOrder] = useState('DESC');
  // Date range state
  const [validFrom, setValidFrom] = useState(null);
  const [validTo, setValidTo] = useState(null);
  const [selectedDataset, setSelectedDataset] = useState(null);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState(null);
  const [selectedFileVersion, setSelectedFileVersion] = useState(null);
  const [open, setOpen] = useState(false);
  const [operationResult, setOperationResult] = useState("");
  const [customErrorMessage, setCustomErrorMessage] = useState("");


  // Options for data type dropdown
  const options = [
    { value: '', label: 'All' },
    { value: 'flex', label: 'Flex' },
    { value: 'pathways', label: 'Pathways' },
    { value: 'osw', label: 'OSW' },
  ];

  const {
    data = [],
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
    refreshData
  } = useGetReleasedDatasets(
    debounceQuery,
    debounceDatasetIdQuery,
    dataType,
    projectGroupId,
    validFrom,
    validTo,
    tdeiServiceId,
    sortField,
    sortOrder
  );

  useEffect(() => {
    // Check if data is available and update sortedData
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
    refreshData();
  };

  // Event handler for searching services
  const handleSearch = (e) => {
    setDebounceQuery(e.target.value);
  };

  // Debounced event handler for searching services
  const debouncedHandleSearch = React.useMemo(
    () => debounce(handleSearch, 300),
    []
  );

  const { mutate: downloadDataset, isLoading: isDownloadingDataset } = useDownloadDataset({
    onSuccess: () => {
      setIsLoadingDownload(false);
      setShowDownloadModal(false);
      setOperationResult("success");
      handleToast();
      setSelectedFormat(null);
      setSelectedFileVersion(null);
    },
    onError: (err) => {
      console.error("Error downloading dataset:", err);
      setIsLoadingDownload(false);
      setShowDownloadModal(false);
      setOperationResult("error");
      setCustomErrorMessage(err.data || showDownloadModal ? "Only latest version of the file can be downloaded" : 'An unexpected error occurred');
      handleToast();
      setSelectedFormat(null);
      setSelectedFileVersion(null);
    }
  });


  const handleDownloadDataset = (dataset) => {
    setIsLoadingDownload(true);
    if (selectedDataset && selectedDataset.data_type === 'osw') {
      // Set default format as 'osw' and version as 'latest' if not selected
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
  // Event handler for selecting action button on a dataset
  const onInspect = () => { }

  const handleRefresh = () => {
    // Logic for refreshing
    refreshData();
  };

  const onAction = (eventKey, dataset) => {
    setSelectedDataset(dataset);
    setEventKey(eventKey);
    if (eventKey === 'downLoadDataset' && dataset.data_type === 'osw') {
      setShowDownloadModal(true);
    } else if (eventKey === 'downLoadDataset') {
      handleDownloadDataset(dataset);
    } else if (eventKey === 'cloneDataset') {
      navigate('/CloneDataset', { state: { dataset } });
    }
  };
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
  const formatOptions = [
    { value: 'osm', label: 'OSM' },
    { value: 'osw', label: 'OSW' }
  ];

  const fileVersionOptions = [
    { value: 'latest', label: 'Latest' },
    { value: 'original', label: 'Original' }
  ];

  const handleToast = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const getToastMessage = () => {
    switch (eventKey) {
      case 'downLoadDataset':
        return operationResult === "success"
          ? "Success! Download has been initiated."
          : customErrorMessage;
      default:
        return "";
    }
  };

  // Callback to handle project group selection from ProjectAutocomplete
  const handleProjectGroupSelect = useCallback((selectedId) => {
    setProjectGroupId(selectedId || "");
    refreshData();
  }, [refreshData]);

  // Callback to handle service selection from ServiceAutocomplete
  const handleServiceSelect = useCallback((serviceId) => {
    setTdeiServiceId(serviceId || "");
    refreshData();
  }, [refreshData]);


  // Debounced event handler for searching dataset ID
  const handleDatasetIdSearch = (e) => {
    setDebounceDatasetIdQuery(e.target.value);
  };
  const debouncedHandleDatasetIdSearch = React.useMemo(
    () => debounce(handleDatasetIdSearch, 300),
    []
  );

  return (
    <div>
      <Form noValidate>
        <Row className="mb-3 d-flex justify-content-start" style={{ marginTop: '20px' }}>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Type</Form.Label>
              <Select
                isSearchable={false}
                defaultValue={{ label: "All", value: "" }}
                onChange={handleSelectedDataType}
                options={options}
                components={{ IndicatorSeparator: () => null }}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <SortRefreshComponent
              handleRefresh={handleRefresh}
              handleSortChange={handleSortChange}
              sortField={sortField}
              sortOrder={sortOrder}
            />
          </Col>
        </Row>
        <Row className="mb-3 d-flex justify-content-start">
          <Col md={4} className="mb-2">
            <Form.Group>
              <Form.Control
                aria-label="Search Dataset"
                placeholder="Search Dataset"
                onChange={(e) => {
                  setQuery(e.target.value);
                  debouncedHandleSearch(e);
                }}
              />
            </Form.Group>
          </Col>
          <Col md={4} className="mb-2">
            <Form.Group>
              <ProjectAutocomplete
                onSelectProjectGroup={handleProjectGroupSelect}
              />
            </Form.Group>
          </Col>
          <Col md={4} className="mb-2">
            <Form.Group>
              <ServiceAutocomplete
                onSelectService={handleServiceSelect}
                isAdmin={true}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-4">

          <Col md={4}>
            <Form.Group>
              <Form.Control
                aria-label="Search by Dataset ID"
                placeholder="Search by Dataset ID"
                onChange={(e) => {
                  setDatasetIdQuery(e.target.value);
                  debouncedHandleDatasetIdSearch(e);
                }}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="d-flex align-items-center">
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
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="d-flex align-items-center">
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
            </Form.Group>
          </Col>
        </Row>

        <DatasetTableHeader isReleasedDataList={true} />

        {isLoading ? (  // Show loading spinner if still loading
          <div className="d-flex justify-content-center">
            <Spinner size="md" />
          </div>
        ) : sortedData.length > 0 ? (  // Show datasets if available
          sortedData.map((list, index) => (
            <DatasetRow
              key={list.tdei_dataset_id}
              dataset={list}
              onAction={onAction}
              isReleasedList={true}
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

        {isError ? "Error loading datasets" : null}

        {hasNextPage && !isLoading && (
          <Button
            className="tdei-primary-button"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage || isError || !hasNextPage}
          >
            Load More {isFetchingNextPage && <Spinner size="sm" />}
          </Button>
        )}
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

export default ReleasedDatasets;
