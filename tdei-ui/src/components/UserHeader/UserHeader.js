import React from "react";
import style from "./UserHeader.module.css";
import { useAuth } from "../../hooks/useAuth";
import { useSelector } from "react-redux";
import { getSelectedOrg } from "../../selectors";

const UserHeader = ({ roles }) => {
  const { user } = useAuth();
  const selectedOrg = useSelector(getSelectedOrg);
  const getRoles = () => {
    if (user.isAdmin) {
      return "TDEI Admin";
    }
    return roles?.map((val) => val).join(", ");
  };
  const role = getRoles();
  const authorizedUser = user.isAdmin || !!roles?.length;

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
    </div>
  );
};

export default UserHeader;
