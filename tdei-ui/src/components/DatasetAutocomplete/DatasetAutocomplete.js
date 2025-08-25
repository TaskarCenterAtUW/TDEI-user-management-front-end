import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Form, Spinner, InputGroup } from "react-bootstrap";
import { debounce } from "lodash";
import styles from '../ProjectAutocomplete/ProjectAutocomplete.module.css'; 
import useGetDatasetsAutocomplete from "../../hooks/datasets/useGetDatasetsAutocomplete";
import IconButton from "@mui/material/IconButton";
import ClearIcon from "@mui/icons-material/Clear";

const DatasetAutocomplete = ({
  selectedDatasetId,
  datasetSearchText,
  setDatasetSearchText,
  onSelectDataset,
  placeholder = "Search Dataset",
  minChars = 3,
}) => {
  const [localText, setLocalText] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const [selectedDataset, setSelectedDataset] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const observer = useRef();
  const autocompleteRef = useRef();

  // Debounce user input
  const debouncedSearch = useMemo(
    () =>
      debounce((value) => {
        if (value.length >= minChars) {
          setDebouncedValue(value);
          setPageNo(1);
        } else {
          setDebouncedValue("");
        }
      }, 150),
    [minChars]
  );

    const handleInputChange = (e) => {
        const value = e.target.value;
        setDatasetSearchText(value);

        if (selectedDataset) setSelectedDataset(null);
        if (typeof onSelectDataset === "function") onSelectDataset(null);

        if (value.trim() === "") {
            setShowDropdown(false);
            setDebouncedValue("");
            return;
        }

        debouncedSearch(value);
        setShowDropdown(true);
    };


  const { loading, datasetList, hasMore } = useGetDatasetsAutocomplete(debouncedValue, pageNo);

  const deduplicatedDatasets = useMemo(() => {
    const seen = new Set();
    return (datasetList || []).filter((ds) => {
      const id = ds.tdei_dataset_id;
      if (!id || seen.has(id)) return false;
      seen.add(id);
      return true;
    });
  }, [datasetList]);

  const lastDataset = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNo((prev) => prev + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const labelFor = (ds) =>
    ds?.metadata?.data_provenance?.full_dataset_name || ds?.tdei_dataset_id || "Unnamed Dataset";

 const handleSelect = (ds) => {
  setSelectedDataset(ds);
  setDatasetSearchText(labelFor(ds)); 
  setShowDropdown(false);
  onSelectDataset(ds.tdei_dataset_id || null);
};


  const handleClickOutside = useCallback(
    (e) => {
      if (autocompleteRef.current && !autocompleteRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    },
    [autocompleteRef]
  );

  const clearAll = () => {
    setSelectedDataset(null);
    setLocalText("");
    setDatasetSearchText("");
    onSelectDataset(null);
    setShowDropdown(false);
    setDebouncedValue("");
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      debouncedSearch.cancel();
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside, debouncedSearch]);

const inputValue = datasetSearchText;

  return (
    <div className={styles.autocompleteContainer} ref={autocompleteRef}>
      <InputGroup>
        <Form.Control
          type="text"
          placeholder={placeholder}
          onChange={handleInputChange}
          value={inputValue}
          onFocus={() => setShowDropdown(true)}
          autoComplete="off"
        />
        {inputValue && (
          <InputGroup.Text>
            <IconButton size="small" onClick={clearAll}>
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

      {showDropdown && deduplicatedDatasets.length > 0 && (
        <div className={styles.dropdownList}>
          {deduplicatedDatasets.map((ds, idx) => {
            const content = (
              <>
                <div className={styles.primaryText}>{labelFor(ds)}</div>
              </>
            );

            const isActive = selectedDataset?.tdei_dataset_id === ds.tdei_dataset_id;

            if (deduplicatedDatasets.length === idx + 1) {
              return (
                <div
                  key={ds.tdei_dataset_id}
                  id={ds.tdei_dataset_id}
                  className={`${styles.dropdownItem} ${isActive ? styles.active : ""}`}
                  onClick={() => handleSelect(ds)}
                  ref={lastDataset}
                >
                  {content}
                </div>
              );
            }

            return (
              <div
                key={ds.tdei_dataset_id}
                id={ds.tdei_dataset_id}
                className={`${styles.dropdownItem} ${isActive ? styles.active : ""}`}
                onClick={() => handleSelect(ds)}
              >
                {content}
              </div>
            );
          })}
          {loading && (
            <div className="d-flex justify-content-center my-2">
              <Spinner size="sm" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default React.memo(DatasetAutocomplete);
