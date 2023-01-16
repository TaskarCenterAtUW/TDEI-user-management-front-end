import { configureStore } from "@reduxjs/toolkit";
import notificationSlice from './notification.slice'
import orgRolesSlice from "./orgRoles.slice";

export default configureStore({
    reducer: {
        notification: notificationSlice,
        selectedOrg: orgRolesSlice
    }
});

export * from './notification.slice';
export * from './orgRoles.slice';