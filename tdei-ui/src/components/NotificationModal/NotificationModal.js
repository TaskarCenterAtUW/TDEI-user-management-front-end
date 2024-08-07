import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { getNotificationModal } from "../../selectors";
import { hide } from "../../store/notificationModal.slice";
import SuccessModal from "../SuccessModal";

const NotificationModal = () => {
  const dispatch = useDispatch();
  const notification = useSelector(getNotificationModal);

  const handleHide = () => {
    dispatch(hide({ message: null }));
  };
  return (
    <SuccessModal
      message={notification?.message}
      show={notification?.message}
      onHide={handleHide}
    />
  );
};

export default NotificationModal;
