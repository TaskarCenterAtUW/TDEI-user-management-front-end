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
  id,
}) => {
  const [localText, setLocalText] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const [selectedDataset, setSelectedDataset] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [announcement, setAnnouncement] = useState("");

  const observer = useRef();
  const autocompleteRef = useRef();
  const listRef = useRef();

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
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!showDropdown || deduplicatedDatasets.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < deduplicatedDatasets.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < deduplicatedDatasets.length) {
        handleSelect(deduplicatedDatasets[highlightedIndex]);
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

  // Announce result count to screen readers when dropdown opens
  useEffect(() => {
    if (showDropdown && !loading && deduplicatedDatasets.length > 0) {
      setAnnouncement(
        `${deduplicatedDatasets.length} result${
          deduplicatedDatasets.length === 1 ? "" : "s"
        } available. Use arrow keys to navigate.`
      );
    } else if (showDropdown && !loading && deduplicatedDatasets.length === 0) {
      setAnnouncement("No datasets found.");
    } else {
      setAnnouncement("");
    }
  }, [showDropdown, loading, deduplicatedDatasets.length]);

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
    setHighlightedIndex(-1);
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
  const listboxId = id ? `${id}-listbox` : "dataset-listbox";
  const activeDescendant =
    highlightedIndex >= 0 && deduplicatedDatasets[highlightedIndex]
      ? `${listboxId}-option-${deduplicatedDatasets[highlightedIndex].tdei_dataset_id}`
      : undefined;
  const isExpanded = showDropdown && deduplicatedDatasets.length > 0;

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
          id={id}
          type="text"
          placeholder={placeholder}
          onChange={handleInputChange}
          value={inputValue}
          onFocus={() => setShowDropdown(true)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={isExpanded}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-activedescendant={activeDescendant}
          aria-label={placeholder}
        />
        {inputValue && (
          <InputGroup.Text>
            <IconButton size="small" onClick={clearAll} aria-label="Clear selection">
              <ClearIcon fontSize="small" />
            </IconButton>
          </InputGroup.Text>
        )}
        {loading && (
          <InputGroup.Text>
            <Spinner animation="border" size="sm" aria-label="Loading results" />
          </InputGroup.Text>
        )}
      </InputGroup>

      {showDropdown && deduplicatedDatasets.length > 0 && (
        <div
          role="listbox"
          id={listboxId}
          aria-label="Datasets"
          className={styles.dropdownList}
          ref={listRef}
          tabIndex="-1"
        >
          {deduplicatedDatasets.map((ds, idx) => {
            const optionId = `${listboxId}-option-${ds.tdei_dataset_id}`;
            const isHighlighted = highlightedIndex === idx;
            const isActive = selectedDataset?.tdei_dataset_id === ds.tdei_dataset_id;

            return (
              <div
                key={ds.tdei_dataset_id}
                id={optionId}
                role="option"
                aria-selected={isActive}
                className={`${styles.dropdownItem} ${
                  isHighlighted ? styles.highlighted : isActive ? styles.active : ""
                }`}
                onClick={() => handleSelect(ds)}
                ref={deduplicatedDatasets.length === idx + 1 ? lastDataset : null}
              >
                <div className={styles.primaryText}>{labelFor(ds)}</div>
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
