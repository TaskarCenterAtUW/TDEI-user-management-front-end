import React, { useEffect } from "react";
import { Dropdown } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getSelectedProjectGroup } from "../../selectors";
import { set } from "../../store";
import style from "./ProjectGroupSwitcher.module.css";
import useGetProjectGroupRoles from "../../hooks/roles/useProjectGroupRoles";

const ProjectGroupSwitcher = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const selectedProjectGroup = useSelector(getSelectedProjectGroup);
  const {  data = [] } = useGetProjectGroupRoles();

  useEffect(() => {
    const isEmptyObject = (obj) => Object.keys(obj).length === 0;
    if ((selectedProjectGroup === null || isEmptyObject(selectedProjectGroup)) && data?.pages?.[0]?.data?.length > 0) {
      const firstProjectGroup = data.pages[0].data[0];
      if (firstProjectGroup) {
        console.log("Setting first project group:", firstProjectGroup);
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
            {selectedProjectGroup.name || "Select Project Group"}
          </div>
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Header>{selectedProjectGroup.name || "Switch Project Group"}</Dropdown.Header>
          <Dropdown.Item onClick={() => navigate("/projectGroupSwitch")}>
            Switch Project
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

export default ProjectGroupSwitcher;
