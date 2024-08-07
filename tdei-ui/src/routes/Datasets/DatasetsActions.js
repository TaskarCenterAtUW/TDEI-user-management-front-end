import React from 'react';
import { Dropdown } from 'react-bootstrap';
import style from "./Datasets.module.css";
import menuOptionIcon from "../../assets/img/menu-options.svg";
import releaseIcon from "../../assets/img/action-release.svg";
import deactivateIcon from "../../assets/img/action-deactivate.svg";
import openConsoleIcon from "../../assets/img/action-open-console.svg";
import useIsPoc from "../../hooks/useIsPoc";
import cloneImg from "../../assets/img/clone-img.svg";
import editImage from "../../assets/img/edit-img.svg";
import { useAuth } from "../../hooks/useAuth";
import downloadDatasetImg from "../../assets/img/download-img.svg";
import useIsDatasetsAccessible from '../../hooks/useIsDatasetsAccessible';

const DatasetsActions = ({ status, onAction, isReleasedDataset }) => {
  const isPocUser = useIsPoc();
  const { user } = useAuth();
  const isDataGenerator = useIsDatasetsAccessible();
  
  const canDeactivate = isPocUser || user?.isAdmin;

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
          {!isReleasedDataset && (
            <>
              <Dropdown.Item disabled={status === "Publish"} eventKey="release" className={style.itemRow}>
                <img src={releaseIcon} className={style.itemIcon} alt="" />Release
              </Dropdown.Item>
              <Dropdown.Item disabled={!canDeactivate} eventKey="deactivate" className={style.itemRow}>
                <img src={deactivateIcon} className={style.itemIcon} alt="" />Deactivate
              </Dropdown.Item>
              <Dropdown.Item eventKey="editMetadata" className={style.itemRow}>
                <img src={editImage} className={style.itemIcon} alt="" />Edit Metadata
              </Dropdown.Item>
            </>
          )}
          <Dropdown.Item disabled={!isDataGenerator && !user.isAdmin} eventKey="cloneDataset" className={style.itemRow}>
            <img src={cloneImg} className={style.itemIcon} alt="" />Clone Dataset
          </Dropdown.Item>
          <Dropdown.Item eventKey="downLoadDataset" className={style.itemRow}>
            <img src={downloadDatasetImg} className={style.itemIcon} alt="" />Download
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default DatasetsActions;
