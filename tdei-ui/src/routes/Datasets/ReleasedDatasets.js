import React, { useState, useEffect } from 'react';
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

const ReleasedDatasets = () => {
  const [, setQuery] = useState("");
  const [debounceQuery, setDebounceQuery] = useState("");
  const [dataType, setDataType] = useState("");
  const [sortedData, setSortedData] = useState([]);
  const [eventKey, setEventKey] = useState("");
  const navigate = useNavigate();
  const [debounceProjectId, setDebounceProjectId] = useState("");
  const [tdeiServiceId, setTdeiServiceId] = useState("");
  const [sortField, setSortField] = useState('uploaded_timestamp');
  const [sortOrder, setSortOrder] = useState('DESC');
  // Date range state
  const [validFrom, setValidFrom] = useState(null);
  const [validTo, setValidTo] = useState(null);

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
  } = useGetReleasedDatasets(debounceQuery, dataType, debounceProjectId, validFrom, validTo, tdeiServiceId, sortField, sortOrder);

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

  // Event handler for searching Project ID
  const debouncedHandleProjectIdSearch = React.useMemo(
    () => debounce((e) => {
      setDebounceProjectId(e.target.value);
    }, 300),
    []
  );

  const handleSelectedDataType = (value) => {
    setDataType(value.value);
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

  const { mutate: downloadDataset, isLoading: isDownloadingDataset } = useDownloadDataset();
  const handleDownloadDataset = (dataset) => {
    downloadDataset({ tdei_dataset_id: dataset.tdei_dataset_id, data_type: dataset.data_type });
  };
  // Event handler for selecting action button on a dataset
  const onInspect = () => { }

  const handleRefresh = () => {
    // Logic for refreshing
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

  const onAction = (eventKey, dataset) => {
    setEventKey(eventKey);
    if (eventKey === 'downLoadDataset') {
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
              <Form.Control
                aria-label="Search Project ID"
                placeholder="Search Project ID"
                onChange={debouncedHandleProjectIdSearch}
              />
            </Form.Group>
          </Col>
          <Col md={4} className="mb-2">
            <Form.Group>
              <Form.Control
                aria-label="Search Service ID"
                placeholder="Search By Service ID"
                onChange={(e) => setTdeiServiceId(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col md={12} className="d-flex align-items-center">
            <Form.Group className="mb-0 d-flex align-items-center" style={{ marginRight: '42px' }}>
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

            <Form.Group className="mb-0 d-flex align-items-center">
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
      </Form>
    </div>
  );
};

export default ReleasedDatasets;
