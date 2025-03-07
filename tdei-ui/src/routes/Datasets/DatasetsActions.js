import React from 'react';
import { Dropdown } from 'react-bootstrap';
import style from "./Datasets.module.css";
import menuOptionIcon from "../../assets/img/menu-options.svg";
import releaseIcon from "../../assets/img/action-release.svg";
import deactivateIcon from "../../assets/img/action-deactivate.svg";
import openConsoleIcon from "../../assets/img/action-open-console.svg";
import cloneImg from "../../assets/img/clone-img.svg";
import editImage from "../../assets/img/edit-img.svg";
import downloadDatasetImg from "../../assets/img/download-img.svg";
import NorthEastIcon from '@mui/icons-material/NorthEast';
import useIsPoc from "../../hooks/useIsPoc";
import useIsDatasetsAccessible from '../../hooks/useIsDatasetsAccessible';
import useIsOswGenerator from '../../hooks/useIsOswGenerator';
import useIsMember from '../../hooks/roles/useIsMember';
import { useAuth } from "../../hooks/useAuth";

const DatasetsActions = ({ status, onAction, isReleasedDataset, data_type }) => {
  const { user } = useAuth();
  const isPocUser = useIsPoc();
  const isMember = useIsMember();
  const isOswGenerator = useIsOswGenerator();
  const isDataGenerator = useIsDatasetsAccessible();

  const canManageUser = isPocUser || user?.isAdmin;
  const canModifyDataset = isDataGenerator || user?.isAdmin;
  const canClone = isDataGenerator || user?.isAdmin || isMember;
  const canAddIncline = isPocUser || user?.isAdmin || isOswGenerator;
  
  //Role based available actions
  const actions = [
     // "Open in Workspaces" is available for all datasets except 'flex'
    data_type !== 'flex' && {
      key: "openInWorkspace",
      label: "Open in Workspaces",
      icon: openConsoleIcon,
      condition: true,
    },
    // "Release" is available for non-released datasets if the user can manage the dataset and the status isn't "Publish"
    !isReleasedDataset && canManageUser && status !== "Publish" && {
      key: "release",
      label: "Release",
      icon: releaseIcon,
      condition: true,
    },
    // "Deactivate" is available for non-released datasets if the user can manage the dataset
    !isReleasedDataset && canManageUser && {
      key: "deactivate",
      label: "Deactivate",
      icon: deactivateIcon,
      condition: true,
    },
    // "Edit Metadata" is available if the user has dataset modification permissions
    canModifyDataset && {
      key: "editMetadata",
      label: "Edit Metadata",
      icon: editImage,
      condition: true,
    },
    // "Download Metadata" is available to all users
   {
      key: "downloadMetadata",
      label: "Download Metadata",
      icon: downloadDatasetImg,
      condition: true,
    },
    // "Add Inclination" is available for non-released OSW datasets if the user is OSW generator and the status isn't "Publish"
    !isReleasedDataset && canAddIncline && status !== "Publish" && data_type === 'osw' && {
      key: "inclination",
      label: "Add Inclination",
      icon: <NorthEastIcon className={style.inclinationIcon} />,
      condition: true,
    },
    // "Clone Dataset" is available if the user has permission to clone
    canClone && {
      key: "cloneDataset",
      label: "Clone Dataset",
      icon: cloneImg,
      condition: true,
    },
    // "Download" is available to all users
    {
      key: "downLoadDataset",
      label: "Download",
      icon: downloadDatasetImg,
      condition: true,
    },
  ].filter(Boolean);

  return (
    actions.length > 0 && (
      <div className={style.dropdownContainer}>
        <Dropdown onSelect={onAction}>
          <Dropdown.Toggle id="dropdown-basic" variant='btn btn-link' className={style.dropdownToggle}>
            <img src={menuOptionIcon} className={style.moreActionIcon} alt="Menu Options" />
          </Dropdown.Toggle>
          <Dropdown.Menu className={style.dropdownCard}>
            {actions.map(({ key, label, icon }) => (
              <Dropdown.Item key={key} eventKey={key} className={style.itemRow}>
                {typeof icon === 'string' ? <img src={icon} className={style.itemIcon} alt="" /> : icon}
                {label}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </div>
    )
  );
};

export default DatasetsActions;
