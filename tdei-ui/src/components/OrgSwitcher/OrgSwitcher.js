import React from "react";
import { Dropdown } from "react-bootstrap";
import { useDispatch } from "react-redux";
import useGetOrgRoles from "../../hooks/roles/useOrgRoles";
import { set } from "../../store";
import style from "./OrgSwitcher.module.css";

const OrgSwitcher = () => {
  const { data } = useGetOrgRoles();
  const dispatch = useDispatch();
  const [selected, setSelected] = React.useState(null);
  React.useEffect(() => {
    if (data?.length) {
      setSelected(data?.[0]);
    }
  }, [data]);

  const handleOrgSelection = (index) => {
    setSelected(data?.[index]);
    dispatch(set(data?.[index]));
  };

  return (
    <>
      {data?.length ? (
        <div style={{ marginRight: "1rem" }}>
          <div className={style.orgLabel}>Organization</div>
          <Dropdown className={style.customDropdown} align="end">
            <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
              <div className={style.selectedOrgName}>{selected?.org_name}</div>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Header>Switch Organization</Dropdown.Header>
              {data?.map((val, index) => (
                <Dropdown.Item
                  key={val.org_name}
                  onClick={() => handleOrgSelection(index)}
                  active={val.org_name === selected?.org_name}
                >
                  {val.org_name}
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

export default OrgSwitcher;
