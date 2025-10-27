import React, { useState, useEffect } from "react";
import style from "./UserHeader.module.css";
import { useAuth } from "../../hooks/useAuth";
import { useSelector, useDispatch } from "react-redux";
import { getSelectedProjectGroup } from "../../selectors";
import useApiKey from "../../hooks/roles/useApiKey";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Button, Spinner, Form, InputGroup } from "react-bootstrap";
import { maskString } from "maskdata";
import ClipboardCopy from "../../routes/Services/ClipBoardCopy";
import useRegenerateApiKey from "../../hooks/roles/useRegenerateApiKey";
import CachedIcon from "@mui/icons-material/Cached";
import { show } from "../../store/notification.slice";
import { useQueryClient } from "react-query";
import { GET_API_KEY } from "../../utils";
import Tooltip from "@mui/material/Tooltip";
import { FaCopy, FaGlobe } from "react-icons/fa";
import ProjectGroupSettings from "../../components/ProjectGroupSettings/ProjectGroupSettings";
import useIsPoc from "../../hooks/useIsPoc";
import useGetProjectGroupById from "../../hooks/projectGroup/useGetProjectGroupById";

const makeViewerUrl = (pgid) => {
  const base = process.env.REACT_APP_DATAVIEWER_URL || "/";
  const normalized = base.endsWith("/") ? base : `${base}/`;
  return `${normalized}project-group/${pgid}`;
};

const UserHeader = ({ roles }) => {
  const { data, isLoading } = useApiKey();
  const { user } = useAuth();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const selectedProjectGroup = useSelector(getSelectedProjectGroup);

  const [showApiKey, setShowApiKey] = useState(false);
  const [copy, setCopy] = useState(false);
  const [copyViewerUrl, setCopyViewerUrl] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const isPoc = useIsPoc();

  const {
    loading: pgLoading,
    projectGroup: freshPG,
    refetch: refetchPg,
  } = useGetProjectGroupById(selectedProjectGroup?.tdei_project_group_id);

  const dvRaw =
    freshPG?.data_viewer_config?.dataset_viewer_allowed ??
    selectedProjectGroup?.data_viewer_config?.dataset_viewer_allowed;

  const dvPending =
    !!selectedProjectGroup?.tdei_project_group_id &&
    (pgLoading || dvRaw === undefined || dvRaw === null);
  const dvOn = dvRaw === true;


  const viewerUrl = selectedProjectGroup
    ? makeViewerUrl(selectedProjectGroup.tdei_project_group_id)
    : "";

  // API key regenerate
  const { mutate: regenerateKey, isLoading: isRegenerating } =
    useRegenerateApiKey({
      onSuccess: (payload) => {
        dispatch(
          show({
            type: "success",
            message: payload?.message || "API Key regenerated successfully",
          })
        );
        setCopy(false);
        queryClient.invalidateQueries({ queryKey: [GET_API_KEY] });
      },
      onError: (err) => {
        dispatch(
          show({
            type: "danger",
            message: err?.response?.data || "Failed to regenerate API Key",
          })
        );
      },
    });

  const role = user.isAdmin ? "TDEI Admin" : roles?.join(", ") || "";
  const authorizedUser = user.isAdmin || !!roles?.length;
  const API_KEY = data?.apiKey;
  const maskedKey = maskString(API_KEY, { maskAll: true, maskSpace: false });

  return (
    <div className={style.userHeader}>
      {authorizedUser ? (
        <>
          <div className={style.userName}>{`Welcome back, ${user.name} !`}</div>

          {!user.isAdmin && selectedProjectGroup?.name && (
            <div className={style.roleText}>
              <b>Project Group : </b>
              {selectedProjectGroup.name}
            </div>
          )}

          <div className={style.roleText}>
            <b>Roles : </b>
            {role}
          </div>

          {!user.isAdmin && selectedProjectGroup?.tdei_project_group_id && (
            <ClipboardCopy
              copyText={selectedProjectGroup.tdei_project_group_id}
              copyTitle={"Project Id"}
            />
          )}

          {/* === end Dataviewer card === */}
        </>
      ) : (
        <div className={style.userName}>
          Welcome to TDEI, contact TDEI admin or your project group POC to get
          roles assigned.
        </div>
      )}

      {!user.isAdmin && (
        <div className={style.apiKey}>
          <div>My API Key</div>
          <div className={style.maskedKey}>
            <div className={style.keyContainer}>
              {isLoading ? (
                <span className={style.font14}>loading api key...</span>
              ) : (
                <>
                  {showApiKey ? (
                    <div className={style.keyVisible}>{API_KEY}</div>
                  ) : (
                    <div className={style.keyHidden}>{maskedKey}</div>
                  )}
                </>
              )}
            </div>

            <div className={style.buttonContainer}>
              <Button variant="link" onClick={() => setShowApiKey(!showApiKey)}>
                {showApiKey ? "Hide" : "Show"}
              </Button>
              <div className={style.verticalLine}></div>
              <CopyToClipboard
                text={API_KEY}
                onCopy={() => {
                  setCopy(true);
                  setTimeout(() => setCopy(false), 2000);
                }}
              >
                <Button style={{ minWidth: "70px" }} variant="link">
                  {copy ? "Copied!" : "Copy"}
                </Button>
              </CopyToClipboard>
              <div className={style.verticalLine}></div>
              <Tooltip title="Regenerate API Key" arrow>
                <Button
                  variant="link"
                  onClick={regenerateKey}
                  disabled={isRegenerating}
                >
                  <div className={style.fixedIcon}>
                    {isRegenerating ? (
                      <Spinner
                        animation="border"
                        size="sm"
                        style={{ width: "20px", height: "20px" }}
                      />
                    ) : (
                      <CachedIcon style={{ fontSize: "20px" }} />
                    )}
                  </div>
                </Button>
              </Tooltip>
            </div>
          </div>
        </div>
      )}
      {selectedProjectGroup && isPoc && (<div className={style.apiKey}></div>)}
      {selectedProjectGroup && isPoc && (
        <div key={selectedProjectGroup.tdei_project_group_id} className={style.dvCard}>
          <div className={style.dvHeader}>
            <div>
              <div className={style.dvActions}>
                <div className={style.dvTitle}>Dataviewer Setting</div>
                {dvPending ? (
                  <span className={style.statePending} aria-live="polite">Loading…</span>
                ) : (
                  <span
                    className={dvOn ? style.stateOn : style.stateOff}
                    aria-label={`Dataviewer is ${dvOn ? "ON" : "OFF"}`}
                  >
                    {dvOn ? "ON" : "OFF"}
                  </span>
                )}
              </div>
              <div className={style.dvSubtitle}>
                Enable or disable the dataviewer for your project
              </div>
            </div>

            <div className={style.dvActions}>

              <Button
                className={style.manageBtn}
                onClick={() => setShowSettings(true)}
                disabled={dvPending}
              >
                Manage
              </Button>
            </div>
          </div>
          {dvOn && !dvPending && <div className={style.dvDivider} />}

          {dvOn && !dvPending && (
            <div className={style.dvUrlBlock}>
              <div className={style.roleText}>Dataviewer URL</div>
              <InputGroup className={style.dvUrlGroup}>
                <Form.Control
                  type="text"
                  value={viewerUrl}
                  readOnly
                  className={style.dvUrlInput}
                />
                <Button
                  variant="outline-light"
                  className={style.dvCopyBtn}
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(viewerUrl);
                      setCopyViewerUrl(true);
                      setTimeout(() => setCopyViewerUrl(false), 1200);
                    } catch {
                    }
                  }}
                  disabled={!viewerUrl}
                  title={copyViewerUrl ? "Copied!" : "Copy"}
                >
                  <FaCopy />
                </Button>
              </InputGroup>
            </div>
          )}
        </div>
      )}
      {(isPoc || user.isAdmin) && selectedProjectGroup && (
        <ProjectGroupSettings
          show={showSettings}
          onHide={() => {
            setShowSettings(false);
            refetchPg?.(); // refresh after saving/closing the modal
          }}
          projectGroup={freshPG || selectedProjectGroup}
        />
      )}
    </div>
  );
};

export default UserHeader;
