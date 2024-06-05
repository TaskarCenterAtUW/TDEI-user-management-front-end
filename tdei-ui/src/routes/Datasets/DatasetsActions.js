import React from 'react';
import { Dropdown } from 'react-bootstrap';
import style from "./Datasets.module.css";
import menuOptionIcon from "../../assets/img/menu-options.svg";
import releaseIcon from "../../assets/img/action-release.svg";
import deactivateIcon from "../../assets/img/action-deactivate.svg";
import openConsoleIcon from "../../assets/img/action-open-console.svg";
import useIsPoc from "../../hooks/useIsPoc";
import { useAuth } from "../../hooks/useAuth";

const DatasetsActions = ({ status, onAction }) => {
  const isPocUser = useIsPoc();
  const { user } = useAuth();
  
  const isDeactivateDisabled = status === "Publish" || (!isPocUser && !user?.isAdmin);

  return (
    <div className={style.dropdownContainer}>
      <Dropdown onSelect={onAction}>
        <Dropdown.Toggle id="dropdown-basic" variant='btn btn-link' className={`${style.dropdownToggle}`}>
          <img src={menuOptionIcon} className={style.moreActionIcon} alt="Menu Options" />
        </Dropdown.Toggle>
        <Dropdown.Menu className={style.dropdownCard}>
          <Dropdown.Item eventKey="openInWorkspace" className={style.itemRow}>
            <img src={openConsoleIcon} className={style.itemIcon} alt="" />Open in workspaces
          </Dropdown.Item>
          <Dropdown.Item disabled={status === "Publish" ? true : false} eventKey="release" className={style.itemRow}>
            <img src={releaseIcon} className={style.itemIcon} alt="" />Release
          </Dropdown.Item>
          <Dropdown.Item disabled={isDeactivateDisabled} eventKey="deactivate" className={style.itemRow}>
            <img src={deactivateIcon} className={style.itemIcon} alt="" />Deactivate
          </Dropdown.Item>
          <Dropdown.Item eventKey="editMetadata" className={style.itemRow}>
            <img src={deactivateIcon} className={style.itemIcon} alt="" />Edit Metadata
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default DatasetsActions;
