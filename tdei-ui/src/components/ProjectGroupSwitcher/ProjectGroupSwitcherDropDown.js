import React, { useEffect } from "react";
import { Dropdown } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getSelectedProjectGroup } from "../../selectors";
import { set } from "../../store";
import style from "./ProjectGroupSwitcher.module.css";
import useGetProjectGroupRoles from "../../hooks/roles/useProjectGroupRoles";
import { clear } from "../../store";
import iconArrowDown from "../../assets/img/icon-down-arrow.svg";
import iconArrowUp from "../../assets/img/icon-up-arrow.svg";
import iconSwitchProject from "../../assets/img/icon-switch-project.svg";
import iconProjectGroup from "../../assets/img/icon-prj-grp.svg";

const ProjectGroupSwitcherDropDown = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const selectedProjectGroup = useSelector(getSelectedProjectGroup);
  const { data = [] } = useGetProjectGroupRoles();

  // // // Load initial value from localStorage when component mounts
  // useEffect(() => {
  //   const savedProjectGroup = JSON.parse(localStorage.getItem("selectedProjectGroup"));

  //   // Load from localStorage only if Redux doesn't have a project selected
  //   if (savedProjectGroup && !selectedProjectGroup?.tdei_project_group_id) {
  //     dispatch(set(savedProjectGroup));
  //   }
  //   // Only run this check if data has been fetched
  //   if (selectedProjectGroup?.tdei_project_group_id && data?.pages?.length > 0) {
  //     const projectExists = data.pages.some(page =>
  //       page.data.some(proj => proj.tdei_project_group_id === selectedProjectGroup.tdei_project_group_id)
  //     );
  //     // Only clear selection if the project is confirmed to be deleted
  //     if (!projectExists) {
  //       dispatch(clear());
  //     }
  //   }
  // }, [dispatch, selectedProjectGroup, data]);


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
  // useEffect(() => {
  //   const isEmptyObject = (obj) => Object.keys(obj).length === 0;
  //   if (
  //     (selectedProjectGroup === null || isEmptyObject(selectedProjectGroup)) &&
  //     data?.pages?.[0]?.data?.length > 0
  //   ) {
  //     const firstProjectGroup = data.pages[0].data[0];
  //     if (firstProjectGroup) {
  //       dispatch(set(firstProjectGroup));
  //     }
  //   }
  // }, [data, dispatch, selectedProjectGroup]);

  const projectGroups = data?.pages?.flatMap((page) => page.data) || [];
  const limitedProjectGroups = projectGroups.slice(0, 5);

  return (
    <div style={{ marginRight: "1rem",alignSelf:'end' }}>
      <div className={style.projectGroupLabel}>Project Group</div>
      <Dropdown className={style.customDropdown} align="end">
        <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
          <div className={style.selectedProjectGroupName}>
            <span className="visually-hidden">Current project group.</span>
            {selectedProjectGroup?.name || "Select Project Group"}
          </div>
        </Dropdown.Toggle>
        <Dropdown.Menu className={style.dropdownMenu} aria-label="Project group selection menu">
          <div className={style.currentProjectGroupContainer} aria-hidden="true">
            <Dropdown.Header className={style.currentProjectGroupLabel} aria-level={3}>Current Project Group:</Dropdown.Header>
            <span className={style.currentProjectGroupName}>
              <img src={iconProjectGroup} className={style.prjGrpIcon} alt="" aria-hidden="true" />
              {selectedProjectGroup?.name || "None Selected"}
            </span>
          </div>
          {/* <Dropdown.Divider /> */}
          <div className={style.switchProjectContainer}>
            <Dropdown.Header className={style.dropdownHeader} aria-level={3}>{"Switch Project Group:"}</Dropdown.Header>
            {limitedProjectGroups.map((projectGroup) => (
              <Dropdown.Item
                key={projectGroup.tdei_project_group_id}
                onClick={() => {
                  if (projectGroup.tdei_project_group_id !== selectedProjectGroup?.tdei_project_group_id) {
                    dispatch(set(projectGroup));
                  }
                }}
                disabled={projectGroup.tdei_project_group_id === selectedProjectGroup?.tdei_project_group_id}
                className={
                  projectGroup.tdei_project_group_id === selectedProjectGroup?.tdei_project_group_id
                    ? style.selectedProjectGroupItem
                    : style.projectGroupNames
                }
              >
                <span className="visually-hidden">Switch to project group.</span>
                {projectGroup.project_group_name}
              </Dropdown.Item>
            ))}

            {projectGroups.length > 5 && (
              <>
                <Dropdown.Divider />
                <Dropdown.Item
                  onClick={() => navigate("/projectGroupSwitch")}
                  className={style.seeAllOptions}
                >
                  See All Groups
                </Dropdown.Item>
              </>
            )}
          </div>
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
    <img src={iconArrowDown} data-arrow="downArrow" alt="" aria-hidden="true" />
    <img src={iconArrowUp} data-arrow="upArrow" alt="" aria-hidden="true" />
  </button>
));

export default ProjectGroupSwitcherDropDown;
