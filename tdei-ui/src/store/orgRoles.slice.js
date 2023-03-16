import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

const orgRolesSlice = createSlice({
  name: "selectedOrg",
  initialState,
  reducers: {
    set(state, action) {
      state.org_name = action.payload.org_name;
      state.tdei_org_id = action.payload.tdei_org_id;
      state.roles = action.payload.roles;
    },
  },
});

export const { set } = orgRolesSlice.actions;
export default orgRolesSlice.reducer;
