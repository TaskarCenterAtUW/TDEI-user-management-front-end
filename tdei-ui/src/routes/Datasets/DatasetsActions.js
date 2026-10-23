import React from "react";
import style from "./Datasets.module.css";
import menuOptionIcon from "../../assets/img/menu-options.svg";
import releaseIcon from "../../assets/img/action-release.svg";
import deactivateIcon from "../../assets/img/action-deactivate.svg";
import openConsoleIcon from "../../assets/img/action-open-console.svg";
import cloneImg from "../../assets/img/clone-img.svg";
import editImage from "../../assets/img/edit-img.svg";
import downloadDatasetImg from "../../assets/img/download-img.svg";
import copyIcon from "../../assets/img/icon-copy-id.svg";
import dataViewerIcon from "../../assets/img/icon-data-viewer.svg";
import dataViewerIconDisabled from "../../assets/img/icon-data-viewer-off.svg";
import NorthEastIcon from "@mui/icons-material/NorthEast";
import useIsPoc from "../../hooks/useIsPoc";
import useIsDatasetsAccessible from "../../hooks/useIsDatasetsAccessible";
import useIsOswGenerator from "../../hooks/useIsOswGenerator";
import useIsMember from "../../hooks/roles/useIsMember";
import { useAuth } from "../../hooks/useAuth";
import useIsDataTypeGenerator from "../../hooks/useIsDataTypeGenerator";
import { useMediaQuery } from 'react-responsive';
import { useSelector } from "react-redux";
import { getSelectedProjectGroup } from "../../selectors";
import useGetProjectGroupRoles from "../../hooks/roles/useProjectGroupRoles";
import AccessibleActionMenu from "../../components/AccessibleActionMenu/AccessibleActionMenu";
import menuStyle from "../../components/AccessibleActionMenu/AccessibleActionMenu.module.css";

const DatasetsActions = ({
  status,
  onAction,
  isReleasedDataset,
  data_type,
  dataViewerProps,
  datasetId,
  projectGroupId,
}) => {
  const { user } = useAuth();
  const isPocUser = useIsPoc();
  const isMember = useIsMember();
  const isOswGenerator = useIsOswGenerator();
  const isDataGenerator = useIsDatasetsAccessible();
  //check if user has "<data_type>_data_generator" role
  const isDataTypeGenerator = useIsDataTypeGenerator(data_type);
  const canManageUser = isPocUser || user?.isAdmin;
  const canModifyDataset = isDataGenerator || user?.isAdmin;
  const canClone = isDataGenerator || user?.isAdmin || isMember;
  const canAddIncline = isPocUser || user?.isAdmin || isOswGenerator;
  const canPublish = isPocUser || user?.isAdmin || isDataTypeGenerator;

  const isMobile = useMediaQuery({ maxWidth: 992 });
  const selectedProjectGroup = useSelector(getSelectedProjectGroup);
  const { data: projectGroupsData } = useGetProjectGroupRoles();

  const allProjectGroups = React.useMemo(() => {
    const groups = projectGroupsData?.pages?.flatMap((page) => page.data) || [];
    if (
      selectedProjectGroup?.tdei_project_group_id &&
      !groups.some((g) => g.tdei_project_group_id === selectedProjectGroup.tdei_project_group_id)
    ) {
      return [...groups, selectedProjectGroup];
    }
    return groups;
  }, [projectGroupsData, selectedProjectGroup]);

  const hasPocOrDg = (roles = []) => {
    const normalized = (roles || []).map((r) => String(r).trim().toLowerCase());
    return (
      normalized.includes("poc") ||
      (data_type
        ? normalized.includes(`${data_type.trim().toLowerCase()}_data_generator`)
        : normalized.some((r) => r.endsWith("_data_generator")))
    );
  };

  const isReleased = isReleasedDataset || status === "Publish";
  const canCreateInAnyGroup =
    Boolean(user?.isAdmin) || allProjectGroups.some((pg) => hasPocOrDg(pg.roles));

  const targetPg =
    allProjectGroups.find((pg) => pg.tdei_project_group_id === projectGroupId) ||
    (selectedProjectGroup?.tdei_project_group_id === projectGroupId ? selectedProjectGroup : null);

  const isDgOrPocOfTargetPg =
    Boolean(user?.isAdmin) || (targetPg ? hasPocOrDg(targetPg.roles) : false);

  const canOpenInWorkspace =
    data_type !== "flex" &&
    canCreateInAnyGroup &&
    (isReleased || isDgOrPocOfTargetPg);

  //Role based available actions
  const actions = [
    // "Open in Workspaces" is available if user is DG/POC of PG or dataset is released (and user can create in >= 1 PG)
    canOpenInWorkspace && {
      key: "openInWorkspace",
      label: "Open in Workspaces",
      icon: openConsoleIcon,
      condition: true,
    },
    // "Release" is available for non-released datasets if the user can manage the dataset and the status isn't "Publish"
    !isReleasedDataset &&
    canPublish &&
    status !== "Publish" && {
      key: "release",
      label: "Release",
      icon: releaseIcon,
      condition: true,
    },
    // "Deactivate" is available for non-released datasets if the user can manage the dataset
    !isReleasedDataset &&
    canManageUser && {
      key: "deactivate",
      label: "Deactivate",
      icon: deactivateIcon,
      condition: true,
    },
    // "Edit Metadata" is available if the user has dataset modification permissions and it's not released
    !isReleasedDataset &&
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
    !isReleasedDataset &&
    canAddIncline &&
    status !== "Publish" &&
    data_type === "osw" && {
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
    (isReleasedDataset || status === "Publish") && {
      key: "shareDataset",
      label: "Share Link",
      icon: copyIcon,
      condition: true,
    },
    !isReleasedDataset &&
    dataViewerProps.canPerformDataViewerAction && {
      key: "dataviewer",
      label: dataViewerProps.data_viewer_allowed
        ? "Disable Data Viewer"
        : "Enable Data Viewer",
      icon: dataViewerProps.data_viewer_allowed
        ? dataViewerIconDisabled
        : dataViewerIcon,
      condition: true,
    },
    { // TODO: Add conditions here.
      key: "qualityReport",
      label: "Generate Quality Report",
      icon: <NorthEastIcon className={style.inclinationIcon} />,
      condition: true,
    },
  ].filter(Boolean);

  return (
    actions.length > 0 && (
      <div className={style.dropdownContainer}>
        <AccessibleActionMenu
          triggerId={`dataset-actions-menu-${datasetId || "default"}`}
          trigger={
            isMobile ? (
              "Manage Dataset"
            ) : (
              <img
                src={menuOptionIcon}
                className={style.moreActionIcon}
                alt="Manage Dataset Options"
              />
            )
          }
          triggerClassName={
            isMobile
              ? `${style.datasetActionsButton} ${menuStyle.actionButtonTrigger}`
              : style.dropdownToggle
          }
          items={actions}
          onSelect={onAction}
        />
      </div>
    )
  );
};

export default DatasetsActions;
