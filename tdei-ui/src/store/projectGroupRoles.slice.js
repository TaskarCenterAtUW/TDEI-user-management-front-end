import { createSlice } from "@reduxjs/toolkit";

const projectGroupRolesSlice = createSlice({
  name: "selectedProjectGroup",
  initialState: JSON.parse(localStorage.getItem("selectedProjectGroup")) || {},
  reducers: {
    set(state, action) {
      const newState = {
        name: action.payload.project_group_name || action.payload.name,
        tdei_project_group_id: action.payload.tdei_project_group_id,
        roles: action.payload.roles || [],
      };
      localStorage.setItem("selectedProjectGroup", JSON.stringify(newState));
      return newState;
    },
    clear() {
      localStorage.removeItem("selectedProjectGroup");
      return {};
    },
  },
});


export const { set, clear } = projectGroupRolesSlice.actions;
export default projectGroupRolesSlice.reducer;
