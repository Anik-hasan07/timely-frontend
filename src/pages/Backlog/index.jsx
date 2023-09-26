import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import {
  Avatar,
  Box,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Select,
  Skeleton,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDrop } from 'react-dnd';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { CreateTask } from '../../components/CreateTask/CreateTask';
import EditableDescription from '../../components/EditableDescription/EditableDescription';
import EditableInput from '../../components/EditableInput/EditableInput';
import LeftSidebar from '../../components/LeftSidebar';
import Modal from '../../components/Modal';
import { issueTypeOptions } from '../../components/Navbar/dropdownOptions';
import RightSidebar from '../../components/RightSidebar';
import TopNavbar from '../../components/TopNavbar/TopNavbar';
import { sprintStatus } from '../../config/config';
import { useCreateTaskMutation, useGetProjectQuery } from '../../redux/api/apiSlice';
import { useGetTaskByIdQuery, useUpdatePostByIdMutation } from '../../redux/backlog/backLogApi';
import { setIsBacklogUpdate } from '../../redux/backlog/backLogSlice';
import {
  addTaskBacklogToSprint,
  getActiveSprint,
  getProjectSprints,
  removeTaskFromSprint,
  setShowSkeleton,
  setSprintTaskInReducer,
} from '../../redux/reducers/sprintReducer';
import { useRemoveTaskSprintMutation } from '../../redux/sprint/sprintAPI';
import { isEmpty } from '../../utils/checkEmptyObject';
import { dateTimeFormat, fromNow } from '../../utils/dateTime';
import { getProjectUsers } from '../AllProjects/ProjectSettings/action';
import {
  addTaskSprintToBacklog,
  deleteTask,
  getTaskByProject,
  removeTaskFromBacklog,
  setTaskId as setReducerTaskId,
} from '../ProjectDetails/reducer';

import BacklogTask from './components/BacklogTask';
import Sprints from './components/Sprints';
import './style.scss';

function Backlog() {
  const { projectId } = useParams();
  const [taskId, setTaskId] = useState(null);
  const [createTask, {}] = useCreateTaskMutation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [updatedTaskData, setUpdatedTaskData] = useState(null);
  const [isTaskDeleted, setIsTaskDeleted] = useState(false);

  const [isExpanded, setIsExpanded] = useState(false);

  const [taskName, setTaskName] = useState('');
  const [issueType, setIssueType] = useState('story');

  const handleCreateIssueExpand = () => {
    setIsExpanded(!isExpanded);
  };
  const handleCloseIconClick = () => {
    setIsExpanded(false);
  };
  const dispatch = useDispatch();

  const { showSkeleton } = useSelector((state) => state.sprintReducer);
  const { tasks } = useSelector((state) => state.taskByProjectReducers);
  const { token } = useSelector((state) => state.userReducer);
  const { isBacklogUpdate } = useSelector((state) => state.backlog);
  const [rightSideBarSelectedData, setRightSideBarSelectedData] = useState({});
  const [isCtrlKeyPressed, setIsCtrlKeyPressed] = React.useState(false);
  const [updatedData, setUpdatedData] = useState({});
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const { data, isLoading, isFetching } = useGetTaskByIdQuery(taskId, {
    skip: !taskId || !!updatedTaskData,
    refetchOnMountOrArgChange: true,
  });
  const { projectUserReducer, userReducer, sprintReducer } = useSelector((state) => state);
  const [isConfirmationModalOpen, setIsConfirmationModelOpen] = React.useState(false);
  const actions = ['Delete', 'Duplicate'];
  const [
    updatePostById,
    // eslint-disable-next-line no-empty-pattern
    {
      // data: updateTaskResponse,
      // isLoading: updateTaskLoading,
      // isError: updateTaskIsError,
      // error: updateTaskError,
    },
  ] = useUpdatePostByIdMutation({ fixedCacheKey: 'sharedUpdateTask' });
  const {
    data: projectData,
    isLoading: isProjectLoading,
    isError: isProjectError,
  } = useGetProjectQuery(projectId, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  });

  const taskData = updatedTaskData || data?.data?.task;

  useEffect(() => {
    dispatch(setIsBacklogUpdate(false));
  }, []);

  useEffect(() => {
    dispatch(setIsBacklogUpdate(false));
  }, [isCtrlKeyPressed]);

  useEffect(() => {
    const options = {
      projectId,
      token: userReducer.token,
    };
    dispatch(getTaskByProject(options));
    // eslint-disable-next-line no-use-before-define
  }, [dispatch, projectId, userReducer.token]);
  useEffect(() => {
    if (sprintReducer.isEndingSprintSuccess) {
      dispatch(getTaskByProject());
    }
  }, [sprintReducer.isEndingSprintSuccess]);
  const setUpdateTaskHandle = (id) => {
    setUpdatedData({});
    setRightSideBarSelectedData({});
    dispatch(setIsBacklogUpdate(true));
    setTaskId(id);
  };
  const rightSideNavClose = () => {
    dispatch(setShowSkeleton(true));
    dispatch(setIsBacklogUpdate(false));
  };
  const handleUpdate = (updateTaskData) => {
    const { status, assigneeId, storyPoint, reporterId, sprint, dueDate, priority } =
      rightSideBarSelectedData || {};
    const updateTask = {
      taskName: taskData?.taskName,
      reporterId: reporterId || taskData?.reporterId,
      assigneeId: assigneeId || taskData?.assigneeId,
      taskDetails: taskData?.taskDetails,
      priority: priority || taskData?.priority,
      storyPoint: storyPoint || taskData?.storyPoint,
      dueDate: taskData?.dueDate,
      type: taskData?.type,
      status: status || taskData?.status,
      ...updateTaskData,
    };

    if (sprint) updateTask.sprintId = sprint;
    if (dueDate) updateTask.dueDate = dueDate;
    setUpdatedTaskData({ ...taskData, ...updateTask });
    setUpdatedData((prev) => ({ ...prev, ...updateTask }));
  };

  useEffect(() => {
    if (isFetching) {
      setUpdatedData({});
    }
    if (isTaskDeleted) {
      dispatch(setIsBacklogUpdate(false));
      setIsTaskDeleted(false);
    }
  }, [isTaskDeleted]);

  useEffect(() => {
    const updateObject = { ...updatedData, ...rightSideBarSelectedData };

    if (!isEmpty(updateObject) && taskData?.taskId) {
      updatePostById({
        taskId: taskData?.taskId,
        updateData: updateObject,
      }).then((resp) => {
        if (resp?.data?.data?.updatedTask?.sprintId) {
          dispatch(setSprintTaskInReducer({ taskId: taskData?.taskId, ...updateObject }));
        }
        dispatch(
          getTaskByProject({
            projectId,
            token: userReducer.token,
          })
        );
      });
    }
  }, [rightSideBarSelectedData, taskData?.taskId, updatePostById, updatedData]);
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // eslint-disable-next-line no-shadow
  const handleAction = (action, taskId) => {
    if (action === 'Delete') {
      dispatch(setReducerTaskId(taskId));
      setModalOpen(true);
    }
    if (action === 'Duplicate') {
      dispatch(setReducerTaskId(taskId));
      setIsCreateTaskModalOpen(true);
    }
  };
  const toggleCreateTaskModal = () => {
    setIsCreateTaskModalOpen(!isCreateTaskModalOpen);
  };
  const handleSubmit = () => {
    dispatch(deleteTask({ taskId, token }));
    setModalOpen(false);
    setIsTaskDeleted(true);
    dispatch(getProjectSprints({ projectId, token }));
  };
  const handleCreateTask = async () => {
    const values = {
      projectId,
      taskName,
      type: issueType,
      reporterId: userReducer?.userData?.userId,
    };
    const response = await createTask(values).unwrap();
    const projectdata = {
      projectId: values.projectId,
      token: userReducer.token,
    };
    if (response?.data?.taskId) {
      dispatch(getTaskByProject(projectdata));
    }
    setTaskName('');
    setIsExpanded(false);
  };

  useEffect(() => {
    dispatch(
      getProjectUsers({
        token: userReducer.token,
        projectId,
      })
    );
  }, [dispatch, projectId, userReducer.token]);

  useEffect(() => {
    dispatch(getProjectSprints({ token: userReducer.token, projectId }));
  }, [dispatch, projectId, userReducer.token]);

  useEffect(() => {
    if (sprintReducer.isEndingSprintSuccess) {
      dispatch(getProjectSprints({ token: userReducer.token, projectId }));
    }
  }, [dispatch, sprintReducer.isEndingSprintSuccess, userReducer.token]);

  const users = projectUserReducer?.users?.users;

  const [removeTaskSprint, { isError }] = useRemoveTaskSprintMutation();

  const [selectedDropItem, setSelectedDropItem] = React.useState();
  const [selectedDropItems, setSelectedDropItems] = React.useState([]);

  // ?? sprint to backlog
  const [taskPassedData, setTaskPassedData] = React.useState(null);
  const [{ isOver }, dropItem] = useDrop(() => ({
    accept: 'backlogToSprint',
    drop: ({ taskPassed }) => {
      setTaskPassedData(taskPassed);
      setIsConfirmationModelOpen(true);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));
  // if response is error then auto move to sprint
  useEffect(() => {
    if (isError) {
      dispatch(removeTaskFromBacklog({ taskId: selectedDropItem?.taskId }));
      dispatch(addTaskBacklogToSprint(selectedDropItem));
    }
  }, [dispatch, isError, selectedDropItem]);

  const handleTaskItemClick = (event, task) => {
    dispatch(setShowSkeleton(true));
    if (event.ctrlKey || event.metaKey) {
      setIsCtrlKeyPressed(true);
      dispatch(setIsBacklogUpdate(false));
      const isItemAlreadySelected = selectedDropItems.some(
        (selectedItem) => selectedItem.taskId === task.taskId
      );

      if (!isItemAlreadySelected) {
        setSelectedDropItems((prevSelectedItems) => [...prevSelectedItems, task]);
      } else {
        setSelectedDropItems((prevSelectedItems) =>
          prevSelectedItems.filter((selectedItem) => selectedItem.taskId !== task.taskId)
        );
      }
    } else {
      setIsCtrlKeyPressed(false);
      setSelectedDropItems([task]);
    }
  };

  const orgId = userReducer.userData?.organizationId;
  useEffect(() => {
    if (sprintReducer?.isEndingSprintSuccess) {
      dispatch(getActiveSprint({ orgId, token: userReducer.token, projectId }));
    }
  }, [orgId, projectId, userReducer.token, sprintReducer?.isEndingSprintSuccess]);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const handleOpenDropdown = () => {
    setIsDropdownOpen(true);
  };

  const handleCloseDropdown = () => {
    setIsDropdownOpen(false);
  };

  const handleChange = (event) => {
    setIssueType(event.target.value);
    handleCloseDropdown();
  };

  const handleConfirmationModalSubmit = () => {
    setIsConfirmationModelOpen(false);
    if (Array.isArray(taskPassedData)) {
      taskPassedData.forEach((item) => {
        setSelectedDropItem(item);
        dispatch(removeTaskFromSprint({ taskId: item?.taskId }));
        dispatch(addTaskSprintToBacklog(item));
        removeTaskSprint(item);
        setSelectedDropItems([]);
      });
      return null;
    }
    return (
      setSelectedDropItem(taskPassedData),
      dispatch(removeTaskFromSprint({ taskId: taskPassedData?.taskId })),
      dispatch(addTaskSprintToBacklog(taskPassedData)),
      removeTaskSprint(taskPassedData)
    );
  };

  return (
    <Box className="backlog" style={{ display: 'flex' }}>
      <LeftSidebar />
      <Box className="backlog-item" style={{ flexGrow: 1, marginTop: '10px' }}>
        <Box>
          <TopNavbar title="Backlog" users={users} isBacklogScreen />
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={!isBacklogUpdate ? 12 : 7}>
            {sprintReducer?.isFetchingActiveSprints ? (
              <Skeleton variant="rectangular" width="100%" height={40} sx={{ mt: '1rem' }} />
            ) : (
              (sprintReducer?.activeSprint?.sprintStatus === sprintStatus.running ||
                sprintReducer?.activeSprint?.sprintStatus === sprintStatus.active) && (
                <Sprints
                  setShowSkeleton={setShowSkeleton}
                  setUpdateTaskHandle={setUpdateTaskHandle}
                  sprintsList={sprintReducer?.sprints}
                  selectedDropItems={selectedDropItems}
                />
              )
            )}

            {/* <Grid item xs={8}> */}

            <Box
              sx={{
                border: isOver ? '1px dashed #ccc' : '1px dashed transparent',
                borderRadius: '5px',
                opacity: isOver ? 0.8 : 1,
                boxShadow:
                  isOver &&
                  'rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px',
              }}
              ref={dropItem}
              my="28px"
              mr="15px"
            >
              <Typography sx={{ fontWeight: 'bold', mb: 1 }}>Backlog</Typography>
              {tasks
                ?.filter((task) => !task.sprintId)
                ?.map((task) => (
                  <Box
                    onClick={(event) => {
                      setUpdateTaskHandle(task.taskId);
                      handleTaskItemClick(event, task);
                    }}
                    key={task.taskId}
                    sx={{
                      border: '1px solid #dfe1e6',
                      padding: '5px',
                      '&:hover': { background: '#EEEEEE' },
                      backgroundColor: selectedDropItems.some(
                        (selectedItem) => selectedItem.taskId === task.taskId
                      )
                        ? '#EFEFEF'
                        : 'transparent',
                    }}
                  >
                    <BacklogTask isSmall taskData={task} selectedDropItems={selectedDropItems} />
                  </Box>
                ))}
              {!isExpanded && (
                <Grid
                  container
                  spacing={1}
                  sx={{
                    marginTop: '2px',
                    cursor: 'pointer',
                  }}
                  onClick={handleCreateIssueExpand}
                >
                  <Grid item>
                    <AddIcon sx={{ fontSize: 'medium', fontWeight: 'bold' }} />
                  </Grid>
                  <Grid item>
                    <Typography fontSize="14px" fontWeight="bold">
                      Create issue
                    </Typography>
                  </Grid>
                </Grid>
              )}
              {isExpanded && (
                <Box
                  display="flex"
                  sx={{
                    border: '2px solid #EEEEEE',
                    mt: '5px',
                    padding: '5px',
                    gap: '1rem',
                  }}
                >
                  <Box sx={{ flexGrow: 1 }}>
                    <Box display="flex" alignItems="center" width="90%">
                      <Select
                        value={issueType}
                        onChange={handleChange}
                        open={isDropdownOpen}
                        onOpen={handleOpenDropdown}
                        onClose={handleCloseDropdown}
                        style={{ width: '100%', marginLeft: '10px' }}
                        variant="outlined"
                        displayEmpty
                      >
                        {issueTypeOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            <Avatar
                              sx={{
                                width: '17px',
                                height: '17px',
                                padding: '2px',
                              }}
                              alt="Icon"
                              src={option.icon}
                            />
                            {isDropdownOpen ? option.label : null}
                          </MenuItem>
                        ))}
                      </Select>
                    </Box>
                  </Box>
                  <Box width="100%">
                    <TextField
                      fullWidth="true"
                      placeholder="What needs to be done?"
                      value={taskName}
                      sx={{
                        fontSize: 'small',
                        outline: 'none',
                        '&:focus': {
                          outline: 'none',
                        },
                      }}
                      onChange={(e) => setTaskName(e.target.value)}
                    />
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Box sx={{ flexGrow: 1 }}>
                        <span>New {issueType} in backlog</span>
                      </Box>
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                          {taskName?.length >= 3 && (
                            <IconButton onClick={handleCreateTask}>
                              <CheckIcon />
                            </IconButton>
                          )}
                          <IconButton onClick={handleCloseIconClick}>
                            <CloseIcon />
                          </IconButton>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              )}
            </Box>
          </Grid>

          {isBacklogUpdate && !isCtrlKeyPressed && (
            <Grid item xs={5}>
              {(isLoading || isFetching) && showSkeleton ? (
                <Box mt={3} p={2}>
                  <Skeleton variant="rectangular" width={30} height={20} />
                  <br />
                  <Skeleton variant="rectangular" width="100%" height={40} />
                  <br />
                  <Skeleton variant="rectangular" width={100} height={25} />
                  <br />
                  <Skeleton variant="rectangular" width="100%" height={250} />
                  <br />
                  <Skeleton variant="rectangular" width="100%" height={40} />
                  <br />
                  <Skeleton variant="rectangular" width="100%" height={40} /> <br />
                  <br /> <Skeleton variant="rectangular" width="100%" height={80} />
                  <Skeleton variant="rectangular" width="100%" height={40} />
                  <br />
                  <Skeleton variant="rectangular" width="100%" height={40} />
                  <br />
                  <Skeleton variant="rectangular" width="100%" height={350} />
                </Box>
              ) : (
                <Box pr={2}>
                  <Box mt={2} mb={2}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <img
                        alt=""
                        height="16"
                        width="16"
                        src="https://springrainio.atlassian.net/rest/api/2/universal_avatar/view/type/issuetype/avatar/10318?size=xsmall"
                      />
                      <Box
                        style={{
                          display: 'flex',
                          width: '100%',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Typography fontSize="14px" ml="8px">
                          {taskData?.taskNumber}
                        </Typography>
                        <Box>
                          <Box>
                            <IconButton
                              aria-controls="menu"
                              aria-haspopup="true"
                              onClick={handleMenuOpen}
                            >
                              <MoreHorizIcon />
                            </IconButton>
                            <Menu
                              id="menu"
                              anchorEl={anchorEl}
                              open={Boolean(anchorEl)}
                              onClose={handleMenuClose}
                              anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                              }}
                              transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                              }}
                            >
                              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                {actions.map((action) => (
                                  <MenuItem style={{ padding: '0px' }} onClick={handleMenuClose}>
                                    <button
                                      type="button"
                                      style={{
                                        width: '100%',
                                        display: 'block',
                                        padding: '6px 16px',
                                      }}
                                      onClick={() => handleAction(action, taskId)}
                                    >
                                      {' '}
                                      {action}
                                    </button>
                                  </MenuItem>
                                ))}
                              </Box>
                            </Menu>
                            <IconButton
                              aria-controls="menu"
                              aria-haspopup="true"
                              onClick={rightSideNavClose}
                            >
                              <CloseIcon />
                            </IconButton>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                    <Box pb={2} mt="5px" sx={{ border: '1px solid hsl(0, 0%, 80%)' }}>
                      <EditableInput
                        typographyStyle={{
                          fontSize: '20px',
                          fontWeight: '600',
                          variant: 'h3',
                          color: '#172b4d',
                        }}
                        text={taskData?.taskName}
                        updatedText={(text) => handleUpdate({ taskName: text })}
                      />
                      <EditableDescription
                        data={taskData?.taskDetails || ''}
                        updatedData={(description) => handleUpdate({ taskDetails: description })}
                      />
                    </Box>
                  </Box>

                  <RightSidebar
                    project={{ projectId, projectData, isProjectLoading, isProjectError }}
                    taskData={taskData}
                    createDate={taskData?.createdOn && dateTimeFormat(taskData?.createdOn)}
                    updateDate={taskData?.updatedOn && fromNow(taskData?.updatedOn)}
                    getSelectedData={(value) => setRightSideBarSelectedData(value)}
                    storyPoint={taskData?.storyPoint}
                    projectSprints={sprintReducer?.sprints}
                    showSkeleton={showSkeleton}
                    setShowSkeleton={setShowSkeleton}
                    isFetching={isFetching}
                  />
                </Box>
              )}
            </Grid>
          )}

          <Modal
            open={modalOpen}
            setOpen={setModalOpen}
            title="Are you sure you want to delete this task?"
            submitText="DELETE"
            handleSubmit={handleSubmit}
          />

          {isCreateTaskModalOpen && (
            <CreateTask
              isOpen={isCreateTaskModalOpen}
              handleClickClose={toggleCreateTaskModal}
              taskData={taskData}
            />
          )}
        </Grid>
      </Box>

      <Modal
        open={isConfirmationModalOpen}
        setOpen={setIsConfirmationModelOpen}
        title="Move task"
        submitText="Confirm"
        handleSubmit={handleConfirmationModalSubmit}
      >
        {(() => {
          let taskNames = '';
          if (Array.isArray(taskPassedData)) {
            const [firstItem, ...rest] = taskPassedData;
            if (taskPassedData.length > 1) {
              taskNames = (
                <span>
                  <strong>{firstItem.taskName}</strong> and <strong>{rest.length}</strong> other
                </span>
              );
            } else {
              taskNames = <strong>{firstItem.taskName}</strong>;
            }
          } else {
            taskNames = <strong>{taskPassedData?.taskName}</strong>;
          }
          return (
            <Typography>
              Are you sure you want to remove task {taskNames} from{' '}
              <strong>Sprint {sprintReducer.activeSprint?.sprintNumber}</strong> sprint?
            </Typography>
          );
        })()}
      </Modal>
    </Box>
  );
}

export default Backlog;
