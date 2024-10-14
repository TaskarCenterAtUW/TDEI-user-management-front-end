import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Form, Spinner, InputGroup } from "react-bootstrap";
import useGetProjectGroup from "../../hooks/projectGroup/useGetProjectGroup";
import styles from "./ProjectAutocomplete.module.css";
import { debounce } from "lodash";
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';

const ProjectAutocomplete = ({ onSelectProjectGroup }) => {
  const [searchText, setSearchText] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const { loading, projectGroupList, hasMore } = useGetProjectGroup(searchText, pageNo);
  const [selectedProjectGroup, setSelectedProjectGroup] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const observer = useRef();
  const autocompleteRef = useRef();

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

  const debouncedSearch = useMemo(
    () =>
      debounce((value) => {
        setSearchText(value);
        setPageNo(1);
      }, 300), 
    []
  );

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSelectedProjectGroup(null); 
    onSelectProjectGroup(null); 
    setSearchText(value); 
    debouncedSearch(value);
    setShowDropdown(true);
  };

  const handleSelect = (projectGroup) => {
    setSelectedProjectGroup(projectGroup);
    setShowDropdown(false);
    onSelectProjectGroup(projectGroup.tdei_project_group_id);
    console.log("Selected Project Group ID:", projectGroup.tdei_project_group_id); 
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
          placeholder="Search Project Group"
          onChange={handleInputChange}
          value={selectedProjectGroup ? selectedProjectGroup.project_group_name : searchText}
          onFocus={() => setShowDropdown(true)}
          autoComplete="off"
        />
        {selectedProjectGroup && (
          <InputGroup.Text>
            <IconButton
              aria-label="clear selection"
              onClick={() => {
                setSelectedProjectGroup(null);
                onSelectProjectGroup(null);
                setSearchText("");
                setShowDropdown(false);
              }}
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
      {showDropdown && projectGroupList.length > 0 && (
        <div className={styles.dropdownList}>
          {projectGroupList.map((group, index) => {
            if (projectGroupList.length === index + 1) {
              return (
                <div
                  key={group.tdei_project_group_id}
                  id={group.tdei_project_group_id}
                  className={`${styles.dropdownItem} ${
                    selectedProjectGroup?.tdei_project_group_id === group.tdei_project_group_id ? styles.active : ""
                  }`}
                  onClick={() => handleSelect(group)}
                  ref={lastProjectGroup}
                >
                  {group.project_group_name}
                </div>
              );
            } else {
              return (
                <div
                  key={group.tdei_project_group_id}
                  id={group.tdei_project_group_id}
                  className={`${styles.dropdownItem} ${
                    selectedProjectGroup?.tdei_project_group_id === group.tdei_project_group_id ? styles.active : ""
                  }`}
                  onClick={() => handleSelect(group)}
                >
                  {group.project_group_name}
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
      {showDropdown && projectGroupList.length === 0 && !loading && (
        <div className={styles.noResults}>No project groups found.</div>
      )}
    </div>
  );
};

export default React.memo(ProjectAutocomplete);
