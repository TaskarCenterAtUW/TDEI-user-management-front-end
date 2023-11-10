import React, { useState, useRef, useCallback } from "react";
import Dropdown from "./Dropdown";
import useGetProjectGroup from "../../hooks/projectGroup/useGetProjectGroup";

const ProjectGrpList = ({ field, form }) => {
  const [searchText, setSearchText] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const { loading, projectGrpList, hasMore } = useGetProjectGroup(searchText, pageNo);

  const observer = useRef();
  const lastProjectGrpListRef = useCallback(
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

  const handleSearch = (value) => {
    setSearchText(value);
    setPageNo(1);
  };

  const handleChange = (projectGrpList) => {
    form.setFieldValue(field.name, projectGrpList?.tdei_project_group_id);
  };
  return (
    <Dropdown
      isSearchable
      placeHolder="Select Project Group"
      options={projectGrpList}
      onChange={handleChange}
      onSearchText={handleSearch}
      searchText={searchText}
      setSearchText={setSearchText}
      lastProjectGrpListRef={lastProjectGrpListRef}
      loading={loading}
      field={field}
      form={form}
    />
  );
};

export default ProjectGrpList;
