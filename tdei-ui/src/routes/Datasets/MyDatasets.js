import React, { useState, useEffect } from 'react';
import DatasetTableHeader from "./DatasetTableHeader";
import DatasetRow from "./DatasetRow";
import DatasetsActions from "./DatasetsActions";
import { useQueryClient } from 'react-query';
import useGetDatasets from '../../hooks/service/useGetDatasets';
import { GET_DATASETS } from '../../utils';
import { debounce } from "lodash";
import { Button, Form, Spinner, Col, Row } from "react-bootstrap";
import style from "./Datasets.module.css"
import Select from 'react-select';
import iconNoData from "./../../assets/img/icon-noData.svg";
import { toPascalCase, formatDate } from '../../utils';
import SortRefreshComponent from './SortRefreshComponent';
import usePublishDataset from '../../hooks/datasets/usePublishDataset';
import useDeactivateDataset from '../../hooks/datasets/useDeactivateDataset';

const MyDatasets = () => {
  const queryClient = useQueryClient();
  const [, setQuery] = React.useState("");
  const [debounceQuery, setDebounceQuery] = React.useState("");
  const [dataType, setDataType] = React.useState("");
  const [status, setStatus] = React.useState("All");
  const [sortedData, setSortedData] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = React.useState(false);

  const {
    data = [],
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
    refreshData
  } = useGetDatasets(debounceQuery, status, dataType);

  useEffect(() => {
    // Check if data is available and update sortedData
    if (data && data.pages && data.pages.length > 0) {
      const allData = data.pages.reduce((acc, page) => [...acc, ...page.data], []);
      setSortedData(allData);
    }
  }, [data]);
  // Event handler for selecting data type from dropdown
  const handleSelectedDataType = (value) => {
    queryClient.invalidateQueries({ queryKey: [GET_DATASETS] });
    setDataType(value.value);
  };
  // Event handler for selecting status from dropdown
  const handleSelectedStatus = (list) => {
    setStatus(list.value);
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
  // Options for status type dropdown
  const statusOptions = [
    { value: 'All', label: 'All' },
    { value: 'Publish', label: 'Released' },
    { value: 'Pre-Release', label: 'Pre-Release' },
  ];
  const onSuccess = (data) => {
    console.log("suucessfull", data);
    queryClient.invalidateQueries({ queryKey: [GET_DATASETS] });
  };
  const onError = (err) => {
    console.error("error message", err);
  };
  const { mutate } = usePublishDataset({ onSuccess, onError });

  const { mutate: deactivateDataset } =
  useDeactivateDataset({ onSuccess, onError });

  const handlePublishDataset = (value) => {
    mutate(value);
  };

  const handleDeactivate = (value) => {
    deactivateDataset(value);
  };

  // Event handler for selecting action button on a dataset
  const onInspect = () => {

  };
  // Event handler for selecting action button on a dataset
  const onAction = (eventKey,tdei_dataset_id) => {
    console.log("dataset id ->",tdei_dataset_id)
    if (eventKey === 'released') {
      console.log("event key dataset current action!!", eventKey)
    } else {
      console.log("event key dataset current action!!", eventKey)
    }
  };
  const handleRefresh = () => {
    // Logic for refreshing
    refreshData();
  };

  const handleDropdownSelect = (eventKey) => {
    // Logic for handling dropdown selection
    console.log('Dropdown item selected:', eventKey);
    if (eventKey === 'status') {
      // Sort by status in ascending order
      const sorted = [...sortedData].sort((a, b) => a.status.localeCompare(b.status));
      setSortedData(sorted);
    } else if (eventKey === 'type') {
      // Sort by type in ascending order
      const sorted = [...sortedData].sort((a, b) => a.data_type.localeCompare(b.data_type));
      setSortedData(sorted);
    } else if (eventKey === 'asc') {
      // Sort by name in ascending order
      const sorted = [...sortedData].sort((a, b) => a.name.localeCompare(b.name));
      setSortedData(sorted);
    }
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
                <SortRefreshComponent handleRefresh={handleRefresh} handleDropdownSelect={handleDropdownSelect} isReleasedDataset={false}/>
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
                datasetName={list.name}
                version={list.version}
                type={toPascalCase(list.data_type)}
                collectionDate={formatDate(list.collection_date)}
                status={list.status}
                onInspect={onInspect}
                onAction={onAction}
                isReleasedList={false}
                uploaded_time={list.uploaded_timestamp}
                tdei_dataset_id= {list.tdei_dataset_id}
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
      </Form>
    </div>
  );
};

export default MyDatasets;
