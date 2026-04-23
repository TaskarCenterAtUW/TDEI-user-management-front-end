import React from "react";
import style from "./Datasets.module.css";
import { Col, Container, Row, Badge } from "react-bootstrap";
import datasetRowIcon from "../../assets/img/dataset-row.svg";
import openDataViewerIcon from "../../assets/img/action-open-console.svg";
import { workspaceUrl } from "../../services";
import DatasetsActions from "./DatasetsActions";
import ClipboardCopy from "../Services/ClipBoardCopy";
import { formatTypeLabel, updatedTime } from "../../utils";
import { useDispatch, useSelector } from "react-redux";
import { show } from "../../store/notificationModal.slice";
import useIsPoc from "../../hooks/useIsPoc";
import dataViewerIcon from "../../assets/img/data-viewer-icon.svg";
import useIsOswGenerator from "../../hooks/useIsOswGenerator";
import { getSelectedProjectGroup } from "../../selectors";

const DatasetRow = ({ dataset, onAction, isReleasedList }) => {
  const {
    metadata,
    data_type,
    service,
    status,
    uploaded_timestamp,
    tdei_dataset_id,
    project_group,
    data_viewer_allowed,
  } = dataset;
  const { data_provenance, dataset_detail } = metadata;
  const dispatch = useDispatch();
  const isPoc = useIsPoc();
  const isOswGenerator = useIsOswGenerator();
  const selectedProjectGroup = useSelector(getSelectedProjectGroup);

  const getStatusColor = () => {
    if (isReleasedList) {
      return "#B6EDD7";
    } else {
      switch (status) {
        case "Publish":
          return "#B6EDD7";
        case "Pre-Release":
          return "#F3E7C7";
        default:
          return "#C7E3FF";
      }
    }
  };

  const leftBorderStyle = {
    borderLeft: `8px solid ${getStatusColor()}`,
  };

  const dataViewerProps = () => {
    const canPerformDataViewerAction =
      (isPoc || isOswGenerator) &&
      project_group.data_viewer_allowed &&
      status === "Publish" &&
      project_group.tdei_project_group_id ===
        selectedProjectGroup.tdei_project_group_id &&
      data_type === "osw";
    return {
      canPerformDataViewerAction: canPerformDataViewerAction,
      data_viewer_allowed: data_viewer_allowed,
    };
  };

  const handleDropdownSelect = (eventKey) => {
    if (eventKey === "openInWorkspace") {
      window
        .open(
          `${workspaceUrl}workspace/create/tdei?tdeiRecordId=${tdei_dataset_id}`,
          "_blank"
        )
        ?.focus();
    } else if (eventKey === "downloadMetadata") {
      downloadMetadata(dataset.metadata, dataset.tdei_dataset_id);
    } else {
      onAction(eventKey, dataset);
    }
  };

  const downloadMetadata = (metadata, datasetId) => {
    if (!metadata || Object.keys(metadata).length === 0) {
      dispatch(
        show({
          message: "Metadata is unavailable for this dataset.",
          type: "danger",
        })
      );
      return;
    }
    try {
      const metadataJson = JSON.stringify(metadata, null, 2);
      const blob = new Blob([metadataJson], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `metadata_${datasetId}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading metadata:", error);
      dispatch(
        show({
          message: "An error occurred while downloading metadata.",
          type: "danger",
        })
      );
    }
  };

  return (
    <Container className={style.datasetsTableRow} fluid>
      <div className={style.datasetCard}>
        <div className={style.datasetItem}>
          <div className="d-flex align-items-center flex-wrap gap-2">
            <div className="me-2">
              <img src={datasetRowIcon} alt="" />
            </div>
            <div className={style.infoBlock}>
              <div className="d-flex align-items-center flex-wrap gap-2 mb-2">
                <span
                  className={style.datasetTitle}
                  title={metadata.dataset_detail.name}
                >
                  <span className="visually-hidden">Dataset Name: </span>
                  {metadata.dataset_detail.name}{" "}
                </span>
                {project_group.data_viewer_allowed && data_viewer_allowed && (
                  <button 
                    type="button"
                    className={style.dataViewer}
                    aria-label="Open data viewer URL"
                    onClick={() => {
                      const viewerUrl = `${process.env.REACT_APP_DATAVIEWER_URL}project-group/${project_group.tdei_project_group_id}/dataset/${tdei_dataset_id}`;
                      window.open(viewerUrl, "_blank");
                    }}
                  >
                    Data Viewer
                    <img src={openDataViewerIcon} className={style.dvIcon} alt="" />
                  </button>
                  // <Badge
                  //   bg="" // This disables the default bootstrap color
                  //   className="ms-2 d-inline-flex align-items-center"
                  //   style={{
                  //     cursor: "pointer",
                  //     backgroundColor: "var(--primary-color)",
                  //   }}
                  //   onClick={() => {
                  //     const viewerUrl = `${process.env.REACT_APP_DATAVIEWER_URL}project-group/${project_group.tdei_project_group_id}/dataset/${tdei_dataset_id}`;
                  //     window.open(viewerUrl, "_blank");
                  //   }}
                  //   title="Data viewer enabled"
                  // >
                  //   <img
                  //     src={dataViewerIcon}
                  //     alt="Data viewer enabled"
                  //     style={{
                  //       height: "1.2em",
                  //       filter: "brightness(0) invert(1)",
                  //     }}
                  //   />
                  // </Badge>
                )}
              </div>
              <div className={style.datasetSecondaryInfoBlock}>
                <span className="">
                  <b>Uploaded at : </b> {updatedTime(uploaded_timestamp)}
                </span>
                <span className={style.verticalSeparator}></span>
                <span className={style.version}>
                  <span className="visually-hidden">Version: </span>
                  {dataset_detail.version}
                </span>
              </div>
            </div>
          </div>
        </div>
        {!isReleasedList ? null : (
          <div className={style.datasetItem}>
            <div className={style.mobileOnly} aria-hidden="true">Project Group</div>
            <div
              className={style.serviceName}
              title={dataset.project_group.name}
            >
              <span className="visually-hidden">Project Group: </span>
              {dataset.project_group.name}
            </div>
          </div>
        )}
        <div className={style.datasetItem}>
          <div className={style.mobileOnly} aria-hidden="true">Service Name</div>
          <div className={style.serviceName} title={service.name}>
            <span className="visually-hidden">Service Name: </span>
            {service.name}
          </div>
        </div>
        <div className={style.datasetItem}>
          <div className={style.mobileOnly} aria-hidden="true">Type</div>
          <div className={style.typeNameTransform}>
            <span className="visually-hidden">Type: </span>
            {formatTypeLabel(data_type)}
          </div>
        </div>
        {isReleasedList ? null : (
          <div className={`${style.datasetItem} ${style.itemCenterAlign}`}>
            <div className={style.mobileOnly} aria-hidden="true">Status</div>
            <div
              className={style.statusContainer}
              style={{ backgroundColor: getStatusColor() }}
            >
              <span className="visually-hidden">Status: </span>
              {status === "Publish" ? "Released" : status}
            </div>
          </div>
        )}
        {/* {isReleasedList ? null : ( */}
        <div className={style.datasetItem}>
          {/* <div className={style.mobileOnly}>Action</div> */}
          <DatasetsActions
            status={status}
            onAction={handleDropdownSelect}
            isReleasedDataset={isReleasedList}
            data_type={data_type}
            dataViewerProps={dataViewerProps()}
          />
        </div>
        {/* )} */}
      </div>
      <div className={style.datasetIdBlock}>
        <ClipboardCopy copyText={tdei_dataset_id} copyTitle={"Id"} />
        {dataset.derived_from_dataset_id && (
          <>
            <span className={style.verticalSeparator}></span>
            <ClipboardCopy
              copyText={dataset.derived_from_dataset_id}
              copyTitle={"Derived Dataset Id"}
            />
          </>
        )}
      </div>
    </Container>
  );
};

export default DatasetRow;
