import { createSlice } from '@reduxjs/toolkit';
import { activeUserFromProject, deleteProjectUsers, getProjectUsers } from './action';

// Create a slice
const projectSlice = createSlice({
  name: 'projectUsers',
  initialState: {
    users: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProjectUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProjectUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(getProjectUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteProjectUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProjectUsers.fulfilled, (state, action) => {
        state.loading = false;
        const userIndex = state.users.users.findIndex((user) => user.id === action.payload);
        const stateUsers = [...state.users.users];
        stateUsers[userIndex].status = 'INACTIVE';
        state.users.users = stateUsers;
      })
      .addCase(deleteProjectUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(activeUserFromProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(activeUserFromProject.fulfilled, (state, action) => {
        state.loading = false;
        const userIndex = state.users.users.findIndex((user) => user.id === action.payload);
        const stateUsers = [...state.users.users];
        stateUsers[userIndex].status = 'ACTIVE';
        state.users.users = stateUsers;
      })
      .addCase(activeUserFromProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export the reducer
export default projectSlice.reducer;
