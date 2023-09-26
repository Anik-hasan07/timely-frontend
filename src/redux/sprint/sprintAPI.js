import { apiSlice } from '../api/apiSlice';

const sprintAPI = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSprintTasks: builder.query({
      query: (sprintId) => ({
        url: `sprint/${sprintId}/tasks`,
        method: 'GET',
      }),
      providesTags: ['getSprintTasks'],
    }),

    addTaskSprint: builder.mutation({
      query: (taskdata) => ({
        url: `sprint/task`,
        method: 'POST',
        body: { taskId: taskdata?.taskId, sprintId: taskdata?.sprintId },
      }),
      invalidatesTags: ['getSprintTasks'],
    }),

    removeTaskSprint: builder.mutation({
      query: (taskdata) => ({
        url: `sprint/task/${taskdata?.taskId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['getSprintTasks'],
    }),

    startSprint: builder.mutation({
      query: ({ sprintId, startDate, endDate }) => ({
        url: `/sprint/${sprintId}/start`,
        method: 'PATCH',
        body: { startDate, endDate },
      }),
      invalidatesTags: ['getSprintTasks'],
    }),
  }),
});

export const {
  useAddTaskSprintMutation,
  useRemoveTaskSprintMutation,
  useGetSprintTasksQuery,
  useStartSprintMutation,
} = sprintAPI;
