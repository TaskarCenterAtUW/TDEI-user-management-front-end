import React, {useState} from "react";
import { Button, Spinner } from "react-bootstrap";
import DownloadIcon from "@mui/icons-material/Download";
import useDownloadUsers from "../../../hooks/useDownloadActiveUsers";
import style from "../Reports.module.css";
import clsx from "clsx";
import ResponseToast from "../../../components/ToastMessage/ResponseToast";

export const UsersReportPanel = () => {
  const { mutate: downloadUsers, isLoading: isDownloadingUsers } = useDownloadUsers();
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState("success");
  const [toastMessage, setToastMessage] = useState("");

   const handleDownloadUsers = () => {
    downloadUsers(undefined, {
      onSuccess: ({ filename }) => {
        setToastType("success");
        setToastMessage(`Downloaded ${filename}.`);
        setShowToast(true);
      },
      onError: (err) => {
        const msg = (err && err.message) || "Failed to download CSV.";
        setToastType("error");
        setToastMessage(msg);
        setShowToast(true);
      },
    });
  };

  return (
    <div className={style.controlsCard}>
      <div className={style.usersRow}>
        <div className={style.usersText}>
          Download a CSV of active users.
        </div>
        <Button
           className={clsx("tdei-primary-button", style.downloadBtn)}
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
       <ResponseToast
        showtoast={showToast}
        handleClose={() => setShowToast(false)}
        message={toastMessage}
        type={toastType}
        autoHideDuration={3000}
      />
    </div>
  );
};
