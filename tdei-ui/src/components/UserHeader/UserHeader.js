import React, { useState } from "react";
import style from "./UserHeader.module.css";
import { useAuth } from "../../hooks/useAuth";
import { useSelector } from "react-redux";
import { getSelectedProjectGroup } from "../../selectors";
import useApiKey from "../../hooks/roles/useApiKey";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Button, Spinner } from "react-bootstrap";
import { maskString } from "maskdata";
import ClipboardCopy from "../../routes/Services/ClipBoardCopy";
import useRegenerateApiKey from "../../hooks/roles/useRegenerateApiKey";
import CachedIcon from '@mui/icons-material/Cached';
import { useDispatch } from "react-redux";
import { show } from "../../store/notification.slice";
import { useQueryClient } from "react-query";
import { GET_API_KEY } from "../../utils";
import Tooltip from '@mui/material/Tooltip';

const UserHeader = ({ roles }) => {
  const { data, isLoading, refetch } = useApiKey();
  const { user } = useAuth();
  const dispatch = useDispatch();
  const [showApiKey, setShowApiKey] = useState(false);
  const [copy, setCopy] = useState(false);
  const selectedProjectGroup = useSelector(getSelectedProjectGroup);
  const queryClient = useQueryClient();

  const { mutate: regenerateKey, isLoading: isRegenerating } = useRegenerateApiKey({
    onSuccess: (data) => {
      dispatch(show({ type: "success", message: data?.message || "API Key regenerated successfully" }));
      setCopy(false);
      queryClient.invalidateQueries({ queryKey: [GET_API_KEY] });
    },
    onError: (err) => {
      dispatch(show({ type: "danger", message: err.response?.data || "Failed to regenerate API Key" }));
    },
  });

  const getRoles = () => {
    if (user.isAdmin) {
      return "TDEI Admin";
    }
    return roles?.map((val) => val).join(", ");
  };

  const role = getRoles();
  const authorizedUser = user.isAdmin || !!roles?.length;
  let API_KEY = data?.apiKey;
  const maskedKey = maskString(API_KEY, {
    maskAll: true,
    maskSpace: false,
  });

  return (
    <div className={style.userHeader}>
      {authorizedUser ? (
        <>
          <div className={style.userName}>{`Welcome back, ${user.name} !`}</div>
          {!user.isAdmin && (
            <div className={style.roleText}>
              <b>Project Group : </b>{selectedProjectGroup.name}
            </div>
          )}
          <div className={style.roleText}><b>Roles : </b>{role}</div>
          {!user.isAdmin && (
            <ClipboardCopy copyText={selectedProjectGroup.tdei_project_group_id} copyTitle={"Project Id"} />
          )}
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
              <CopyToClipboard text={API_KEY} onCopy={() => {
                setCopy(true);
                setTimeout(() => setCopy(false), 2000);
              }}>
                <Button style={{ minWidth: "70px" }} variant="link">{copy ? "Copied!" : "Copy"}</Button>
              </CopyToClipboard>
              <div className={style.verticalLine}></div>
              <Tooltip title="Regenerate API Key" arrow>
                <Button variant="link" onClick={regenerateKey} disabled={isRegenerating}>
                  <div className={style.fixedIcon}>
                    {isRegenerating ? (
                      <Spinner animation="border" size="sm" style={{ width: "20px", height: "20px" }} />
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
    </div>
  );
};

export default UserHeader;
