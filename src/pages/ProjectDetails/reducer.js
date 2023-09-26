/* eslint-disable no-underscore-dangle */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiEndpoint } from '../../config/config';

export const getTaskByProject = createAsyncThunk(
  'getTaskByProject',
  async (projectData, { rejectWithValue }) => {
    const { projectId, token } = projectData;
    try {
      const headers = new Headers();
      headers.append('Authorization', `Bearer ${token}`);
      const requestOptions = {
        method: 'GET',
        headers,
        redirect: 'follow',
      };
      const res = await fetch(`${apiEndpoint}/project/${projectId}/task`, requestOptions);

      if (res.status === 200) {
        const myRes = (await res.json()).data;
        return myRes;
      }
      throw Error();
    } catch (error) {
      return rejectWithValue('Error at fetching Task by project details');
    }
  }
);

export const deleteTask = createAsyncThunk(
  'deleteTask',
  async (data, { dispatch, rejectWithValue }) => {
    try {
      const { taskId, token } = data;
      const headers = new Headers();
      headers.append('Authorization', `Bearer ${token}`);
      const requestOptions = {
        method: 'DELETE',
        headers,
        redirect: 'follow',
      };

      // eslint-disable-next-line no-undef
      const res = await fetch(`${apiEndpoint}/task/${taskId}`, requestOptions);
      if (res.status === 200) {
        // eslint-disable-next-line no-use-before-define, no-undef
        dispatch(setTaskId(taskId));
        return true;
      }
      throw Error();
    } catch (error) {
      return rejectWithValue('Error at deleting task');
    }
  }
);

export const updateTaskStatus = createAsyncThunk(
  'updateTaskStatus',
  // eslint-disable-next-line no-unused-vars
  async (data, { dispatch, rejectWithValue }) => {
    try {
      const { taskId, status } = data;
      const requestOptions = {
        method: 'PATCH',
        redirect: 'follow',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      };
      // eslint-disable-next-line no-undef
      const res = await fetch(`${apiEndpoint}/tasks/${taskId}/status`, requestOptions);
      if (res.status === 200) return { taskId, status };
      throw Error();
    } catch (error) {
      return rejectWithValue('Error Updating Task status');
    }
  }
);

export const getTask = createAsyncThunk('getTask', async (data, { rejectWithValue }) => {
  try {
    const { taskId, token } = data;
    const headers = new Headers();
    headers.append('Authorization', `Bearer ${token}`);
    headers.append('Content-Type', `application/json`);
    const requestOptions = {
      method: 'GET',
      redirect: 'follow',
      headers,
    };

    const res = await fetch(`${apiEndpoint}/tasks/${taskId}`, requestOptions);
    if (res.status === 200) return (await res.json()).data;
    throw Error();
  } catch (error) {
    return rejectWithValue('Error Updating Task status');
  }
});

const initialState = {
  isFetchingTask: false,
  isDeletingTask: false,
  isDeletedTask: false,
  isDeletingError: false,
  isFetchingError: false,
  isUpdatingStatus: false,
  isUpdatedStatus: false,
  isUpdatingStatusError: false,
  errorMsg: null,
  taskId: '',
  tasks: [],
  task: null,
  projectId: '',
};
export const taskByProjectSlice = createSlice({
  name: 'taskByProjectReducers',
  initialState,
  extraReducers: {
    [getTaskByProject.pending]: (state) => {
      state.errorMsg = null;
      state.isFetchingError = false;
      state.isFetchingTask = true;
    },
    [getTaskByProject.fulfilled]: (state, { payload }) => {
      state.isFetchingTask = false;
      state.tasks = payload.tasks;
    },
    [getTaskByProject.rejected]: (state, action) => {
      state.isFetchingError = true;
      state.errorMsg = action.payload;
      state.isFetchingTask = false;
    },
    [deleteTask.pending]: (state) => {
      state.errorMsg = null;
      state.isDeletingError = false;
      state.isDeletingTask = true;
      state.isDeletedTask = false;
    },
    [deleteTask.fulfilled]: (state) => {
      state.isDeletingTask = false;
      const tasks = state.tasks.filter((task) => task.taskId !== state.taskId);
      state.tasks = tasks;
      state.taskId = '';
      state.isDeletedTask = true;
    },
    [deleteTask.rejected]: (state, action) => {
      state.isDeletingError = true;
      state.errorMsg = action.payload;
      state.isDeletingTask = false;
    },
    [updateTaskStatus.pending]: (state) => {
      state.errorMsg = null;
      state.isUpdatingStatusError = false;
      state.isUpdatingStatus = true;
    },
    [updateTaskStatus.fulfilled]: (state, { payload }) => {
      state.isUpdatingStatus = false;
      state.isUpdatedStatus = true;
      const updatedTasks = state.tasks.map((item) => {
        if (item.taskId === payload.taskId) {
          return { ...item, ...payload };
        }
        return item;
      });
      state.tasks = updatedTasks;
      state.taskId = '';
    },
    [updateTaskStatus.rejected]: (state, action) => {
      state.isUpdatingStatusError = true;
      state.errorMsg = action.payload;
      state.isUpdatingStatus = false;
    },
    [getTask.pending]: (state) => {
      state.errorMsg = null;
      state.isFetchingError = false;
      state.isFetchingTask = true;
    },
    [getTask.fulfilled]: (state, { payload }) => {
      state.isFetchingTask = false;
      state.task = payload.task;
    },
    [getTask.rejected]: (state, action) => {
      state.isFetchingError = true;
      state.errorMsg = action.payload;
      state.isFetchingTask = false;
    },
  },

  reducers: {
    setTaskId: (state, { payload }) => {
      state.taskId = payload;
    },
    setProjectId: (state, { payload }) => {
      state.projectId = payload;
    },
    addTaskSprintToBacklog: (state, action) => {
      const duplicateTask = state.tasks.find(({ taskId }) => taskId === action.payload.taskId);

      if (!duplicateTask) {
        state.tasks.push({ ...action.payload, sprintId: '' });
      }
    },
    removeTaskFromBacklog: (state, action) => {
      state.tasks = state.tasks.filter(({ taskId }) => taskId !== action.payload.taskId);
    },
    setTasks: (state, { payload }) => {
      state.tasks = payload;
    },
    setTaskInReducer: (state, { payload }) => {
      const filteredTasks = state.tasks.filter((task) => task.taskId === payload._id.toString());
      state.tasks = [...filteredTasks, payload];
    },
  },
});
export const {
  setTaskId,
  setProjectId,
  addTaskSprintToBacklog,
  removeTaskFromBacklog,
  setTasks,
  setTaskInReducer,
} = taskByProjectSlice.actions;
export default taskByProjectSlice.reducer;
