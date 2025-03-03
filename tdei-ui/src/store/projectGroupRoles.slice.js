// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {};

// const projectGroupRolesSlice = createSlice({
//   name: "selectedProjectGroup",
//   initialState,
//   reducers: {
//     set(state, action) {
//       state.name = action.payload.project_group_name;
//       state.tdei_project_group_id = action.payload.tdei_project_group_id;
//       state.roles = action.payload.roles;
//     },
//   },
// });

// export const { set } = projectGroupRolesSlice.actions;
// export default projectGroupRolesSlice.reducer;

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
      console.log("Saving to localStorage:", newState);
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
