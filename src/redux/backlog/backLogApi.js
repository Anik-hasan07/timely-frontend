import { apiSlice } from '../api/apiSlice';

const backlogAPI = apiSlice.injectEndpoints({
  tagTypes: ['tasks'],
  endpoints: (builder) => ({
    getTaskById: builder.query({
      query: (taskId) => ({
        url: `/tasks/${taskId}`,
        method: 'GET',
      }),
      providesTags: ['tasks'],
    }),

    updatePostById: builder.mutation({
      query: ({ taskId, updateData }) => ({
        url: `/task/${taskId}`,
        method: 'PATCH',
        body: updateData,
      }),
      invalidatesTags: ['tasks'],
    }),
  }),
});

export const { useGetTaskByIdQuery, useUpdatePostByIdMutation } = backlogAPI;
