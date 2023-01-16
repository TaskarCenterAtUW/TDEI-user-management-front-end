import { createSlice } from '@reduxjs/toolkit'



const initialState = {};

const orgRolesSlice = createSlice({
    name: 'selectedOrg',
    initialState,
    reducers: {
        set(state, action) {
            state.orgName = action.payload.orgName;
            state.orgId = action.payload.orgId;
            state.roles = action.payload.roles;
        }
    },
})

export const { set } = orgRolesSlice.actions
export default orgRolesSlice.reducer