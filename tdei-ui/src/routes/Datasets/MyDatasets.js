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

const MyDatasets = () => {
  const queryClient = useQueryClient();
  const [, setQuery] = React.useState("");
  const [debounceQuery, setDebounceQuery] = React.useState("");
  const [dataType, setDataType] = React.useState("");
  const [status, setStatus] = React.useState("");
  const [sortedData, setSortedData] = useState([]);

  const {
    data = [],
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
    refreshData
  } = useGetDatasets(debounceQuery, status, dataType, false);

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
    { value: 'flex', label: 'Flex' },
    { value: 'pathways', label: 'Pathways' },
    { value: 'osw', label: 'Osw' },
  ];
  // Options for status type dropdown
  const statusOptions = [
    { value: 'All', label: 'All' },
    { value: 'Publish', label: 'Released' },
    { value: 'Pre-Release', label: 'Pre-Release' },
  ];

  // Event handler for selecting action button on a dataset
  const onInspect = () => {

  };
  // Event handler for selecting action button on a dataset
  const onAction = () => {

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
        <div style={{ marginTop: "20px", marginBottom: "20px" }}>
          <div className="row" style={{ marginBottom: "15px" }}>
            <div className="col-md-3">
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
            <div className="col-md-1 d-flex align-items-center justify-content-center">
              <Form.Label>Type</Form.Label>
            </div>
            <div className="col-md-2">
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
            <div className="col-md-1 d-flex align-items-center">
              <Form.Label>Status</Form.Label>
            </div>
            <div className="col-md-2 ">
              <Select
                isSearchable={false}
                defaultValue={{ label: "All", value: "" }}
                onChange={handleSelectedStatus}
                options={statusOptions}
                components={{
                  IndicatorSeparator: () => null
                }}
                styles={{ container: (provided) => ({ ...provided, width: '80%' }) }}
              />
            </div>
            <div className="col-md-2 offset-md-1 align-items-center justify-content-center">
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
                projectGroup={list.tdei_project_group_id}
              />
            ))}
          </React.Fragment>
        ))}
        {isError ? " Error loading project group list" : null}
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
