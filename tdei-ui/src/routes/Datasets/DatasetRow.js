import React from "react";
import style from "./Datasets.module.css";
import { Col, Container, Row } from "react-bootstrap";
import datasetRowIcon from "../../assets/img/dataset-row.svg";
import { workspaceUrl } from "../../services";
import DatasetsActions from "./DatasetsActions";
import ClipboardCopy from "../Services/ClipBoardCopy";
import { updatedTime } from "../../utils";
import { useDispatch, useSelector } from "react-redux";
import { show } from "../../store/notificationModal.slice";
import useIsPoc from "../../hooks/useIsPoc";
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
      status === "Publish" &&
      project_group.tdei_project_group_id ===
        selectedProjectGroup.tdei_project_group_id;
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
      <Row className={style.datasetCard}>
        <Col md={5}>
          <div className="d-flex align-items-center flex-wrap">
            <div className="me-3">
              <img src={datasetRowIcon} alt="Dataset Icon" />
            </div>
            <div className={style.infoBlock}>
              <div className="d-flex align-items-center mb-2">
                <span
                  className={style.datasetTitle}
                  title={metadata.dataset_detail.name}
                  tabIndex={0}
                >
                  {metadata.dataset_detail.name}{" "}
                </span>
              </div>
              <div className={style.datasetSecondaryInfoBlock}>
                <span className="">
                  <b>Uploaded at : </b> {updatedTime(uploaded_timestamp)}
                </span>
                <span className={style.verticalSeparator}></span>
                <span className={style.version}>{dataset_detail.version}</span>
              </div>
            </div>
          </div>
        </Col>
        {!isReleasedList ? null : (
          <Col>
            <div
              className={style.serviceName}
              title={dataset.project_group.name}
              tabIndex={0}
            >
              {dataset.project_group.name}
            </div>
          </Col>
        )}
        <Col>
          <div className={style.serviceName} title={service.name} tabIndex={0}>
            {service.name}
          </div>
        </Col>
        <Col>
          <div className="" tabIndex={0}>
            {data_type === "Osw" ? "OSW" : data_type}
          </div>
        </Col>
        {isReleasedList ? null : (
          <Col className="d-flex justify-content-center">
            <div
              className={style.statusContainer}
              style={{ backgroundColor: getStatusColor() }}
              tabIndex={0}
            >
              {status === "Publish" ? "Released" : status}
            </div>
          </Col>
        )}
        {/* {isReleasedList ? null : ( */}
        <Col>
          <DatasetsActions
            status={status}
            onAction={handleDropdownSelect}
            isReleasedDataset={isReleasedList}
            data_type={data_type}
            dataViewerProps={dataViewerProps()}
          />
        </Col>
        {/* )} */}
      </Row>
      <div className={`${style.datasetIdBlock} d-flex align-items-center`}>
        <ClipboardCopy copyText={tdei_dataset_id} copyTitle={"Id"} />
        {dataset.derived_from_dataset_id && (
          <>
            <span className={style.separator}> | </span>
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
