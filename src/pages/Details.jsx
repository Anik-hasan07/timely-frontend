import { Box, Skeleton, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import EditableDescription from '../components/EditableDescription/EditableDescription';
import DetailsBreadcrumbs from '../components/TaskDetails/Breadcrumb';
import { useGetProjectQuery, useGetProjectSprintsQuery } from '../redux/api/apiSlice';
import { useGetTaskByIdQuery, useUpdatePostByIdMutation } from '../redux/backlog/backLogApi';
import { isEmpty } from '../utils/checkEmptyObject';

import EditableInput from '../components/EditableInput/EditableInput';
import RightSidebar from '../components/RightSidebar';
import { dateTimeFormat, fromNow } from '../utils/dateTime';
import { getTaskByProject } from './ProjectDetails/reducer';

const iconCode = {
  task: 10318,
  bug: 10303,
  story: 10315,
};

function createBreadCrumbData({ projectName, taskNumber, projectId, type }) {
  let iCode = iconCode.task;
  if (type === 'story') iCode = iconCode.story;
  if (type === 'bug') iCode = iconCode.bug;
  return [
    { title: 'Projects', href: '/projects' },
    {
      title: projectName,
      href: `/projects/${projectId}`,
      iconImgSrc:
        'https://vanquishers.atlassian.net/rest/api/2/universal_avatar/view/type/project/avatar/10553?size=medium',
    },
    {
      title: taskNumber,
      herf: '#',
      iconImgSrc: `https://vanquishers.atlassian.net/rest/api/2/universal_avatar/view/type/issuetype/avatar/${iCode}?size=medium`,
    },
  ];
}

export function TaskDetails() {
  const { taskId, projectId } = useParams();
  const dispatch = useDispatch();
  const [updatedTaskDetail, setUpdatedTaskDetail] = useState(null);
  const { isError, isFetching, isLoading, data } = useGetTaskByIdQuery(taskId, {
    skip: !taskId || !!updatedTaskDetail,
  });
  const taskDetails = updatedTaskDetail || data?.data?.task;
  const [rightSideBarSelectedData, setRightSideBarSelectedData] = useState({});
  const [updatedData, setUpdatedData] = useState({});
  const { userReducer } = useSelector((state) => state);
  const { showSkeleton } = useSelector((state) => state.sprintReducer);

  const [
    updatePostById,
    // {
    //   data: updateTaskResponse,
    //   isLoading: updateTaskLoading,
    //   isError: updateTaskIsError,
    //   error: updateTaskError,
    // },
  ] = useUpdatePostByIdMutation('sharedUpdateTask');
  const {
    data: projectData,
    isLoading: isProjectLoading,
    isError: isProjectError,
  } = useGetProjectQuery(projectId, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  });

  const handleUpdate = (updateTaskData) => {
    const { status, assigneeId, storyPoint, reporterId, sprint, dueDate, priority } =
      rightSideBarSelectedData || {};
    const updateTask = {
      taskName: taskDetails?.taskName,
      reporterId: reporterId || taskDetails?.reporterId,
      assigneeId: assigneeId || taskDetails?.assigneeId,
      taskDetails: taskDetails?.taskDetails,
      priority: priority || taskDetails?.priority,
      storyPoint: storyPoint || taskDetails?.storyPoint,
      dueDate: taskDetails?.dueDate,
      type: taskDetails?.type,
      status: status || taskDetails?.status,
      ...updateTaskData,
    };
    if (sprint) updateTask.sprintId = sprint;
    if (dueDate) updateTask.dueDate = dueDate;
    setUpdatedData((prev) => ({ ...prev, ...updateTask }));
    setUpdatedTaskDetail({ ...taskDetails, ...updateTask });
  };

  useEffect(() => {
    if (isLoading) {
      setRightSideBarSelectedData({});
      setUpdatedData({});
    }
  }, [isLoading]);

  useEffect(() => {
    const updateObject = { ...updatedData, ...rightSideBarSelectedData };

    if (!isEmpty(updateObject) && taskDetails?.taskId) {
      updatePostById({
        taskId: taskDetails?.taskId,
        updateData: updateObject,
      }).then(() =>
        dispatch(
          getTaskByProject({
            projectId,
            token: userReducer.token,
          })
        )
      );
    }
  }, [rightSideBarSelectedData, taskDetails?.taskId, updatePostById, updatedData]);

  const { data: projectSprintsData, isLoading: isLoadingSprintOptions } =
    useGetProjectSprintsQuery(projectId);
  const sprintOptions = projectSprintsData?.data?.sprints;

  if (isError)
    return (
      <Typography color="red" variant="h6">
        Couldn&apos;t fetch task details,try again!
      </Typography>
    );

  return (
    <>
      <Box flex={4}>
        <Stack height="80vh" p={2} style={{ overflowY: 'auto' }}>
          {showSkeleton ? (
            <DetailsPageSkleton />
          ) : (
            <>
              <DetailsBreadcrumbs breadcrumbItems={createBreadCrumbData(taskDetails || {})} />
              <EditableInput
                typographyStyle={{
                  fontSize: '20px',
                  fontWeight: '600',
                  variant: 'h3',
                  color: '#172b4d',
                  textTransform: 'capitalize',
                }}
                text={taskDetails?.taskName}
                updatedText={(text) => handleUpdate({ taskName: text })}
              />
              <EditableDescription
                data={taskDetails?.taskDetails || ``}
                updatedData={(description) => handleUpdate({ taskDetails: description })}
              />
            </>
          )}
        </Stack>
      </Box>

      {isError ? (
        <Typography color="red" variant="h6">
          Error at fetching task
        </Typography>
      ) : (
        <Box flex={2}>
          {isLoading || isLoadingSprintOptions ? (
            <SidebarSkleton />
          ) : (
            <RightSidebar
              project={{ projectId, projectData, isProjectLoading, isProjectError }}
              projectSprints={sprintOptions}
              taskData={taskDetails}
              createDate={taskDetails?.createdOn && dateTimeFormat(taskDetails?.createdOn)}
              updateDate={taskDetails?.updatedOn && fromNow(taskDetails?.updatedOn)}
              getSelectedData={(value) => setRightSideBarSelectedData(value)}
              storyPoint={taskDetails?.storyPoint}
            />
          )}
        </Box>
      )}
    </>
  );
}

function DetailsPageSkleton() {
  return (
    <>
      <Skeleton variant="rectangular" width="80%" height={40} sx={{ marginBottom: '10px' }} />
      <Skeleton variant="rectangular" width="40%" height={60} sx={{ marginBottom: '10px' }} />
      <Skeleton variant="rectangular" width="80%" height={160} sx={{ marginBottom: '10px' }} />
    </>
  );
}

function SidebarSkleton() {
  return (
    <>
      <Skeleton variant="rectangular" width="40%" height={40} sx={{ marginBottom: '10px' }} />
      <Skeleton variant="rectangular" width="40%" height={40} sx={{ marginBottom: '10px' }} />
      <Skeleton variant="rectangular" width="80%" height={40} sx={{ marginBottom: '10px' }} />
      <Skeleton variant="rectangular" width="80%" height={40} sx={{ marginBottom: '10px' }} />
      <Skeleton variant="rectangular" width="80%" height={40} sx={{ marginBottom: '10px' }} />
    </>
  );
}
