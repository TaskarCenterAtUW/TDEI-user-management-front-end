import React, { useEffect } from "react";
import { Dropdown } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getSelectedProjectGroup } from "../../selectors";
import { set } from "../../store";
import style from "./ProjectGroupSwitcher.module.css";
import useGetProjectGroupRoles from "../../hooks/roles/useProjectGroupRoles";
import { clear } from "../../store";

const ProjectGroupSwitcherDropDown = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const selectedProjectGroup = useSelector(getSelectedProjectGroup);
  const { data = [] } = useGetProjectGroupRoles();

  // // Load initial value from localStorage when component mounts
  useEffect(() => {
    const savedProjectGroup = JSON.parse(localStorage.getItem("selectedProjectGroup"));

    // Load from localStorage only if Redux doesn't have a project selected
    if (savedProjectGroup && !selectedProjectGroup?.tdei_project_group_id) {
      dispatch(set(savedProjectGroup));
    }
    // Only run this check if data has been fetched
    if (selectedProjectGroup?.tdei_project_group_id && data?.pages?.length > 0) {
      const projectExists = data.pages.some(page =>
        page.data.some(proj => proj.tdei_project_group_id === selectedProjectGroup.tdei_project_group_id)
      );
      // Only clear selection if the project is confirmed to be deleted
      if (!projectExists) {
        dispatch(clear());
      }
    }
  }, [dispatch, selectedProjectGroup, data]);


  // Sync Redux when localStorage changes (cross-tab updates)
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "selectedProjectGroup") {
        const updatedProjectGroup = JSON.parse(event.newValue);
        if (updatedProjectGroup && updatedProjectGroup.tdei_project_group_id !== selectedProjectGroup?.tdei_project_group_id) {
          dispatch(set(updatedProjectGroup));
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [dispatch, selectedProjectGroup?.tdei_project_group_id]);

  // Auto-select the first available project group if none is selected
  useEffect(() => {
    const isEmptyObject = (obj) => Object.keys(obj).length === 0;
    if (
      (selectedProjectGroup === null || isEmptyObject(selectedProjectGroup)) &&
      data?.pages?.[0]?.data?.length > 0
    ) {
      const firstProjectGroup = data.pages[0].data[0];
      if (firstProjectGroup) {
        dispatch(set(firstProjectGroup));
      }
    }
  }, [data, dispatch, selectedProjectGroup]);

  return (
    <div style={{ marginRight: "1rem" }}>
      <div className={style.projectGroupLabel}>Project Group</div>
      <Dropdown className={style.customDropdown} align="end">
        <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
          <div className={style.selectedProjectGroupName}>
            {selectedProjectGroup?.name || "Select Project Group"}
          </div>
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Header>{selectedProjectGroup?.name || "Switch Project Group"}</Dropdown.Header>
          <Dropdown.Item onClick={() => navigate("/projectGroupSwitch")}>
            Switch Project Group
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
  <button
    type="button"
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
    className={style.customElement}
  >
    {children}
    <div>
      <span data-arrow="downArrow">&#x25bc;</span>
      <span data-arrow="upArrow">&#x25B2;</span>
    </div>
  </button>
));

export default ProjectGroupSwitcherDropDown;
