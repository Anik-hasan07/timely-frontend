/* eslint-disable no-underscore-dangle */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiEndpoint } from '../../config/config';

export const getProjects = createAsyncThunk('getProjects', async (token, { rejectWithValue }) => {
  try {
    const headers = new Headers();
    headers.append('Authorization', `Bearer ${token}`);
    const requestOptions = {
      method: 'GET',
      headers,
      redirect: 'follow',
    };

    const res = await fetch(`${apiEndpoint}/projects`, requestOptions);
    if (res.status === 200) return (await res.json()).data;
    throw Error();
  } catch (error) {
    return rejectWithValue('Error at fetching projects details');
  }
});
export const deleteProject = createAsyncThunk(
  'deleteProject',
  async (data, { dispatch, rejectWithValue }) => {
    try {
      const { projectId, token } = data;
      const headers = new Headers();
      headers.append('Authorization', `Bearer ${token}`);
      const requestOptions = {
        method: 'DELETE',
        headers,
        redirect: 'follow',
      };

      const res = await fetch(`${apiEndpoint}/project/${projectId}`, requestOptions);
      if (res.status === 200) {
        // eslint-disable-next-line no-use-before-define
        dispatch(setProjectId(projectId));
        return true;
      }
      throw Error();
    } catch (error) {
      return rejectWithValue('Error at deleting project');
    }
  }
);
export const updateProject = createAsyncThunk(
  'updateProject',
  async (data, { dispatch, rejectWithValue }) => {
    try {
      const { projectId, token, projectData } = data;
      const headers = new Headers();
      headers.append('Authorization', `Bearer ${token}`);
      headers.append('Content-Type', `application/json`);
      const requestOptions = {
        method: 'PATCH',
        headers,
        body: JSON.stringify(projectData),
        redirect: 'follow',
      };

      const res = await fetch(`${apiEndpoint}/project/${projectId}`, requestOptions);

      if (res.status === 200) {
        // eslint-disable-next-line no-use-before-define
        dispatch(setProjectId(projectId));
        const resData = await res.json();
        return resData.data;
      }
      throw Error();
    } catch (error) {
      return rejectWithValue('Error at updating project');
    }
  }
);

const initialState = {
  isFetchingProjects: false,
  isFetchingError: false,
  isDeletingProject: false,
  isDeletingError: false,
  isUpdatingProject: false,
  isUpdatingError: false,
  projectId: '',
  errorMsg: null,
  projects: [],
  selectedProject: null,
  isCreateProjectModalOpen: false,
  isInviteProjectUserModalOpen: false,
};

export const projectSlice = createSlice({
  name: 'projectReducer',
  initialState,
  extraReducers: {
    [getProjects.pending]: (state) => {
      state.errorMsg = null;
      state.isFetchingError = false;
      state.isFetchingProjects = true;
    },
    [getProjects.fulfilled]: (state, { payload }) => {
      state.isFetchingProjects = false;
      state.projects = payload.projects;
    },
    [getProjects.rejected]: (state, action) => {
      state.isFetchingError = true;
      state.errorMsg = action.payload;
      state.isFetchingProjects = false;
    },
    [deleteProject.pending]: (state) => {
      state.errorMsg = null;
      state.isDeletingError = false;
      state.isDeletingProject = true;
    },
    [deleteProject.fulfilled]: (state) => {
      state.isDeletingProject = false;
      const projects = state.projects.filter((project) => project.projectId !== state.projectId);
      state.projects = projects;
      state.projectId = '';
    },
    [deleteProject.rejected]: (state, action) => {
      state.isDeletingError = true;
      state.errorMsg = action.payload;
      state.isDeletingProject = false;
    },
    [updateProject.pending]: (state) => {
      state.errorMsg = null;
      state.isUpdatingError = false;
      state.isUpdatingSuccess = false;
      state.isUpdatingProject = true;
    },
    [updateProject.fulfilled]: (state, { payload }) => {
      state.isUpdatingProject = false;
      const projects = state.projects.map((project) => {
        if (project.projectId === state.projectId) {
          project = payload;
        }
        return project;
      });
      payload.projectId = payload._id;
      delete payload._id;
      state.projects = projects;
      state.selectedProject = payload;
      state.projectId = payload.projectId;
      state.isUpdatingSuccess = true;
    },
    [updateProject.rejected]: (state, action) => {
      state.isUpdatingError = true;
      state.errorMsg = action.payload;
      state.isUpdatingProject = false;
      state.isUpdatingSuccess = false;
    },
  },

  reducers: {
    setProjectId: (state, { payload }) => {
      state.projectId = payload;
    },
    setSelectedProject: (state, { payload }) => {
      state.selectedProject = payload;
    },
    clearSetSelectedProject: (state) => {
      state.selectedProject = null;
    },
    toggleIsCreateProjectModalOpen: (state) => {
      state.isCreateProjectModalOpen = !state.isCreateProjectModalOpen;
    },
    toggleisInviteProjectUserModalOpen: (state) => {
      state.isInviteProjectUserModalOpen = !state.isInviteProjectUserModalOpen;
    },
    resetUpdateProject: (state) => {
      state.errorMsg = null;
      state.isUpdatingError = false;
      state.isUpdatingSuccess = false;
      state.isUpdatingProject = false;
    },
  },
});

export const {
  setProjectId,
  setSelectedProject,
  toggleIsCreateProjectModalOpen,
  toggleisInviteProjectUserModalOpen,
  resetUpdateProject,
  clearSetSelectedProject,
} = projectSlice.actions;

export default projectSlice.reducer;
