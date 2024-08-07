import React from "react";
import { Dropdown } from "react-bootstrap";
import { useDispatch } from "react-redux";
import useGetProjectGroupRoles from "../../hooks/roles/useProjectGroupRoles";
import { set } from "../../store";
import style from "./ProjectGroupSwitcher.module.css";

const ProjectGroupSwitcher = () => {
  const { data } = useGetProjectGroupRoles();
  const dispatch = useDispatch();
  const [selected, setSelected] = React.useState(null);
  React.useEffect(() => {
    if (data?.length) {
      setSelected(data?.[0]);
    }
  }, [data]);

  const handleProjectGroupSelection = (index) => {
    setSelected(data?.[index]);
    dispatch(set(data?.[index]));
  };

  return (
    <>
      {data?.length ? (
        <div style={{ marginRight: "1rem" }}>
          <div className={style.projectGroupLabel}>Project Group</div>
          <Dropdown className={style.customDropdown} align="end">
            <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
              <div className={style.selectedProjectGroupName}>{selected?.project_group_name}</div>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Header>Switch Project Group</Dropdown.Header>
              {data?.map((val, index) => (
               
                <Dropdown.Item
                  key={val.tdei_project_group_id}
                  onClick={() => handleProjectGroupSelection(index)}
                  active={val.tdei_project_group_id === selected?.tdei_project_group_id}
                >
                  {val.project_group_name}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>
      ) : null}
    </>
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
