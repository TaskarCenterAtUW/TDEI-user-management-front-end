import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

const projectGroupRolesSlice = createSlice({
  name: "selectedProjectGroup",
  initialState,
  reducers: {
    set(state, action) {
      state.name = action.payload.name;
      state.tdei_project_group_id = action.payload.tdei_project_group_id;
      state.roles = action.payload.roles;
    },
  },
});

export const { set } = projectGroupRolesSlice.actions;
export default projectGroupRolesSlice.reducer;
