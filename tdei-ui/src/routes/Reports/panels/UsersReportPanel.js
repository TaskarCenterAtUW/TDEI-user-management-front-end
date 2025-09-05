import React from "react";
import { Button, Spinner } from "react-bootstrap";
import DownloadIcon from "@mui/icons-material/Download";
import useDownloadUsers from "../../../hooks/useDownloadActiveUsers";
import style from "../Reports.module.css";

export const UsersReportPanel = () => {
  const { mutate: downloadUsers, isLoading: isDownloadingUsers } = useDownloadUsers();

  const handleDownloadUsers = () => {
    downloadUsers();
  };

  return (
    <div className={style.controlsCard}>
      <div className={style.usersRow}>
        <div className={style.usersText}>
          Download a CSV of active users.
        </div>
        <Button
          className={style.downloadButton}
          onClick={handleDownloadUsers}
          disabled={isDownloadingUsers}
        >
          {isDownloadingUsers ? (
            <Spinner size="sm" />
          ) : (
            <>
              <DownloadIcon className="me-2" /> Download Active Users
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
