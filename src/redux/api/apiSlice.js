/* eslint-disable no-unused-vars */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { apiEndpoint } from '../../config/config';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: apiEndpoint,
    prepareHeaders: async (headers, { getState, endpoint }) => {
      const token = getState()?.userReducer?.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['projects'],
  endpoints: (builder) => ({
    createTask: builder.mutation({
      query: (data) => ({
        url: '/tasks',
        method: 'POST',
        body: data,
      }),
    }),
    getProjects: builder.query({
      query: () => ({
        url: '/projects',
        method: 'GET',
      }),
      providesTags: ['projects'],
    }),
    getProject: builder.query({
      query: (projectId) => ({
        url: `/project/${projectId}`,
        method: 'GET',
      }),
      providesTags: ['projects'],
    }),
    getProjectUsers: builder.query({
      query: (projectId) => ({
        url: `/project/${projectId}/users`,
        method: 'GET',
      }),
    }),
    getProjectSprints: builder.query({
      query: (projectId) => ({
        url: `/project/${projectId}/sprints`,
        method: 'GET',
      }),
    }),
    createProject: builder.mutation({
      query: (data) => ({
        url: '/project',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['projects'],
    }),
    getAllOrgProject: builder.query({
      query: (data) => ({
        url: '/org/projects',
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useCreateProjectMutation,
  useCreateTaskMutation,
  useGetProjectsQuery,
  useGetProjectQuery,
  useGetProjectUsersQuery,
  useLazyGetProjectUsersQuery,
  useLazyGetProjectSprintsQuery,
  useGetProjectSprintsQuery,
  useGetAllOrgProjectQuery,
} = apiSlice;
