import { createSlice } from "@reduxjs/toolkit";

const initialState = { message: null };

const notificationModalSlice = createSlice({
  name: "notificationModal",
  initialState,
  reducers: {
    show(state, action) {
      state.message = action.payload.message;
    },
    hide(state) {
      state.message = null;
    },
  },
});

export const { show, hide } = notificationModalSlice.actions;
export default notificationModalSlice.reducer;
