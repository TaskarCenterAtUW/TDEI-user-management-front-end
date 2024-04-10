import React, { useState } from 'react';
import DatasetTableHeader from "./DatasetTableHeader";
import DatasetRow from "./DatasetRow";
import DatasetsActions from "./DatasetsActions";
import { useQueryClient } from 'react-query';
import { useAuth } from '../../hooks/useAuth';
import useGetDatasets from '../../hooks/service/useGetDatasets';
import { GET_DATASETS } from '../../utils';
import { debounce } from "lodash";
import Typography from '@mui/material/Typography';
import { Button, Form, Spinner, Col, Row } from "react-bootstrap";
import style from "./Datasets.module.css"
import Select from 'react-select';
import iconNoData from "./../../assets/img/icon-noData.svg";
import { toPascalCase, formatDate } from '../../utils';
import PaginationComponent from '../../components/PaginationComponent/PaginationComponent';



const MyDatasets = () => {
    const queryClient = useQueryClient();
    const { user } = useAuth();
    const [, setQuery] = React.useState("");
    const [debounceQuery, setDebounceQuery] = React.useState("");
    const [dataType, setDataType] = React.useState("");
    const [status, setStatus] = React.useState("");
    
    const {
      data = [],
      isError,
      hasNextPage,
      fetchNextPage,
      isFetchingNextPage,
      isLoading,
    } = useGetDatasets(debounceQuery, status, dataType);

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
  return (
    <div>
     <Form noValidate>
        <div style={{marginTop:"20px",marginBottom:"20px"}}>
        <div className="row" style={{ marginBottom: "15px" }}>
            <div className="col-md-3 pr-1">
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
            <div className="col-md-1 d-flex align-items-end justify-content-center">
              <Form.Label>Type</Form.Label>
            </div>
            <div className="col-md-2 pr-1">
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
            <div className="col-md-1 d-flex align-items-end justify-content-center">
              <Form.Label>Status</Form.Label>
            </div>
            <div className="col-md-2 pr-1">
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
          </div>
        </div> 
        <DatasetTableHeader />
          {data?.pages?.map((values, i) => (
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
                 {values?.data?.map((list) => (
                 <DatasetRow 
                 datasetName = {list.name}
                  version = {list.version}
                   type = {toPascalCase(list.data_type)} 
                   collectionDate = {formatDate(list.collection_date)}
                   status = {list.status}
                   onInspect = {onInspect} 
                   onAction = {onAction}
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
          <PaginationComponent />
        </Form>
    </div>
  );
};

export default MyDatasets;
