/* eslint-disable no-unused-expressions */
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Skeleton,
  TextField,
  Typography,
  createTheme,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { boardTypes } from '../../config/config';
import { deleteTask, removeTaskFromBacklog, setTaskId } from '../../pages/ProjectDetails/reducer';
import { useGetProjectUsersQuery } from '../../redux/api/apiSlice';
import { addTaskBacklogToSprint, setShowSkeleton } from '../../redux/reducers/sprintReducer';
import { useAddTaskSprintMutation } from '../../redux/sprint/sprintAPI';
import DropDown from '../DropDown';
import Modal from '../Modal';

const taskStateOptions = [
  {
    value: 'pending',
    label: 'To Do',
    color: 'grey',
  },
  {
    value: 'in progress',
    label: 'In Progress',
    color: '#00337C',
  },
  {
    value: 'in review',
    label: 'In Review',
    color: '#009FBD',
  },
  {
    value: 'done',
    label: 'Done',
    color: '#03C988',
  },
];

const priorityOptions = [
  {
    value: 'high',
    label: 'High',
    icon: 'https://vanquishers.atlassian.net/images/icons/priorities/high.svg',
  },
  {
    value: 'medium',
    label: 'Medium',
    icon: 'https://vanquishers.atlassian.net/images/icons/priorities/medium.svg',
  },
  {
    value: 'low',
    label: 'Low',
    icon: 'https://vanquishers.atlassian.net/images/icons/priorities/low.svg',
  },
];

const theme = createTheme();

const RightSidebar = ({
  project,
  taskData,
  storyPoint,
  getSelectedData,
  createDate,
  updateDate,
  projectSprints,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedData, setSelectdData] = useState({});
  const [storyPointValue, setStoryPointValue] = useState(storyPoint);
  const [assignUsers, setAssignUsers] = useState([]);
  const [assignReporter, setAssignReporter] = useState([]);
  const actions = ['Delete'];
  const [anchorEl, setAnchorEl] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { userReducer, projectReducer } = useSelector((state) => state);
  const [addTaskToSprint, {}] = useAddTaskSprintMutation();
  const dispatch = useDispatch();
  const { data, isLoading, isError, error } = useGetProjectUsersQuery(project.projectId, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  });

  const navigate = useNavigate();
  const sprintOptions = Array.isArray(projectSprints)
    ? projectSprints?.map((sprint) => ({
        value: sprint?.sprintId,
        label: sprint?.sprintName,
      }))
    : [];

  useEffect(() => {
    dispatch(setShowSkeleton(false));
    getSelectedData(selectedData);
  }, [getSelectedData, selectedData]);

  const defaultAssigneeOption = taskData
    ? [
        {
          label: taskData?.assigneeName || 'Unassigned',
          value: taskData?.assigneeId || null,
        },
      ]
    : [];

  const defaultReporterOption = taskData
    ? [
        {
          label: taskData?.reporterName || 'Unassigned',
          value: taskData?.reporterId || null,
        },
      ]
    : [];

  useEffect(() => {
    if (data?.status === 'success') {
      const modifiedAssignUsers = data?.data?.users.map(({ id, userName }) => ({
        value: id,
        label: userName,
        icon: 'https://vanquishers.atlassian.net/rest/api/2/universal_avatar/view/type/project/avatar/10553',
      }));

      const updatedUsers = [{ label: 'Unassigned', value: null }, ...modifiedAssignUsers];

      setAssignReporter(updatedUsers);
      setAssignUsers(updatedUsers);
    }
  }, [data?.data?.users, data?.status, isError, error?.data?.message]);

  const defaultPriortyOption =
    priorityOptions.filter(
      (opt) => opt.value?.toLowerCase() === taskData?.priority?.toLowerCase()
    )[0] || [];

  const defaultSprintOption = sprintOptions?.filter((opt) => opt?.value === taskData?.sprintId);
  const defualtTaskStatusOption = taskStateOptions?.filter(
    (opt) => opt?.value?.toLowerCase() === taskData?.status?.toLowerCase()
  )[0];

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAction = () => {
    dispatch(setTaskId(taskData.taskId));
    setModalOpen(true);
  };
  const handleDelete = () => {
    dispatch(deleteTask({ taskId: taskData.taskId, token: userReducer.token }));
    setModalOpen(false);
    navigate('/');
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ width: '100%' }}>
          <DropDown
            selectedItem={(item) => setSelectdData((prev) => ({ ...prev, status: item.value }))}
            width="40%"
            defaultValue={defualtTaskStatusOption}
            options={taskStateOptions}
          />
        </div>
        {projectReducer.selectedProject?.boardType === 'kanban' && (
          <div>
            <IconButton aria-controls="menu" aria-haspopup="true" onClick={handleMenuOpen}>
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
                      onClick={handleAction}
                    >
                      {' '}
                      {action}
                    </button>
                  </MenuItem>
                ))}
              </Box>
            </Menu>
          </div>
        )}
      </div>
      <Accordion
        defaultExpanded
        sx={{ border: '1px solid lightgray', boxShadow: 'none' }}
        onChange={(e, exp) => setIsExpanded(exp)}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          sx={{
            ...(isExpanded && { borderBottom: '1px solid lightgray' }),
            marginBottom: theme.spacing(2),
            mb: '0',
          }}
        >
          <Typography>Details</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid alignItems="center" container spacing={2} mt="5px">
            <Grid item xs={4}>
              <Typography
                fontSize={13}
                sx={{
                  fontWeight: 'bold',
                  color: 'grey',
                  marginBottom: theme.spacing(3),
                }}
              >
                Assignee
              </Typography>
            </Grid>
            <Grid item xs={8}>
              {isLoading ||
                (assignUsers.length > 0 && (
                  <DropDown
                    defaultValue={defaultAssigneeOption}
                    selectedItem={(item) =>
                      setSelectdData((prev) => ({
                        ...prev,
                        assigneeId: item.value,
                      }))
                    }
                    showOptionAsBadge={false}
                    options={assignUsers}
                  />
                ))}
            </Grid>
          </Grid>
          <Grid alignItems="center" container spacing={2}>
            <Grid item xs={4}>
              <Typography
                fontSize={13}
                sx={{
                  fontWeight: 'bold',
                  color: 'grey',
                  marginBottom: theme.spacing(3),
                }}
              >
                Story Points
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <TextField
                value={storyPointValue}
                onChange={(e) => {
                  const inputValue = parseInt(e.target.value, 10);
                  const newStoryPoint = inputValue < 0 ? storyPointValue : inputValue;
                  setSelectdData((prev) => ({
                    ...prev,
                    storyPoint: e.target.value,
                  }));
                  setStoryPointValue(newStoryPoint);
                }}
                InputProps={{
                  inputProps: { min: 0 },
                }}
                sx={{ width: '100%', marginBottom: '10px' }}
                size="small"
                type="number"
              />
            </Grid>
          </Grid>
          <Grid alignItems="center" container spacing={2}>
            <Grid item xs={4}>
              <Typography
                fontSize={13}
                sx={{
                  fontWeight: 'bold',
                  color: 'grey',
                  marginBottom: theme.spacing(3),
                }}
              >
                Reporter
              </Typography>
            </Grid>
            <Grid item xs={8}>
              {isLoading ||
                (assignUsers.length > 0 && (
                  <DropDown
                    defaultValue={defaultReporterOption}
                    selectedItem={(item) => {
                      setSelectdData((prev) => ({
                        ...prev,
                        reporterId: item.value,
                      }));
                    }}
                    showOptionAsBadge={false}
                    options={assignReporter}
                  />
                ))}
            </Grid>
          </Grid>
          {(() => {
            if (project.isProjectLoading) {
              return (
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Skeleton height={60} width="20%" />
                  <Skeleton height={60} width="60%" />
                </Box>
              );
            }
            if (project.isProjectError) {
              return <Typography>Something went wrong</Typography>;
            }
            if (project.projectData.data.project.boardType === boardTypes.scrum) {
              return (
                <Grid alignItems="center" container spacing={2}>
                  <Grid item xs={4}>
                    <Typography
                      fontSize={13}
                      sx={{
                        fontWeight: 'bold',
                        color: 'grey',
                        marginBottom: theme.spacing(3),
                      }}
                    >
                      Sprint
                    </Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <DropDown
                      defaultValue={defaultSprintOption}
                      selectedItem={(item) => {
                        setSelectdData((prev) => ({
                          ...prev,
                          sprint: item.value,
                        }));
                        addTaskToSprint({ taskId: taskData.taskId, sprintId: item.value });
                        dispatch(addTaskBacklogToSprint(taskData));
                        dispatch(removeTaskFromBacklog({ taskId: taskData.taskId }));
                      }}
                      options={sprintOptions}
                    />
                  </Grid>
                </Grid>
              );
            }
            if (project.projectData.data.project.boardType === boardTypes.kanban) {
              return (
                <Grid alignItems="center" container spacing={2}>
                  <Grid item xs={4}>
                    <Typography
                      fontSize={13}
                      sx={{
                        fontWeight: 'bold',
                        color: 'grey',
                        marginBottom: theme.spacing(3),
                      }}
                    >
                      Due Date
                    </Typography>
                  </Grid>
                  <Grid alignSelf="center" sx={{ mb: '0.7rem' }} item xs={8}>
                    <LocalizationProvider dateAdapter={AdapterDayjs} width="100%">
                      <DatePicker
                        slotProps={{ textField: { fullWidth: true, size: 'small' } }}
                        width="100%"
                        defaultValue={dayjs(taskData.dueDate)}
                        onChange={(item) =>
                          setSelectdData((prev) => ({
                            ...prev,
                            dueDate: item,
                          }))
                        }
                      />
                    </LocalizationProvider>
                  </Grid>
                </Grid>
              );
            }
            return null;
          })()}

          <Grid alignItems="center" container spacing={2}>
            <Grid item xs={4}>
              <Typography
                fontSize={13}
                sx={{
                  fontWeight: 'bold',
                  color: 'grey',
                  marginBottom: theme.spacing(3),
                }}
              >
                Priority
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <DropDown
                defaultValue={defaultPriortyOption}
                selectedItem={(item) =>
                  setSelectdData((prev) => ({
                    ...prev,
                    priority: item.value,
                  }))
                }
                showOptionAsBadge={false}
                showIcon={!!defaultPriortyOption?.value}
                options={priorityOptions}
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
      <Box sx={{ marginTop: theme.spacing(1), marginBottom: theme.spacing(5) }}>
        <Typography fontSize={13} color="gray">
          {createDate || ''}
        </Typography>
        <Typography fontSize={13} color="gray">
          {updateDate || ''}
        </Typography>
      </Box>
      <Modal
        open={modalOpen}
        setOpen={setModalOpen}
        title="Are you sure you want to delete this task?"
        submitText="DELETE"
        handleSubmit={handleDelete}
      />
    </>
  );
};

export default RightSidebar;
