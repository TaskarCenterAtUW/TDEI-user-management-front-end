import { configureStore } from "@reduxjs/toolkit";
import notificationSlice from "./notification.slice";
import notificationModalSlice from "./notificationModal.slice";
import projectGroupRolesSlice from "./projectGroupRoles.slice";
import sideMenuBarSlice from "./sideMenuBar.slice";

export default configureStore({
  reducer: {
    notification: notificationSlice,
    selectedProjectGroup: projectGroupRolesSlice,
    notificationModal: notificationModalSlice,
    sideMenuBar: sideMenuBarSlice,
  },
});

export * from "./notification.slice";
export * from "./projectGroupRoles.slice";
