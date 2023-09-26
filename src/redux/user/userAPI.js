import { apiSlice } from '../api/apiSlice';

const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: () => ({
        url: '/users',
        method: 'GET',
      }),
    }),
    updateUserRole: builder.mutation({
      query: ({ userId, role }) => ({
        url: `/users/${userId}/role`,
        method: 'PATCH',
        body: role,
      }),
    }),
  }),
});

export const { useGetAllUsersQuery, useUpdateUserRoleMutation } = userApi;
