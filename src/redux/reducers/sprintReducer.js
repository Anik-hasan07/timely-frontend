/* eslint-disable no-underscore-dangle */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { privateGet, privatePatch } from '../../utils/apiCaller';

export const getProjectSprints = createAsyncThunk(
  'getProjectSprints',
  // eslint-disable-next-line consistent-return
  async (data, { rejectWithValue }) => {
    try {
      const { projectId, token } = data;
      const resData = await privateGet(`project/${projectId}/sprints`, token);
      return resData;
    } catch (error) {
      rejectWithValue('Error at fetching project sprints');
    }
  }
);

export const getSprintTasks = createAsyncThunk(
  'getSprintTasks',
  // eslint-disable-next-line consistent-return
  async (data, { rejectWithValue }) => {
    try {
      const { sprintId, token } = data;
      const resData = await privateGet(`sprint/${sprintId}/tasks`, token);
      return resData;
    } catch (error) {
      rejectWithValue('Error at fetching sprint tasks');
    }
  }
);
export const getActiveSprint = createAsyncThunk(
  'getActiveSprint',
  // eslint-disable-next-line consistent-return
  async (data, { rejectWithValue }) => {
    try {
      const { orgId, token, projectId } = data;
      const resData = await privateGet(`org/${orgId}/project/${projectId}/active-sprint`, token);
      return resData;
    } catch (error) {
      rejectWithValue('Error at fetching Active sprint');
    }
  }
);

// eslint-disable-next-line consistent-return
export const endSprint = createAsyncThunk('endSprint', async (data, { rejectWithValue }) => {
  try {
    const { sprintId, token, moveTo } = data;
    const resData = await privatePatch(`sprint/${sprintId}/end`, token, { moveTo });
    return resData;
  } catch (error) {
    rejectWithValue('Error at ending sprint');
  }
});

const initialState = {
  errorMsg: null,
  hasFetchingError: false,
  isFetchingSprints: false,
  isFetchingActiveSprints: false,
  sprints: null,
  isFetchingTasks: false,
  hasEndSprintError: false,
  isEndingSprint: false,
  isEndingSprintSuccess: false,
  tasks: null,
  activeSprint: null,
  showSkeleton: true,
};

export const sprintSlice = createSlice({
  name: 'sprintReducer',
  initialState,
  reducers: {
    sprintTask: (state, action) => {
      state.tasks = action.payload;
    },
    addTaskBacklogToSprint: (state, action) => {
      const duplicateTask = state.tasks.find(({ taskId }) => taskId === action.payload.taskId);
      if (!duplicateTask) {
        state.tasks.push(action.payload);
      }
    },
    removeTaskFromSprint: (state, action) => {
      state.tasks = state.tasks.filter(({ taskId }) => taskId !== action.payload.taskId);
    },
    setSprintTasks: (state, { payload }) => {
      state.tasks = payload;
    },
    setSprintTaskInReducer: (state, { payload }) => {
      const taskIndex = state.tasks.findIndex((task) => task.taskId === payload.taskId);
      delete payload.taskId;
      const stateTasks = [...state.tasks];
      Object.keys(payload).forEach((key) => {
        stateTasks[taskIndex][key] = payload[key];
      });
      state.tasks = stateTasks;
    },
    setShowSkeleton: (state, { payload }) => {
      state.showSkeleton = payload;
    },
  },
  extraReducers: {
    [getProjectSprints.pending]: (state) => {
      state.errorMsg = null;
      state.hasFetchingError = false;
      state.isFetchingSprints = true;
      state.sprints = null;
    },
    [getProjectSprints.fulfilled]: (state, { payload }) => {
      state.isFetchingSprints = false;
      state.sprints = payload?.sprints;
    },
    [getProjectSprints.rejected]: (state, { payload }) => {
      state.errorMsg = payload;
      state.hasFetchingError = true;
      state.isFetchingSprints = false;
    },
    [getSprintTasks.pending]: (state) => {
      state.errorMsg = null;
      state.hasFetchingError = false;
      state.isFetchingTasks = true;
      state.tasks = null;
    },
    [getSprintTasks.fulfilled]: (state, { payload }) => {
      state.isFetchingTasks = false;
      state.tasks = payload?.tasks;
    },
    [getSprintTasks.rejected]: (state, { payload }) => {
      state.errorMsg = payload;
      state.hasFetchingError = false;
      state.isFetchingTasks = false;
    },

    [getActiveSprint.pending]: (state) => {
      state.errorMsg = null;
      state.hasFetchingError = false;
      state.isFetchingActiveSprints = true;
    },
    [getActiveSprint.fulfilled]: (state, { payload }) => {
      const { activeSprint } = payload;
      state.activeSprint = {
        // eslint-disable-next-line no-underscore-dangle
        sprintId: activeSprint?.sprintId?._id,
        sprintNumber: activeSprint?.sprintId?.sprintNumber,
        sprintStatus: activeSprint?.sprintId?.status,
        startDate: activeSprint?.sprintId?.startDate,
        endDate: activeSprint?.sprintId?.endDate || undefined,
      };
      state.isFetchingActiveSprints = false;
    },
    [getActiveSprint.rejected]: (state, { payload }) => {
      state.errorMsg = payload;
      state.isFetchingActiveSprints = false;
      state.hasFetchingError = true;
    },
    [endSprint.pending]: (state) => {
      state.errorMsg = null;
      state.hasEndSprintError = false;
      state.isEndingSprint = true;
      state.isEndingSprintSuccess = false;
    },
    [endSprint.fulfilled]: (state) => {
      state.hasEndSprintError = false;
      state.isEndingSprint = false;
      state.isEndingSprintSuccess = true;
    },
    [endSprint.rejected]: (state, { payload }) => {
      state.errorMsg = payload;
      state.hasEndSprintError = true;
      state.isEndingSprint = false;
    },
  },
});

export default sprintSlice.reducer;
export const {
  sprintTask,
  addTaskBacklogToSprint,
  removeTaskFromSprint,
  setSprintTasks,
  setSprintTaskInReducer,
  setShowSkeleton,
} = sprintSlice.actions;
