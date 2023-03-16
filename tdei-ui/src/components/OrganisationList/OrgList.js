import React, { useState, useRef, useCallback } from "react";
import useGetOrganisation from "../../hooks/organisation/useGetOrganisation";
import Dropdown from "./Dropdown";

const OrgList = ({ field, form }) => {
  const [searchText, setSearchText] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const { loading, orgList, hasMore } = useGetOrganisation(searchText, pageNo);

  const observer = useRef();
  const lastOrgListRef = useCallback(
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

  const handleChange = (orgList) => {
    form.setFieldValue(field.name, orgList?.tdei_org_id);
  };
  return (
    <Dropdown
      isSearchable
      placeHolder="Select Organization"
      options={orgList}
      onChange={handleChange}
      onSearchText={handleSearch}
      searchText={searchText}
      setSearchText={setSearchText}
      lastOrgListRef={lastOrgListRef}
      loading={loading}
      field={field}
      form={form}
    />
  );
};

export default OrgList;
