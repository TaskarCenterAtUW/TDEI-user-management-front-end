import { createSlice } from "@reduxjs/toolkit";

const initialState = { type: null, message: null };

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    show(state, action) {
      state.type = action.payload.type;
      state.message = action.payload.message;
    },
    hide(state) {
      state.type = null;
      state.message = null;
    },
  },
});

export const { show, hide } = notificationSlice.actions;
export default notificationSlice.reducer;
