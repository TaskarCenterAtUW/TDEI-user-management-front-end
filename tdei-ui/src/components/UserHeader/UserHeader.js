import React, { useState } from "react";
import style from "./UserHeader.module.css";
import { useAuth } from "../../hooks/useAuth";
import { useSelector } from "react-redux";
import { getSelectedProjectGroup } from "../../selectors";
import useApiKey from "../../hooks/roles/useApiKey";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Button } from "react-bootstrap";
import { maskString } from "maskdata";
import ClipboardCopy from "../../routes/Services/ClipBoardCopy";

const UserHeader = ({ roles }) => {
  const { data, isLoading } = useApiKey();
  const { user } = useAuth();
  const [show, setShow] = useState(false);
  const [copy, setCopy] = useState(false);
  const selectedProjectGroup = useSelector(getSelectedProjectGroup);
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
          {user.isAdmin ? null : (
            <div className={style.roleText}>
              <b>Project Group : </b>{selectedProjectGroup.name}
            </div>
          )}
          <div className={style.roleText}><b>Roles : </b>{role}</div>
          {user.isAdmin ? null :  <ClipboardCopy copyText={selectedProjectGroup.tdei_project_group_id} copyTitle={"Project Id"} />}
        </>
      ) : (
        <div className={style.userName}>
          Welcome to TDEI, contact TDEI admin or your project group POC to get
          roles assigned.
        </div>
      )}
      {user.isAdmin ? null : (
        <div className={style.apiKey}>
          <div>My API Key </div>
          <div className={style.maskedKey}>
            {isLoading ? (
              <span className={style.font14}>loading api key...</span>
            ) : (
              <>
                {show ? (
                  <div className={style.keyVisible}>{API_KEY}</div>
                ) : (
                  <div className={style.keyHidden}>{maskedKey}</div>
                )}
              </>
            )}

            <div className={style.buttonContainer}>
              <Button variant="link" onClick={() => setShow(!show)}>
                {show ? "Hide" : "Show" }
              </Button>
              <div className={style.verticalLine}></div>
              <CopyToClipboard text={API_KEY} onCopy={() => setCopy(true)}>
                <Button variant="link">{copy ? "Copied!" : "Copy"}</Button>
              </CopyToClipboard>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserHeader;
