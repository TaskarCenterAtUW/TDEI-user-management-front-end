import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Form, Spinner, InputGroup } from "react-bootstrap";
import useGetProjectGroupRoles from "../../hooks/roles/useProjectGroupRoles";
import styles from "./ProjectGroupRolesPicker.module.css";
import { debounce } from "lodash";

const ProjectGroupRolesPicker = ({
  searchText,
  setSearchText,
  onSelectProjectGroup,
  defaultProjectGroupId,
  defaultProjectGroupName,
}) => {
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [announcement, setAnnouncement] = useState("");
  const [initialized, setInitialized] = useState(false);

  const autocompleteRef = useRef();
  const listRef = useRef();

  const { data, isLoading } = useGetProjectGroupRoles(debouncedQuery);

  const projectGroups = useMemo(() => {
    const seen = new Set();
    return (data?.pages?.flatMap((page) => page.data) || []).filter((pg) => {
      if (seen.has(pg.tdei_project_group_id)) return false;
      seen.add(pg.tdei_project_group_id);
      return true;
    });
  }, [data]);

  useEffect(() => {
    if (!initialized && defaultProjectGroupId && defaultProjectGroupName) {
      setSelectedGroup({
        tdei_project_group_id: defaultProjectGroupId,
        project_group_name: defaultProjectGroupName,
      });
      setSearchText(defaultProjectGroupName);
      setInitialized(true);
    }
  }, [defaultProjectGroupId, defaultProjectGroupName, initialized, setSearchText]);

  useEffect(() => {
    if (searchText === "") {
      if (defaultProjectGroupId && defaultProjectGroupName) {
        setSelectedGroup({
          tdei_project_group_id: defaultProjectGroupId,
          project_group_name: defaultProjectGroupName,
        });
        setSearchText(defaultProjectGroupName);
      } else {
        setSelectedGroup(null);
      }
      setShowDropdown(false);
    }
  }, [searchText, defaultProjectGroupId, defaultProjectGroupName, setSearchText]);

  const debouncedSearch = useMemo(
    () => debounce((value) => setDebouncedQuery(value), 150),
    []
  );

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchText(value);
    if (value.trim() === "") {
      setSelectedGroup(null);
      onSelectProjectGroup(null);
      setShowDropdown(false);
      return;
    }
    debouncedSearch(value);
    setShowDropdown(true);
    setHighlightedIndex(-1);
  };

  const handleSelect = (group) => {
    setSelectedGroup(group);
    setSearchText(group.project_group_name);
    setShowDropdown(false);
    setHighlightedIndex(-1);
    onSelectProjectGroup(group.tdei_project_group_id);
  };

  const handleKeyDown = (e) => {
    if (!showDropdown || projectGroups.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < projectGroups.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0 && projectGroups[highlightedIndex]) {
        handleSelect(projectGroups[highlightedIndex]);
      }
    } else if (e.key === "Escape" || e.key === "Tab") {
      if (e.key === "Tab") e.preventDefault();
      setShowDropdown(false);
      setHighlightedIndex(-1);
    }
  };

  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const item = listRef.current.children[highlightedIndex];
      if (item) item.scrollIntoView({ block: "nearest" });
    }
  }, [highlightedIndex]);

  useEffect(() => {
    if (showDropdown && !isLoading && projectGroups.length > 0) {
      setAnnouncement(
        `${projectGroups.length} result${projectGroups.length === 1 ? "" : "s"} available. Use arrow keys to navigate.`
      );
    } else if (showDropdown && !isLoading && projectGroups.length === 0) {
      setAnnouncement("No project groups found.");
    } else {
      setAnnouncement("");
    }
  }, [showDropdown, isLoading, projectGroups.length]);

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

  const listboxId = "project-group-roles-listbox";
  const activeDescendant =
    highlightedIndex >= 0 && projectGroups[highlightedIndex]
      ? `pg-option-${projectGroups[highlightedIndex].tdei_project_group_id}`
      : undefined;
  const isExpanded = showDropdown && projectGroups.length > 0;

  return (
    <div className={styles.autocompleteContainer} ref={autocompleteRef}>
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        style={{
          position: "absolute",
          width: "1px",
          height: "1px",
          overflow: "hidden",
          clip: "rect(0,0,0,0)",
          whiteSpace: "nowrap",
        }}
      >
        {announcement}
      </div>

      <InputGroup>
        <Form.Control
          type="text"
          placeholder="Search Project Group"
          onChange={handleInputChange}
          value={selectedGroup ? selectedGroup.project_group_name : searchText}
          onFocus={() => {
            setDebouncedQuery("");
            setShowDropdown(true);
          }}
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
        {isLoading && (
          <InputGroup.Text>
            <Spinner animation="border" size="sm" aria-label="Loading results" />
          </InputGroup.Text>
        )}
      </InputGroup>

      {showDropdown && projectGroups.length > 0 && (
        <div
          role="listbox"
          id={listboxId}
          aria-label="Project Groups"
          className={styles.dropdownList}
          ref={listRef}
          tabIndex="-1"
        >
          {projectGroups.map((group, index) => {
            const optionId = `pg-option-${group.tdei_project_group_id}`;
            const isSelected =
              selectedGroup?.tdei_project_group_id === group.tdei_project_group_id;
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
              >
                {group.project_group_name}
              </div>
            );
          })}
        </div>
      )}
      {showDropdown && projectGroups.length === 0 && !isLoading && (
        <div className={styles.noResults} role="status">
          No project groups found.
        </div>
      )}
    </div>
  );
};

export default React.memo(ProjectGroupRolesPicker);
