import React, { useState, useRef, useCallback } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import Form from "react-bootstrap/Form";
import useGetProjectGroup from "../../hooks/projectGroup/useGetProjectGroup";
import styles from "./ProjectGroupList.module.css"
import { Spinner } from "react-bootstrap";

const ProjectGroupList = ({ pocData, setPocData }) => {
  const [searchText, setSearchText] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const { loading, projectGroupList, hasMore } = useGetProjectGroup(searchText, pageNo);

  const observer = useRef();
  const lastProjectGroupList = useCallback(
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

  const handleClick = (e) => {
    setPocData({ ...pocData, tdei_project_group_id: e.target.id });
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
    setPageNo(1);
  };

  const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <div
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
      className={styles.dropdownMenu}
    >
      {children}
    </div>
  ));

  const CustomMenu = React.forwardRef(
    (
      {
        children,
        style,
        className,
        "aria-labelledby": labeledBy,
        handleSearch,
        searchText,
        test,
      },
      ref
    ) => {
      return (
        <div
          ref={ref}
          style={style}
          className={className}
          aria-labelledby={labeledBy}
        >
          <Form.Control
            autoFocus
            className="mx-3 my-2 w-auto"
            placeholder="Search Project Group"
            onChange={handleSearch}
            value={searchText}
          />
          <div className={styles.dropdownList}>{children}</div>
        </div>
      );
    }
  );

  return (
    <Dropdown>
      <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
        {pocData.tdei_project_group_id
          ? projectGroupList.find((val) => val.id === pocData.tdei_project_group_id)?.name
          : "Select Project Group"}
      </Dropdown.Toggle>
      <Dropdown.Menu
        as={CustomMenu}
        className={styles.dropdownBox}
        handleSearch={handleSearch}
        searchText={searchText}
      >
        {projectGroupList.map((val, index) => {
          if (projectGroupList.length === index + 1) {
            return (
              <Dropdown.Item
                id={val.id}
                onClick={handleClick}
                ref={lastProjectGroupList}
                key={val.id}
                active={pocData.tdei_project_group_id === val.id}
              >
                {val.name}
              </Dropdown.Item>
            );
          } else {
            return (
              <Dropdown.Item
                id={val.id}
                onClick={handleClick}
                key={val.id}
                active={pocData.tdei_project_group_id === val.id}
              >
                {val.name}
              </Dropdown.Item>
            );
          }
        })}
        {loading && (
          <div className="d-flex justify-content-center">
            <Spinner size="sm" />
          </div>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default ProjectGroupList;
