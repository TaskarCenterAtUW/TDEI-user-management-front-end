import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Form, Spinner, InputGroup } from "react-bootstrap";
import useGetAllServices from "../../hooks/service/useGetAllServices";
import styles from "./ServiceAutocomplete.module.css";
import { debounce } from "lodash";
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';

const ServiceAutocomplete = ({ serviceSearchText, setServiceSearchText, onSelectService, isAdmin, service_type }) => {
  const [debouncedValue, setDebouncedValue] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const { loading, error, serviceList, hasMore, setPageNumber } = useGetAllServices(debouncedValue, isAdmin, service_type);
  const [selectedService, setSelectedService] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [announcement, setAnnouncement] = useState("");
  
  const observer = useRef();
  const autocompleteRef = useRef();
  const listRef = useRef();

  const debouncedSearch = useMemo(
    () =>
      debounce((value) => {
        if (value.length >= 3) {
          setDebouncedValue(value);
          setPageNo(1);
          setPageNumber(1);
        }
      }, 150),
    [setPageNumber]
  );

  useEffect(() => {
    if (serviceSearchText === "") {
      setSelectedService(null);
      setShowDropdown(false);
    }
  }, [serviceSearchText]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setServiceSearchText(value);
    if (value.trim() === "") {
      setSelectedService(null);
      onSelectService(null);
      setShowDropdown(false);
      return;
    }
    debouncedSearch(value);
    setShowDropdown(true);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!showDropdown || deduplicatedServiceItems.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < deduplicatedServiceItems.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < deduplicatedServiceItems.length) {
        handleSelect(deduplicatedServiceItems[highlightedIndex]);
      }
    } else if (e.key === "Escape" || e.key === "Tab") {
      if (e.key === "Tab") e.preventDefault();
      setShowDropdown(false);
      setHighlightedIndex(-1);
    }
  };

  // Scroll highlighted item into view AFTER render
  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const item = listRef.current.children[highlightedIndex];
      if (item) item.scrollIntoView({ block: "nearest" });
    }
  }, [highlightedIndex]);

  const deduplicatedServiceItems = useMemo(() => {
    const seen = new Set();
    return (serviceList || []).filter(service => {
      if (seen.has(service.tdei_service_id)) return false;
      seen.add(service.tdei_service_id);
      return true;
    });
  }, [serviceList]);

  // Announce result count to screen readers when dropdown opens
  useEffect(() => {
    if (showDropdown && !loading && deduplicatedServiceItems.length > 0) {
      setAnnouncement(
        `${deduplicatedServiceItems.length} result${
          deduplicatedServiceItems.length === 1 ? "" : "s"
        } available. Use arrow keys to navigate.`
      );
    } else if (showDropdown && !loading && deduplicatedServiceItems.length === 0) {
      setAnnouncement("No services found.");
    } else {
      setAnnouncement("");
    }
  }, [showDropdown, loading, deduplicatedServiceItems.length]);

  const lastServiceElementRef = useCallback((node) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPageNo((prevPageNo) => prevPageNo + 1);
        setPageNumber((prev) => prev + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore, setPageNumber]);

  const handleSelect = (service) => {
    setSelectedService(service);
    setServiceSearchText(service.service_name);
    setShowDropdown(false);
    setHighlightedIndex(-1);
    onSelectService(service.tdei_service_id);
  };

  const handleClearSelection = () => {
    setSelectedService(null);
    setServiceSearchText("");
    onSelectService(null);
    setShowDropdown(false);
  };

  const handleClickOutside = useCallback((e) => {
    if (autocompleteRef.current && !autocompleteRef.current.contains(e.target)) {
      setShowDropdown(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      debouncedSearch.cancel();
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside, debouncedSearch]);

  const listboxId = "service-listbox";
  const activeDescendant =
    highlightedIndex >= 0 && deduplicatedServiceItems[highlightedIndex]
      ? `svc-option-${deduplicatedServiceItems[highlightedIndex].tdei_service_id}`
      : undefined;
  const isExpanded = showDropdown && deduplicatedServiceItems.length > 0;

  return (
    <div className={styles.autocompleteContainer} ref={autocompleteRef}>
      {/* Live region — screen readers announce results count */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        style={{ position: "absolute", width: "1px", height: "1px", overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap" }}
      >
        {announcement}
      </div>

      <InputGroup>
        <Form.Control
          type="text"
          id="service-search"
          placeholder="Search Service"
          onChange={handleInputChange}
          value={selectedService ? selectedService.service_name : serviceSearchText}
          onFocus={() => setShowDropdown(true)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={isExpanded}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-activedescendant={activeDescendant}
          aria-label="Search Service"
        />
        {loading && (
          <InputGroup.Text>
            <Spinner animation="border" size="sm" aria-label="Loading results" />
          </InputGroup.Text>
        )}
      </InputGroup>

      {showDropdown && deduplicatedServiceItems.length > 0 && (
        <div
          role="listbox"
          id={listboxId}
          aria-label="Services"
          className={styles.dropdownList}
          ref={listRef}
          tabIndex="-1"
        >
          {deduplicatedServiceItems.map((service, index) => {
            const optionId = `svc-option-${service.tdei_service_id}`;
            const isSelected = selectedService?.tdei_service_id === service.tdei_service_id;
            return (
              <div
                key={service.tdei_service_id}
                id={optionId}
                role="option"
                aria-selected={isSelected}
                className={`${styles.dropdownItem} ${
                  highlightedIndex === index
                    ? styles.highlighted
                    : isSelected
                    ? styles.active
                    : ""
                }`}
                onClick={() => handleSelect(service)}
                ref={deduplicatedServiceItems.length === index + 1 ? lastServiceElementRef : null}
              >
                {service.service_name}
              </div>
            );
          })}
        </div>
      )}
      {showDropdown && deduplicatedServiceItems.length === 0 && !loading && (
        <div className={styles.noResults} role="status">No services found.</div>
      )}
    </div>
  );
};

export default React.memo(ServiceAutocomplete);
