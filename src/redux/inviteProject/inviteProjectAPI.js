import { apiSlice } from '../api/apiSlice';

const inviteProjectAPI = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    inviteProjectUsers: builder.mutation({
      query: ({ projectId, emails }) => ({
        url: `/project/${projectId}/invite`,
        method: 'POST',
        body: emails,
      }),
    }),
  }),
});

export const { useInviteProjectUsersMutation } = inviteProjectAPI;
