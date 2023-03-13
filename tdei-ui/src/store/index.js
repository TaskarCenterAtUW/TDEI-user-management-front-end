import { configureStore } from "@reduxjs/toolkit";
import notificationSlice from "./notification.slice";
import notificationModalSlice from "./notificationModal.slice";
import orgRolesSlice from "./orgRoles.slice";

export default configureStore({
  reducer: {
    notification: notificationSlice,
    selectedOrg: orgRolesSlice,
    notificationModal: notificationModalSlice,
  },
});

export * from "./notification.slice";
export * from "./orgRoles.slice";
