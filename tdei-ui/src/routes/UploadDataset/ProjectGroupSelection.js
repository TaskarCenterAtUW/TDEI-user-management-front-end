import React, { useState, useEffect } from 'react';
import style from "./../Services/Services.module.css";
import { Button, Form, Spinner } from "react-bootstrap";
import { debounce } from "lodash";
import iconNoData from "./../../assets/img/icon-noData.svg";
import ProjectGroupsList from './ProjectGroupsList';
import useGetProjectGroupRoles from '../../hooks/roles/useProjectGroupRoles';
import useGetProjectGroups from '../../hooks/projectGroup/useGetProjectGroups';
import { useAuth } from '../../hooks/useAuth';

const ProjectGroupSelection = ({ selectedData, onSelectedProjectGroupChange}) => {
  const [, setQuery] = useState("");
  const [debounceQuery, setDebounceQuery] = useState("");
  const [selectedProjectGroup, setSelectedProjectGroup] = useState({});
  const { user } = useAuth();
  const isAdmin = user?.isAdmin;

  const adminProjectGroups = useGetProjectGroups(debounceQuery, false);
  const userProjectGroups = useGetProjectGroupRoles(debounceQuery);

  // Fetching project groups list data using custom hook
  const {
    data = [],
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
  } = isAdmin ? adminProjectGroups : userProjectGroups;


  // Event handler for selecting a project group
  const handleSelectedProjectGroup = (list) => {
    setSelectedProjectGroup(list);
    onSelectedProjectGroupChange({
      tdei_project_group_id: list.tdei_project_group_id,
      roles: list.roles,
      project_group_name: list.project_group_name
    });
  };

  // Event handler for searching project groups
  const handleSearch = (e) => {
    setDebounceQuery(e.target.value);
  };
  // Debounced event handler for searching project groups
  const debouncedHandleSearch = React.useMemo(
    () => debounce(handleSearch, 300),
    []
  );


  return (
    <div>
      <div className='mb-3'>
        <div className={style.stepComponentTitle}>
          Select Project Group<span style={{ color: 'red' }}> *</span>
        </div>
      </div>
      <>
        <Form noValidate>
          <div className="d-flex align-items-center mb-3">
            <div className="d-flex align-items-center me-4">
              <Form.Control
                id='search_project_group'
                className={style.customFormControl}
                aria-label="Search Project Group"
                placeholder="Search Project Group"
                onChange={(e) => {
                  setQuery(e.target.value);
                  debouncedHandleSearch(e);
                }}
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
                    alt=""
                  />
                  <div className={style.noDataText}>No project groups found.</div>
                </div>
              ) : null}
              {values?.data?.map((list) => (
                <ProjectGroupsList
                  key={list.tdei_project_group_id}
                  id={list.tdei_project_group_id}
                  name={list.project_group_name}
                  isSelected={ selectedData != null ? selectedData.tdei_project_group_id === list.tdei_project_group_id : selectedProjectGroup.tdei_project_group_id === list.tdei_project_group_id}
                  handleSelectedProjectGroup={() => handleSelectedProjectGroup(list)}
                />
              ))}
            </React.Fragment>
          ))}
          {isError ? " Error loading projects group list" : null}
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

export default ProjectGroupSelection;
