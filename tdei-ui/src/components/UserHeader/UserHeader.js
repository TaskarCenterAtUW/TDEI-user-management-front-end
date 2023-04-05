import React, { useState } from "react";
import style from "./UserHeader.module.css";
import { useAuth } from "../../hooks/useAuth";
import { useSelector } from "react-redux";
import { getSelectedOrg } from "../../selectors";
import useApiKey from "../../hooks/roles/useApiKey";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Button } from "react-bootstrap";
import { maskString } from "maskdata";

const UserHeader = ({ roles }) => {
  const { data } = useApiKey();
  const { user } = useAuth();
  const [show, setShow] = useState(false);
  const [copy, setCopy] = useState(false);
  const selectedOrg = useSelector(getSelectedOrg);
  const getRoles = () => {
    if (user.isAdmin) {
      return "TDEI Admin";
    }
    return roles?.map((val) => val).join(", ");
  };
  const role = getRoles();
  const authorizedUser = user.isAdmin || !!roles?.length;
  let API_KEY = "121212 21212 1212122 1212121";
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
              Organization : {selectedOrg.org_name}
            </div>
          )}
          <div className={style.roleText}>Roles : {role}</div>
        </>
      ) : (
        <div className={style.userName}>
          Welcome to TDEI, contact TDEI admin or your organization POC to get
          roles assigned.
        </div>
      )}
      <div className={style.apiKey}>
        <div>API Key: </div>
        <div className={style.maskedKey}>
          <div>{show ? API_KEY : maskedKey}</div>
          <div className={style.buttonContainer}>
            <Button variant="link" onClick={() => setShow(true)}>
              Show
            </Button>
            <div className={style.verticalLine}></div>
            <CopyToClipboard text={API_KEY} onCopy={() => setCopy(true)}>
              <Button variant="link">{copy ? "Copied" : "Copy"}</Button>
            </CopyToClipboard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserHeader;
