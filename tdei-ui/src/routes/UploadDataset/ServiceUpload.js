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
  } = useGetServices(debounceQuery, user?.isAdmin, serviceType);

  // Effect to reset selected service if project group ID changes
  useEffect(() => {
    if (Array.isArray(data.pages) && data.pages.length > 0) {
      const firstPageData = data.pages[0]?.data ?? [];
      const newProjectGroupId = firstPageData.length > 0 ? firstPageData[0]?.tdei_project_group_id : "";
      if (!user.isAdmin && newProjectGroupId !== previousProjectGroupId) {
          setSelectedService({
            tdei_project_group_id: "",
            tdei_service_id: "",
            service_type: ""
          });
          setPreviousProjectGroupId(newProjectGroupId);
          onSelectedServiceChange({
            tdei_project_group_id: "",
            tdei_service_id: "",
            service_type: ""
          });
        }
      }
  }, [data]);

  // Event handler for selecting a service
  const handleSelectedService = (list) => {
    setPreviousProjectGroupId(list.tdei_project_group_id);
    setSelectedService(list);
    onSelectedServiceChange({
      tdei_project_group_id: list.tdei_project_group_id,
      tdei_service_id: list.tdei_service_id,
      service_type: list.service_type
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
        <div className={style.stepComponentTitle}>
          Select Service<span style={{ color: 'red' }}> *</span>
        </div>
      </div>
      <>
        <Form noValidate>
          <div className="d-flex align-items-center mb-3">
            <div className="d-flex align-items-center me-4">
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
              <div className="d-flex align-items-center">
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
                    styles={{ container: (provided) => ({ ...provided, width: '80%' }) }}
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
