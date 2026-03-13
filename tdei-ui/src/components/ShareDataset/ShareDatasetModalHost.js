import React from "react";
import { useQuery } from "react-query";
import { Button, Modal, Spinner } from "react-bootstrap";
import { matchPath, useLocation, useNavigate } from "react-router-dom";
import DownloadModal from "../DownloadModal/DownloadModal";
import ResponseToast from "../ToastMessage/ResponseToast";
import useDownloadDataset from "../../hooks/datasets/useDownloadDataset";
import { getReleasedDatasetById } from "../../services";
import { isShareDatasetRoute } from "../../utils";

function ShareDatasetModalHost() {
  const location = useLocation();
  const navigate = useNavigate();
  const shareDatasetMatch = matchPath(
    "/share-dataset/:data_type/:tdei_dataset_id",
    location.pathname
  );
  const shareIntent = React.useMemo(() => {
    if (!shareDatasetMatch?.params?.data_type || !shareDatasetMatch?.params?.tdei_dataset_id) {
      return null;
    }

    return {
      data_type: shareDatasetMatch.params.data_type,
      tdei_dataset_id: shareDatasetMatch.params.tdei_dataset_id,
    };
  }, [shareDatasetMatch]);
  const [showConfirmModal, setShowConfirmModal] = React.useState(false);
  const [showDownloadModal, setShowDownloadModal] = React.useState(false);
  const [showErrorModal, setShowErrorModal] = React.useState(false);
  const [selectedFormat, setSelectedFormat] = React.useState(null);
  const [selectedFileVersion, setSelectedFileVersion] = React.useState(null);
  const [toast, setToast] = React.useState({ show: false, type: "success", message: "" });
  const [errorMessage, setErrorMessage] = React.useState("");
  const [hasAutoPrompted, setHasAutoPrompted] = React.useState(false);

  const resetModalState = React.useCallback(() => {
    setShowConfirmModal(false);
    setShowDownloadModal(false);
    setShowErrorModal(false);
    setSelectedFormat(null);
    setSelectedFileVersion(null);
    setErrorMessage("");
    setHasAutoPrompted(false);
  }, []);

  const clearShareFlow = React.useCallback(() => {
    resetModalState();
    if (isShareDatasetRoute(location.pathname)) {
      navigate("/", { replace: true });
    }
  }, [location.pathname, navigate, resetModalState]);

  React.useEffect(() => {
    resetModalState();
  }, [location.key, resetModalState, shareIntent?.data_type, shareIntent?.tdei_dataset_id]);

  const {
    data: dataset,
    isLoading,
  } = useQuery(
    [
      "shared-released-dataset-modal",
      shareIntent?.data_type || "",
      shareIntent?.tdei_dataset_id || "",
    ],
    () => getReleasedDatasetById(shareIntent.tdei_dataset_id, shareIntent.data_type),
    {
      enabled: !!shareIntent,
      refetchOnWindowFocus: false,
      retry: false,
      onError: (error) => {
        setErrorMessage(error?.message || "This dataset was not found or is no longer released.");
        setShowErrorModal(true);
      },
    }
  );

  React.useEffect(() => {
    if (!dataset || hasAutoPrompted || !shareIntent) return;

    if (String(dataset?.data_type || "").toLowerCase() === "osw") {
      setShowDownloadModal(true);
    } else {
      setShowConfirmModal(true);
    }
    setHasAutoPrompted(true);
  }, [dataset, hasAutoPrompted, shareIntent]);

  const { mutate: downloadDataset, isLoading: isDownloadingDataset } = useDownloadDataset({
    onSuccess: () => {
      resetModalState();
      navigate("/", { replace: true });
      setToast({
        show: true,
        type: "success",
        message: "Success! Download has been initiated.",
      });
    },
    onError: (downloadError) => {
      resetModalState();
      navigate("/", { replace: true });
      setToast({
        show: true,
        type: "error",
        message: downloadError?.data || "Unknown error occured! Please try again!",
      });
    },
  });

  const handleDownload = React.useCallback(() => {
    if (!dataset) return;

    const payload = {
      tdei_dataset_id: dataset.tdei_dataset_id,
      data_type: dataset.data_type,
    };

    if (String(dataset.data_type || "").toLowerCase() === "osw") {
      payload.format = selectedFormat?.value || "osw";
      payload.file_version = selectedFileVersion?.value || "latest";
    }

    downloadDataset(payload);
  }, [dataset, downloadDataset, selectedFileVersion, selectedFormat]);

  const datasetName = dataset?.metadata?.dataset_detail?.name || shareIntent?.tdei_dataset_id || "";
  const datasetId = dataset?.tdei_dataset_id || shareIntent?.tdei_dataset_id || "";
  const formatOptions = [
    { value: "osm", label: "OSM" },
    { value: "osw", label: "OSW" },
  ];
  const fileVersionOptions = [
    { value: "latest", label: "Latest" },
    { value: "original", label: "Original" },
  ];

  return (
    <>
      <Modal show={!!shareIntent && isLoading} centered backdrop="static" keyboard={false}>
        <Modal.Body className="text-center py-4">
          <Spinner animation="border" role="status" className="mb-3" />
          <h2 className="h5 mb-2">Validating shared dataset</h2>
          <p className="text-muted mb-0">
            Checking whether this dataset is still released and available for download.
          </p>
        </Modal.Body>
      </Modal>

      <Modal
        show={showConfirmModal}
        onHide={() => !isDownloadingDataset && clearShareFlow()}
        centered
      >
        <Modal.Header closeButton={!isDownloadingDataset}>
          <Modal.Title>Download Dataset</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-3">Review the dataset and confirm the download.</p>
          <div className="mb-2">
            <strong>Name:</strong> {datasetName}
          </div>
          <div className="mb-0">
            <strong>Dataset ID:</strong> {datasetId}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            className="tdei-secondary-button"
            onClick={clearShareFlow}
            disabled={isDownloadingDataset}
          >
            Cancel
          </Button>
          <Button
            className="tdei-primary-button"
            onClick={handleDownload}
            disabled={isDownloadingDataset}
          >
            {isDownloadingDataset ? <Spinner size="sm" /> : "Download"}
          </Button>
        </Modal.Footer>
      </Modal>

      <DownloadModal
        show={showDownloadModal}
        handleClose={() => {
          if (isDownloadingDataset) return;
          clearShareFlow();
        }}
        handleDownload={handleDownload}
        title="Download Dataset"
        introText="Review the dataset and confirm the download."
        datasetName={datasetName}
        datasetId={datasetId}
        formatOptions={formatOptions}
        fileVersionOptions={fileVersionOptions}
        selectedFormat={selectedFormat}
        setSelectedFormat={setSelectedFormat}
        selectedFileVersion={selectedFileVersion}
        setSelectedFileVersion={setSelectedFileVersion}
        isLoading={isDownloadingDataset}
        isReleasedDataset={true}
      />

      <Modal show={showErrorModal} onHide={clearShareFlow} centered>
        <Modal.Header closeButton>
          <Modal.Title>Dataset unavailable</Modal.Title>
        </Modal.Header>
        <Modal.Body>{errorMessage || "This dataset was not found or is no longer released."}</Modal.Body>
        <Modal.Footer>
          <Button className="tdei-primary-button" onClick={clearShareFlow}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <ResponseToast
        showtoast={toast.show}
        handleClose={() => setToast((prev) => ({ ...prev, show: false }))}
        type={toast.type}
        message={toast.message}
      />
    </>
  );
}

export default ShareDatasetModalHost;
