import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiEndpoint } from '../../../config/config';

// Define the async thunk action
export const getProjectUsers = createAsyncThunk(
  'getProjectUsers',
  async ({ token, projectId }, { rejectWithValue }) => {
    try {
      const headers = new Headers();
      headers.append('Authorization', `Bearer ${token}`);
      const requestOptions = {
        method: 'GET',
        headers,
      };

      const res = await fetch(`${apiEndpoint}/project/${projectId}/users`, requestOptions);
      if (res.status === 200) return (await res.json()).data;
      throw Error();
    } catch (error) {
      return rejectWithValue('Error at fetching projects users');
    }
  }
);

export const deleteProjectUsers = createAsyncThunk(
  'deleteProjectUsers',
  async ({ token, projectId, userId, rejectWithValue }) => {
    try {
      const headers = new Headers();
      headers.append('Authorization', `Bearer ${token}`);
      const requestOptions = {
        method: 'DELETE',
        headers,
        redirect: 'follow',
      };

      const res = await fetch(`${apiEndpoint}/project/${projectId}/${userId}`, requestOptions);
      if (res.status === 200) return userId;
      throw Error();
    } catch (error) {
      return rejectWithValue('Error at deleting project');
    }
  }
);
export const activeUserFromProject = createAsyncThunk(
  'activeUserFromProject',
  async ({ token, projectId, userId, status, rejectWithValue }) => {
    try {
      const headers = new Headers();
      headers.append('Authorization', `Bearer ${token}`);
      headers.append('Content-Type', 'application/json');

      const requestOptions = {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ status }),
        redirect: 'follow',
      };

      const res = await fetch(`${apiEndpoint}/project/${projectId}/${userId}`, requestOptions);

      if (res.status === 200) return userId;
      throw new Error('Status update failed');
    } catch (error) {
      return rejectWithValue('Error at active user from project');
    }
  }
);
