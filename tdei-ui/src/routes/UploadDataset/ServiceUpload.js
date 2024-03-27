import React from 'react';
import style from "./../Services/Services.module.css"
import Typography from '@mui/material/Typography';
import { Button, Form, Spinner, Col, Row } from "react-bootstrap";
import { useAuth } from "../../hooks/useAuth";
import { debounce } from "lodash";
import useGetServices from "../../hooks/service/useGetServices";
import { useQueryClient } from "react-query";
import { GET_SERVICES } from "../../utils";
import iconNoData from "./../../assets/img/icon-noData.svg";
import Select from 'react-select';
import ServicesList from './ServicesList';

// Functional component for Service Upload
const ServiceUpload = ({ selectedData, onSelectedServiceChange }) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [, setQuery] = React.useState("");
  const [debounceQuery, setDebounceQuery] = React.useState("");
  const [serviceType, setServiceType] = React.useState("");
  const [selectedService, setSelectedService] = React.useState({});

  // Fetching services data using custom hook
  const {
    data = [],
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
  } = useGetServices(debounceQuery, user?.isAdmin, serviceType);

  // Event handler for selecting service type from dropdown
  const handleSelect = (value) => {
    queryClient.invalidateQueries({ queryKey: [GET_SERVICES] });
    setServiceType(value.value);
  };
  // Event handler for selecting a service
  const handleSelectedService = (id) => {
    setSelectedService(id);
    onSelectedServiceChange(id)
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
      <div style={{ marginBottom: "15px" }}>
        <Typography variant="h6" sx={{
          font: 'normal normal bold 16px/18px Lato',
          color: '#162848'
        }}>
          Select Service<span style={{ color: 'red' }}> *</span>
        </Typography>
      </div>
      <>
        <Form noValidate>
          <div className="row" style={{ marginBottom: "15px" }}>
            <div className="col-md-4 pr-1">
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
            <div className="col-md-1 d-flex align-items-end justify-content-center">
              <Form.Label>Type</Form.Label>
            </div>
            <div className="col-md-4 pr-1">
              <Select
                isSearchable={false}
                defaultValue={{ label: "All", value: "" }}
                onChange={handleSelect}
                options={options}
                components={{
                  IndicatorSeparator: () => null
                }}
                styles={{ container: (provided) => ({ ...provided, width: '80%' }) }}
              />
            </div>
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
                  <div className={style.noDataText}>No service found..!</div>
                </div>
              ) : null}
              {values?.data?.map((list) => (
                <ServicesList
                  key={list.tdei_service_id}
                  id={list.tdei_service_id}
                  name={list.service_name}
                  isSelected={selectedData && selectedData.length > 0 ? selectedData === list.tdei_service_id : selectedService === list.tdei_service_id}
                  serviceType={list.service_type}
                  handleSelectedService={handleSelectedService}
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
      </>
    </div>
  );
}

export default ServiceUpload;