import { createSlice } from "@reduxjs/toolkit";

const initialState = { flag: true };

const sideMenuIconSlice = createSlice({
  name: "sideMenuIcon",
  initialState,
  reducers: {
    toggle(state) {
      state.flag = !state.flag;
    },
  },
});

export const { toggle } = sideMenuIconSlice.actions;
export default sideMenuIconSlice.reducer;
