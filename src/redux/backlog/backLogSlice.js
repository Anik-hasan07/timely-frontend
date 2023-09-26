import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isBacklogUpdate: false,
};

const backlog = createSlice({
  name: 'backlog',
  initialState,
  reducers: {
    setIsBacklogUpdate: (state, action) => {
      state.isBacklogUpdate = action.payload;
    },
  },
});

export default backlog;
export const { setIsBacklogUpdate } = backlog.actions;
