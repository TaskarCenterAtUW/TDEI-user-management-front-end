import React from 'react';
import { Dropdown } from 'react-bootstrap';
import style from "./Datasets.module.css";
import menuOptionIcon from "../../assets/img/menu-options.svg";

const DatasetsActions = ({ status, onAction }) => {
  return (
    <div>
          <Dropdown onSelect={onAction}>
            <Dropdown.Toggle id="dropdown-basic" className={style.dropdownToggle}>
            <img className={style.menuOptionIcon} src={menuOptionIcon} alt="Menu Options" />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item eventKey="openInWorkspace">Open in workspaces</Dropdown.Item>
              <Dropdown.Item disabled={status ==  "Publish" ? true : false } eventKey="release">Release</Dropdown.Item>
              <Dropdown.Item disabled={status ==  "Publish" ? false : true } eventKey="deactivate">Deactivate</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
  );
};

export default DatasetsActions;
