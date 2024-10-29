import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Form, Spinner, InputGroup } from "react-bootstrap";
import useGetAllServices from "../../hooks/service/useGetAllServices";
import styles from "./ServiceAutocomplete.module.css";
import { debounce } from "lodash";
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';

const ServiceAutocomplete = ({ onSelectService, isAdmin, service_type }) => {
  const [searchText, setSearchText] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const [debouncedValue, setDebouncedValue] = useState("");
  const { loading, error, serviceList, hasMore, setPageNumber } = useGetAllServices(debouncedValue, isAdmin, service_type);
  const [selectedService, setSelectedService] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const observer = useRef();
  const autocompleteRef = useRef();

  const debouncedSearch = useMemo(
    () =>
      debounce((value) => {
        // Only trigger search if input has at least 3 characters
        if (value.length >= 3) {  
          setDebouncedValue(value);
          setPageNo(1);
          setPageNumber(1);
        }
      }, 150), 
    [setPageNumber]
  );

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchText(value);
    if (value.trim() === "") {
      setSelectedService(null);
      onSelectService(null);
      setSearchText("");
      setShowDropdown(false);
      return;
    }
    debouncedSearch(value);
    setShowDropdown(true);
  };

  const deduplicatedServiceItems = useMemo(() => {
    const seen = new Set();
    return (serviceList || []).filter(service => {
      if (seen.has(service.tdei_service_id)) {
        return false;
      }
      seen.add(service.tdei_service_id);
      return true;
    });
  }, [serviceList]);

  const lastServiceElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNo((prevPageNo) => prevPageNo + 1);
          setPageNumber(prev => prev + 1); 
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, setPageNumber]
  );

  const handleSelect = (service) => {
    setSelectedService(service);
    onSelectService(service.tdei_service_id); 
    setShowDropdown(false);
  };

  const handleClearSelection = () => {
    setSelectedService(null);
    onSelectService(null);
    setSearchText("");
    setShowDropdown(false);
  };

  const handleClickOutside = useCallback(
    (e) => {
      if (autocompleteRef.current && !autocompleteRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    },
    [autocompleteRef]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      debouncedSearch.cancel(); 
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside, debouncedSearch]);

  return (
    <div className={styles.autocompleteContainer} ref={autocompleteRef}>
      <InputGroup>
        <Form.Control
          type="text"
          placeholder="Search Service"
          onChange={handleInputChange}
          value={selectedService ? selectedService.service_name : searchText}
          onFocus={() => setShowDropdown(true)}
          autoComplete="off"
        />
        {selectedService && (
          <InputGroup.Text>
            <IconButton
              aria-label="clear selection"
              onClick={handleClearSelection}
              size="small"
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          </InputGroup.Text>
        )}
        {loading && (
          <InputGroup.Text>
            <Spinner animation="border" size="sm" />
          </InputGroup.Text>
        )}
      </InputGroup>
      {showDropdown && deduplicatedServiceItems.length > 0 && (
        <div className={styles.dropdownList}>
          {deduplicatedServiceItems.map((service, index) => {
            if (deduplicatedServiceItems.length === index + 1) {
              return (
                <div
                  key={service.tdei_service_id}
                  className={`${styles.dropdownItem} ${
                    selectedService?.tdei_service_id === service.tdei_service_id ? styles.active : ""
                  }`}
                  onClick={() => handleSelect(service)}
                  ref={lastServiceElementRef}
                >
                  {service.service_name}
                </div>
              );
            } else {
              return (
                <div
                  key={service.tdei_service_id}
                  className={`${styles.dropdownItem} ${
                    selectedService?.tdei_service_id === service.tdei_service_id ? styles.active : ""
                  }`}
                  onClick={() => handleSelect(service)}
                >
                  {service.service_name}
                </div>
              );
            }
          })}
          {loading && (
            <div className="d-flex justify-content-center my-2">
              <Spinner size="sm" />
            </div>
          )}
        </div>
      )}
      {showDropdown && deduplicatedServiceItems.length === 0 && !loading && (
        <div className={styles.noResults}>No services found.</div>
      )}
    </div>
  );
};

export default React.memo(ServiceAutocomplete);
