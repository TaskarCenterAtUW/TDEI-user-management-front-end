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


const ReleasedDatasets = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [, setQuery] = React.useState("");
  const [debounceQuery, setDebounceQuery] = React.useState("");
  const [dataType, setDataType] = React.useState("");
  const [sortedData, setSortedData] = useState([]);
  const [eventKey, setEventKey] = useState("");

  const {
    data = [],
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
    refreshData
  } = useGetReleasedDatasets(debounceQuery,dataType);

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
    // Logic for handling dropdown selection
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
  const onAction = (eventKey, dataset) => {
    setEventKey(eventKey);
   if(eventKey === 'downLoadDataset'){
        handleDownloadDataset(dataset)
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
                <SortRefreshComponent handleRefresh={handleRefresh} handleDropdownSelect={handleDropdownSelect} isReleasedDataset={true}/>
            </div>

          </div>
        </div>

        <DatasetTableHeader isReleasedDataList={true}/>
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
             {sortedData.map((list, index) => (
               <DatasetRow 
               key={index}
               dataset={list}
               onAction={onAction}
               isReleasedList={true}
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

export default ReleasedDatasets;
