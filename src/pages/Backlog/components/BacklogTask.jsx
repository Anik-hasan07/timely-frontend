import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Avatar, Box, IconButton, Menu, MenuItem, Tooltip, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useUpdatePostByIdMutation } from '../../../redux/backlog/backLogApi';
import {
  addTaskBacklogToSprint,
  removeTaskFromSprint,
  setSprintTasks,
} from '../../../redux/reducers/sprintReducer';
import { useRemoveTaskSprintMutation } from '../../../redux/sprint/sprintAPI';
import { stringAvatar } from '../../../utils';
import {
  addTaskSprintToBacklog,
  removeTaskFromBacklog,
  setTaskInReducer,
  setTasks,
} from '../../ProjectDetails/reducer';

import { getTasksByProject } from '../../ProjectDetails/action';
import { taskTypeIcon } from './TaskTypeIcon';

const blockStyle = (isSmall) => {
  return {
    display: 'flex',
    gap: '10px',
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    margin: isSmall ? 0 : '10px 0',
    padding: isSmall ? 0 : '10px 5px',
    borderRadius: '5px',
    ':hover': {
      background: !isSmall && '#EEEEEE',
    },
  };
};
const BacklogTask = ({ taskData, isSmall = false, selectedDropItems }) => {
  const { taskName, taskNumber, type, priority, sprintId } = taskData;
  const { activeSprint } = useSelector((state) => state.sprintReducer);
  const { tasks } = useSelector((state) => state.taskByProjectReducers);
  const { tasks: sprintTasks } = useSelector((state) => state.sprintReducer);
  const { token } = useSelector((state) => state.userReducer);
  const { projectId } = useParams();

  const assigneeName = taskData?.assigneeName;
  const userNameCapitalFormation = assigneeName?.toUpperCase();

  const [{ isDragging }, dragItem] = useDrag(() => {
    let taskPassed = taskData;
    if (selectedDropItems?.length > 0) {
      taskPassed = selectedDropItems;
    }
    return {
      type: 'backlogToSprint',
      item: { taskPassed },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    };
  }, [selectedDropItems]);

  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const [removeTaskSprint, { isError }] = useRemoveTaskSprintMutation();
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const [updatePostById, { data: updatedData }] = useUpdatePostByIdMutation('sharedUpdateTask');

  const taskIcon = taskTypeIcon.filter((icon) => icon.type === type?.toLowerCase());

  const handleAddToSprint = (e) => {
    const updatedTaskData = { ...taskData };
    dispatch(removeTaskFromBacklog({ taskId: updatedTaskData.taskId }));
    updatedTaskData.sprintId = activeSprint?.sprintId;
    dispatch(addTaskBacklogToSprint(updatedTaskData));
    updatePostById({
      taskId: taskData?.taskId,
      updateData: updatedTaskData,
    });
    e.stopPropagation();
  };

  const handleRemoveFromSprint = (e) => {
    dispatch(removeTaskFromSprint({ taskId: taskData.taskId }));
    dispatch(addTaskSprintToBacklog(taskData));
    removeTaskSprint(taskData);
    setAnchorEl(null);
    e.stopPropagation();
  };

  const moveTaskToTopOfBacklog = (e) => {
    const updatedTasks = [...tasks];
    const taskIndex = updatedTasks.findIndex((task) => task.taskId === taskData?.taskId);
    if (taskIndex !== -1) {
      const task = updatedTasks.splice(taskIndex, 1)[0];
      updatedTasks.unshift(task);
    }
    dispatch(setTasks(updatedTasks));

    const maxTopNumber = Math.max(
      ...tasks
        .filter((task) => task.position && task.position.includes('top'))
        .map((task) => parseInt(task.position.split('-')[1], 10)),
      0
    );

    const updatedTaskData = {
      ...taskData,
      position: `top-${maxTopNumber + 1}`,
    };

    updatePostById({
      taskId: taskData?.taskId,
      updateData: updatedTaskData,
    }).then(() => {
      dispatch(setTaskInReducer(updatedData));
    });

    setAnchorEl(null);
    e.stopPropagation();
  };

  const moveTaskToBottomOfBacklog = (e) => {
    const updatedTasks = [...tasks];
    const taskIndex = updatedTasks.findIndex((task) => task.taskId === taskData?.taskId);
    if (taskIndex !== -1) {
      const task = updatedTasks.splice(taskIndex, 1)[0];
      updatedTasks.push(task);
    }
    dispatch(setTasks(updatedTasks));

    const maxBottomNumber = Math.max(
      ...tasks
        .filter((task) => task.position && task.position.includes('bottom'))
        .map((task) => parseInt(task.position.split('-')[1], 10)),
      0
    );

    const updatedTaskData = {
      ...taskData,
      position: `bottom-${maxBottomNumber + 1}`,
    };

    updatePostById({
      taskId: taskData?.taskId,
      updateData: updatedTaskData,
    }).then(() =>
      dispatch(
        getTasksByProject({
          projectId,
          token,
        })
      )
    );

    setAnchorEl(null);
    e.stopPropagation();
  };

  const moveTaskToTopOfSprint = (e) => {
    const updatedTasks = [...sprintTasks];
    const taskIndex = updatedTasks.findIndex((task) => task.taskId === taskData?.taskId);
    if (taskIndex !== -1) {
      const task = updatedTasks.splice(taskIndex, 1)[0];
      updatedTasks.unshift(task);
    }
    dispatch(setSprintTasks(updatedTasks));

    const maxTopNumber = Math.max(
      ...sprintTasks
        .filter((task) => task.position && task.position.includes('top'))
        .map((task) => parseInt(task.position.split('-')[1], 10)),
      0
    );

    const updatedTaskData = {
      ...taskData,
      position: `top-${maxTopNumber + 1}`,
    };

    updatePostById({
      taskId: taskData?.taskId,
      updateData: updatedTaskData,
    });

    setAnchorEl(null);
    e.stopPropagation();
  };

  const moveTaskToBottomOfSprint = (e) => {
    const updatedTasks = [...sprintTasks];
    const taskIndex = updatedTasks.findIndex((task) => task.taskId === taskData?.taskId);
    if (taskIndex !== -1) {
      const task = updatedTasks.splice(taskIndex, 1)[0];
      updatedTasks.push(task);
    }
    dispatch(setSprintTasks(updatedTasks));

    const maxBottomNumber = Math.max(
      ...sprintTasks
        .filter((task) => task.position && task.position.includes('bottom'))
        .map((task) => parseInt(task.position.split('-')[1], 10)),
      0
    );

    const updatedTaskData = {
      ...taskData,
      position: `bottom-${maxBottomNumber + 1}`,
    };

    updatePostById({
      taskId: taskData?.taskId,
      updateData: updatedTaskData,
    });

    setAnchorEl(null);
    e.stopPropagation();
  };

  return (
    <>
      <Box
        ref={dragItem}
        style={{
          opacity: isDragging ? 0.5 : 1,
          cursor: 'move',
        }}
        sx={blockStyle(isSmall)}
      >
        <img
          alt="icon"
          height={isSmall ? '16' : '20'}
          width={isSmall ? '16' : '20'}
          src={taskIcon[0]?.icon}
        />
        <Box flexGrow="2">
          <Typography fontSize="14px">{taskName}</Typography>
        </Box>

        {assigneeName && (
          <Tooltip title={assigneeName}>
            <IconButton sx={{ p: 0 }}>
              <Avatar
                style={{ height: isSmall && '24px', width: isSmall && '24px' }}
                {...stringAvatar(userNameCapitalFormation, { fontSize: '12px' })}
              />
            </IconButton>
          </Tooltip>
        )}

        <Typography fontSize="14px">{taskNumber} </Typography>
        <Box
          sx={{
            height: '16px',
            width: '16px',
          }}
        >
          <img
            loading="lazy"
            alt=""
            src={`https://vanquishers.atlassian.net/images/icons/priorities/${priority}.svg`}
          />
        </Box>
        <Box
          sx={{
            padding: '0px 10px',
            borderRadius: '30px',
            marginRight: '5px',
            backgroundColor: '#DCDCDC',
          }}
        >
          <Typography
            sx={{
              textAlign: 'center',
              fontSize: '12px',
              fontWeight: '600',
              lineHeight: '20px',
            }}
          >
            {taskData.storyPoint}
          </Typography>
        </Box>

        <MoreHorizIcon
          sx={{
            cursor: 'pointer',
          }}
          onClick={(e) => {
            e.stopPropagation();
            handleMenuOpen(e);
          }}
        />
      </Box>
      <Menu
        id="menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={(e) => {
          e.stopPropagation();
          handleMenuClose();
        }}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem
          onClick={(e) => (sprintId ? moveTaskToTopOfSprint(e) : moveTaskToTopOfBacklog(e))}
          key={`${taskData?.taskId}-moveTop`}
        >
          Move to {sprintId ? 'Top of Sprint' : 'Top of Backlog'}
        </MenuItem>
        <MenuItem
          onClick={(e) => (sprintId ? moveTaskToBottomOfSprint(e) : moveTaskToBottomOfBacklog(e))}
          key={`${taskData?.taskId}-moveBottom`}
        >
          Move to {sprintId ? 'Bottom of Sprint' : 'Bottom of Backlog'}
        </MenuItem>
        <MenuItem
          onClick={(e) => (sprintId ? handleRemoveFromSprint(e) : handleAddToSprint(e))}
          key={taskData?.taskId}
        >
          {sprintId ? 'Remove from Sprint' : 'Add to Sprint'}
        </MenuItem>
      </Menu>
    </>
  );
};

export default BacklogTask;
