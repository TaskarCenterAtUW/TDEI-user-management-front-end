import React from 'react';
import { Form, Dropdown } from 'react-bootstrap';
import style from "./Datasets.module.css"
import sort from "./../../assets/img/sort.svg"
import { IconButton } from '@mui/material';
import refreshBtn from "./../../assets/img/refreshBtn.svg"

const SortRefreshComponent = ({ handleRefresh, handleDropdownSelect, isReleasedDataset }) => {
  return (
    <div className="d-flex align-items-center">
      <IconButton className={style.iconBtn} onClick={handleRefresh}>
        <img alt="refresh" src={refreshBtn} style={{ height: "15px", width: "15px" }} />
      </IconButton>
      <div className={style.divider}></div>
      <div className="d-flex align-items-center">
        <div className="me-2">
          <Form.Label className="mb-0">Sort by</Form.Label>
        </div>
        <div className="">
          <Dropdown onSelect={handleDropdownSelect}>
            <Dropdown.Toggle id="dropdown-basic" className={style.dropdownToggle}>
              <img src={sort} className={style.noDataIcon} alt="sort" />
            </Dropdown.Toggle>
            <Dropdown.Menu>
            {!isReleasedDataset && <Dropdown.Item eventKey="status">Status</Dropdown.Item>}
              <Dropdown.Item eventKey="type">Type</Dropdown.Item>
              <Dropdown.Item eventKey="asc">A-Z</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    </div>
  );
};

export default SortRefreshComponent;
