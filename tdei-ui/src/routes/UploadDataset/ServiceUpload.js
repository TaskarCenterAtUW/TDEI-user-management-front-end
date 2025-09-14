import React, { useState, useEffect } from 'react';
import style from "./../Services/Services.module.css";
import { Button, Form, Spinner } from "react-bootstrap";
import { useAuth } from "../../hooks/useAuth";
import { debounce } from "lodash";
import useGetServices from "../../hooks/service/useGetServices";
import { useQueryClient } from "react-query";
import { GET_SERVICES } from "../../utils";
import iconNoData from "./../../assets/img/icon-noData.svg";
import Select from 'react-select';
import ServicesList from './ServicesList';

const ServiceUpload = ({ selectedData, onSelectedServiceChange, dataset, fromCloneDataset }) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [, setQuery] = useState("");
  const [debounceQuery, setDebounceQuery] = useState("");
  const [serviceType, setServiceType] = useState(fromCloneDataset ? dataset ? dataset.data_type : "" : "");
  const [selectedService, setSelectedService] = useState({});
  const [previousProjectGroupId, setPreviousProjectGroupId] = useState( selectedData && selectedData.tdei_project_group_id ? selectedData.tdei_project_group_id :"");

  // Fetching services data using custom hook
  const {
    data = [],
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
  } = useGetServices(debounceQuery, user?.isAdmin, serviceType,false,selectedData?.tdei_project_group_id,fromCloneDataset);

  // Event handler for selecting a service
  const handleSelectedService = (list) => {
    setPreviousProjectGroupId(list.tdei_project_group_id);
    setSelectedService(list);
    onSelectedServiceChange({
      tdei_project_group_id: list.tdei_project_group_id,
      tdei_service_id: list.tdei_service_id,
      service_type: list.service_type,
      project_group_name: selectedData?.project_group_name ?? ""
    });
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
  // Options for service type dropdown
  const options = [
    { value: 'flex', label: 'Flex' },
    { value: 'pathways', label: 'Pathways' },
    { value: 'osw', label: 'Osw' },
  ];

  return (
    <div>
      <div className='mb-3'>
        {fromCloneDataset ? (
          <div className={style.stepComponentTitle}>
            Select Service from <span className={style.highlightedText}>{selectedData.project_group_name} :</span>
            <span style={{ color: 'red' }}> *</span>
          </div>
        ) : (
          <div className={style.stepComponentTitle}>
            Select Service<span style={{ color: 'red' }}> *</span>
          </div>
        )}
      </div>
      <>
        <Form noValidate>
          <div className="d-flex align-items-center mb-3 flex-wrap gap-3">
            <div className={style.serviceFilterBlock}>
              <Form.Control
                className={style.customFormControl}
                aria-label="Text input with dropdown button"
                placeholder="Search Service"
                onChange={(e) => {
                  setQuery(e.target.value);
                  debouncedHandleSearch(e);
                }}
              />
            </div>
            {!fromCloneDataset && (
              <div className={style.serviceFilterBlock}>
                <div>Type</div>
                <div className={style.selectServiceFilter}>
                  <Select
                    isSearchable={false}
                    defaultValue={{ label: "All", value: "" }}
                    onChange={(value) => {
                      queryClient.invalidateQueries({ queryKey: [GET_SERVICES] });
                      setServiceType(value.value);
                    }}
                    options={options}
                    components={{
                      IndicatorSeparator: () => null
                    }}
                    // styles={{ container: (provided) => ({ ...provided, width: '80%' }) }}
                  />
                </div>
              </div>
            )}
          </div>

          {data?.pages?.map((values, i) => (
            <React.Fragment key={i}>
              {values?.data?.length === 0 ? (
                <div className="d-flex align-items-center mt-2">
                  <img
                    src={iconNoData}
                    className={style.noDataIcon}
                    alt="no-data-icon"
                  />
                  <div className={style.noDataText}>No services found. Please try changing project group!</div>
                </div>
              ) : null}
              {values?.data?.map((list) => (
                <ServicesList
                  key={list.tdei_service_id}
                  id={list.tdei_service_id}
                  name={list.service_name}
                  isSelected={ selectedData != null ? selectedData.tdei_service_id === list.tdei_service_id : selectedService.tdei_service_id === list.tdei_service_id}
                  serviceType={list.service_type}
                  handleSelectedService={() => handleSelectedService(list)}
                />
              ))}
            </React.Fragment>
          ))}
          {isError ? " Error loading services list" : null}
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
      </>
    </div>
  );
}

export default ServiceUpload;
