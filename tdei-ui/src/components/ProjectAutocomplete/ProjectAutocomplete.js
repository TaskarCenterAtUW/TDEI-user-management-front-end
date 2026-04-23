import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Form, Spinner, InputGroup } from "react-bootstrap";
import useGetProjectGroup from "../../hooks/projectGroup/useGetProjectGroup";
import styles from "./ProjectAutocomplete.module.css";
import { debounce } from "lodash";
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';

const ProjectAutocomplete = ({ selectedProjectGroupId, projectSearchText, setProjectSearchText, onSelectProjectGroup }) => {
  const [searchText, setSearchText] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const { loading, projectGroupList, hasMore } = useGetProjectGroup(debouncedValue, pageNo);
  const [selectedProjectGroup, setSelectedProjectGroup] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [announcement, setAnnouncement] = useState("");

  const observer = useRef();
  const autocompleteRef = useRef();
  const listRef = useRef();

  const debouncedSearch = useMemo(
    () =>
      debounce((value) => {
        // Only trigger search if input has at least 3 characters
        if (value.length >= 3) {
          setDebouncedValue(value);
          setPageNo(1);
        }
      }, 150),
    []
  );

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchText(value); 
    setProjectSearchText(value);
    // If the input is cleared, reset the search and hide the dropdown
    if (value.trim() === "") {
      setSelectedProjectGroup(null);
      onSelectProjectGroup(null);
      setSearchText("");
      setShowDropdown(false);
      return;
    }
    debouncedSearch(value);
    setShowDropdown(true);
    setHighlightedIndex(-1);
  }

  const handleKeyDown = (e) => {
    if (!showDropdown || deduplicatedProjectGroups.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < deduplicatedProjectGroups.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < deduplicatedProjectGroups.length) {
        handleSelect(deduplicatedProjectGroups[highlightedIndex]);
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

  const deduplicatedProjectGroups = useMemo(() => {
    const seen = new Set();
    return (projectGroupList || []).filter(group => {
      if (seen.has(group.tdei_project_group_id)) {
        return false;
      }
      seen.add(group.tdei_project_group_id);
      return true;
    });
  }, [projectGroupList]);

  // Announce result count to screen readers when dropdown opens
  useEffect(() => {
    if (showDropdown && !loading && deduplicatedProjectGroups.length > 0) {
      setAnnouncement(
        `${deduplicatedProjectGroups.length} result${
          deduplicatedProjectGroups.length === 1 ? "" : "s"
        } available. Use arrow keys to navigate.`
      );
    } else if (showDropdown && !loading && deduplicatedProjectGroups.length === 0) {
      setAnnouncement("No project groups found.");
    } else {
      setAnnouncement("");
    }
  }, [showDropdown, loading, deduplicatedProjectGroups.length]);

  const lastProjectGroup = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNo((prevPageNumber) => prevPageNumber + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const handleSelect = (projectGroup) => {
    setSelectedProjectGroup(projectGroup);
    setProjectSearchText(projectGroup.project_group_name);
    setShowDropdown(false);
    setHighlightedIndex(-1);
    onSelectProjectGroup(projectGroup.tdei_project_group_id);
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

  const listboxId = "project-group-listbox";
  const activeDescendant =
    highlightedIndex >= 0 && deduplicatedProjectGroups[highlightedIndex]
      ? `pg-option-${deduplicatedProjectGroups[highlightedIndex].tdei_project_group_id}`
      : undefined;
  const isExpanded = showDropdown && deduplicatedProjectGroups.length > 0;

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
          id="projectGroup-search"
          placeholder="Search Project Group"
          onChange={handleInputChange}
          value={selectedProjectGroup && selectedProjectGroupId ? selectedProjectGroup.project_group_name : projectSearchText}
          onFocus={() => setShowDropdown(true)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={isExpanded}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-activedescendant={activeDescendant}
          aria-label="Search Project Group"
        />
        {loading && (
          <InputGroup.Text>
            <Spinner animation="border" size="sm" aria-label="Loading results" />
          </InputGroup.Text>
        )}
      </InputGroup>

      {showDropdown && deduplicatedProjectGroups.length > 0 && (
        <div
          role="listbox"
          id={listboxId}
          aria-label="Project Groups"
          className={styles.dropdownList}
          ref={listRef}
          tabIndex="-1"
        >
          {deduplicatedProjectGroups.map((group, index) => {
            const optionId = `pg-option-${group.tdei_project_group_id}`;
            const isSelected = selectedProjectGroup?.tdei_project_group_id === group.tdei_project_group_id;
            return (
              <div
                key={group.tdei_project_group_id}
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
                onClick={() => handleSelect(group)}
                ref={deduplicatedProjectGroups.length === index + 1 ? lastProjectGroup : null}
              >
                {group.project_group_name}
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
      {showDropdown && deduplicatedProjectGroups.length === 0 && !loading && (
        <div className={styles.noResults} role="status">No project groups found.</div>
      )}
    </div>
  );
};

export default React.memo(ProjectAutocomplete);
