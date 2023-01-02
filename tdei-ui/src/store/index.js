import { configureStore } from "@reduxjs/toolkit";
import notificationSlice from './notification.slice'

export default configureStore({
    reducer: {
        notification: notificationSlice
    }
});

export * from './notification.slice';