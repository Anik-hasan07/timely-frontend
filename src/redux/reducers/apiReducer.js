import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { apiEndpoint } from '../../config/config';

// Define a service using a base URL and expected endpoints
export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: apiEndpoint,
    prepareHeaders: (headers, { getState }) => {
      const token = getState()?.userReducer?.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['tasks'],
  endpoints: (builder) => ({
    getUserTask: builder.query({
      query: () => `tasks`,
      providesTags: ['tasks'],
    }),
    getAllUsers: builder.query({
      query: () => `/users`,
    }),
    getWorkedOnTask: builder.query({
      query: () => `/tasks/worked-on`,
    }),
  }),
});

export const { useGetUserTaskQuery, useGetAllUsersQuery, useGetWorkedOnTaskQuery } = userApi;
