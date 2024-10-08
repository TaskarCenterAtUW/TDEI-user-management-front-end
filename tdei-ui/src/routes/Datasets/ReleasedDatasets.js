import React, { useState, useEffect } from 'react';
import DatasetTableHeader from "./DatasetTableHeader";
import DatasetRow from "./DatasetRow";
import DatasetsActions from "./DatasetsActions";
import { useQueryClient } from 'react-query';
import { useAuth } from '../../hooks/useAuth';
import { GET_DATASETS } from '../../utils';
import { debounce } from "lodash";
import Typography from '@mui/material/Typography';
import { Button, Form, Spinner, Col, Row } from "react-bootstrap";
import style from "./Datasets.module.css"
import Select from 'react-select';
import iconNoData from "./../../assets/img/icon-noData.svg";
import { toPascalCase, formatDate } from '../../utils';
import SortRefreshComponent from './SortRefreshComponent';
import useGetReleasedDatasets from '../../hooks/service/useGetReleaseDatasets';
import useDownloadDataset from '../../hooks/datasets/useDownloadDataset';
import { useNavigate } from 'react-router-dom';


const ReleasedDatasets = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [, setQuery] = useState("");
  const [debounceQuery, setDebounceQuery] = useState("");
  const [dataType, setDataType] = useState("");
  const [sortedData, setSortedData] = useState([]);
  const [eventKey, setEventKey] = useState("");
  const navigate = useNavigate();
  const [debounceProjectId, setDebounceProjectId] = useState("");

  const {
    data = [],
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
    refreshData
  } = useGetReleasedDatasets(debounceQuery, dataType, debounceProjectId);

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

  // Options for data type dropdown
  const options = [
    { value: '', label: 'All' },
    { value: 'flex', label: 'Flex' },
    { value: 'pathways', label: 'Pathways' },
    { value: 'osw', label: 'OSW' },
  ];
  const { mutate: downloadDataset, isLoading: isDownloadingDataset } = useDownloadDataset();
  const handleDownloadDataset = (dataset) => {
    downloadDataset({tdei_dataset_id : dataset.tdei_dataset_id, data_type: dataset.data_type});
};
  // Event handler for selecting action button on a dataset
  const onInspect = () => {}

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

  return (
    <div>
      <Form noValidate>
        <div className='my-4'>
          <div className="d-flex justify-content-between">

            <div className='d-flex'>
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
                <Form.Control
                  className={style.customFormControl}
                  aria-label="Search Project ID"
                  placeholder="Search Project ID" 
                  onChange={debouncedHandleProjectIdSearch}  
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
                    styles={{ container: (provided) => ({ ...provided, width: '80%' }) }}
                  />
                </div>
              </div>
            </div>

            <div className='d-flex align-items-center'>
              <SortRefreshComponent handleRefresh={handleRefresh} handleDropdownSelect={handleDropdownSelect} isReleasedDataset={true} />
            </div>
          </div>
        </div>

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
