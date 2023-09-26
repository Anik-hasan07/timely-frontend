import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { yupResolver } from '@hookform/resolvers/yup';
import ClearIcon from '@mui/icons-material/Clear';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  Slide,
  TextField,
  Typography,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import React, { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';

import { boardTypes } from '../../config/config';
import {
  useCreateTaskMutation,
  useGetProjectsQuery,
  useLazyGetProjectSprintsQuery,
  useLazyGetProjectUsersQuery,
} from '../../redux/api/apiSlice';
import DropDown from '../DropDown';
import { issueTypeOptions, priorityOptions } from '../Navbar/dropdownOptions';

import { getTaskByProject } from '../../pages/ProjectDetails/reducer';
import { setSelectedProject } from '../../redux/reducers/projectReducer';

const Transition = React.forwardRef((props, ref) => {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const createProjectValidationSchema = yup.object({
  projectId: yup.string().trim().required('Project must be selected'),
  taskName: yup.string().trim().required('Task Name is required'),
  storyPoint: yup.number().min(0, 'Story Points cannot be negative').optional(),
});

export function CreateTask({ handleClickClose, isOpen, taskData }) {
  const refs = {
    assigneeId: useRef(),
    dueDate: useRef(),
    priority: useRef(),
    projectId: useRef(),
    reporterId: useRef(),
    sprintId: useRef(),
    storyPoint: useRef(),
    taskDetails: useRef(),
    taskName: useRef(),
    type: useRef(),
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userReducer } = useSelector((state) => state);
  const { selectedProject } = useSelector((state) => state.projectReducer);
  const [createTask, { isLoading, error, isError }] = useCreateTaskMutation();
  const { data: projects } = useGetProjectsQuery();
  const [getProjectUsers] = useLazyGetProjectUsersQuery();
  const [getProjectSprints, projectSprintResult] = useLazyGetProjectSprintsQuery();
  const { projectUserReducer } = useSelector((state) => state);
  const projectUsers = projectUserReducer?.users?.users;
  const [defaultProjectId, setDefaultPorjectId] = useState(
    (selectedProject && selectedProject?.projectId) || ''
  );

  const {
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(createProjectValidationSchema),
  });
  const resetValues = () => {
    reset({
      assigneeId: undefined,
      dueDate: undefined,
      priority: undefined,
      reporterId: undefined,
      sprintId: undefined,
      storyPoint: undefined,
      taskDetails: undefined,
      taskName: undefined,
      type: undefined,
    });
    reset({});
    refs.taskName.current.value = '';
    if (selectedProject && selectedProject.boardType === 'kanban') {
      refs.dueDate.current.value = '';
      refs.dueDate.current.inputValue = '';
    }
    refs.storyPoint.current.value = '';
    refs.taskDetails.current.setData('');
  };

  const currentUserId = userReducer?.userData?.userId;

  const projectUserOptions =
    projectUsers?.map(({ userName, id }) => ({
      label: userName,
      value: id,
    })) || [];

  const defaultAssignee = () => {
    if (taskData?.assigneeId) {
      return {
        label: taskData?.assigneeName ? taskData?.assigneeName : 'Unassigned',
        value: taskData?.assigneeId,
      };
    }
    return { label: 'Unassigned', value: null };
  };

  const defaultReporter = () => {
    if (taskData?.reporterId) {
      return {
        label: taskData?.reporterName ? taskData?.reporterName : 'Unassigned',
        value: taskData?.reporterId ? taskData?.reporterId : null,
      };
    }
    return projectUserOptions.find((user) => user.value === currentUserId);
  };

  const defaultPriorityOption = () => {
    if (taskData?.priority) {
      return priorityOptions.find((pOpt) => pOpt.value === taskData.priority);
    }
    return priorityOptions[1];
  };

  const onCloseHandler = (_, reason) => {
    if (reason === 'backdropClick') {
      return;
    }
    resetValues();
    handleClickClose();
    setValue('projectId', defaultProjectId);
  };
  const { projectReducer } = useSelector((state) => state);

  const boardType = projectReducer?.selectedProject?.boardType;

  const onSubmit = async (values) => {
    if (values.storyPoint) {
      values.storyPoint = parseInt(values.storyPoint, 10);
    }
    if (!values.type) {
      values.type = 'story';
    }
    if (values.priority) {
      values.priority = values.priority.value;
    }
    if (values.reporterId) {
      values.reporterId = values.reporterId.value;
    }
    if (values.assigneeId) {
      values.assigneeId = values.assigneeId.value;
    }
    const response = await createTask(values).unwrap();
    const projectdata = {
      projectId: values.projectId,
      token: userReducer.token,
    };
    dispatch(getTaskByProject(projectdata));

    if (response?.data?.taskId) {
      if (boardType === boardTypes.kanban) {
        onCloseHandler('', '');
        navigate(`/projects/${values.projectId}`);
      } else {
        onCloseHandler('', '');
        navigate(`/projects/${values.projectId}/backlog`);
      }
      setValue('projectId', defaultProjectId);
    }
    setValue('taskName', '');
    setValue('taskDetails', '');
    setValue('storyPoint', '');
    setValue('assigneeId', defaultAssignee());
    setValue('reporterId', defaultReporter());
    setValue('priority', defaultPriorityOption());
    handleSubmit();
  };

  const projectOptions =
    projects?.data?.projects?.map(({ projectName, projectId }) => ({
      label: projectName,
      value: projectId,
    })) || [];

  const projectSprintOptions =
    projectSprintResult?.data?.data?.sprints
      ?.filter((sprint) => sprint.status?.toLowerCase() === 'active')
      .map(({ sprintName, sprintId }) => ({
        label: sprintName,
        value: sprintId,
      })) || [];
  projectUserOptions.unshift({ label: 'Unassigned' });

  const collectErrormsgs = (msgs) =>
    typeof msgs === 'object' ? Object.values(msgs).map((msg) => msg[0]) : null;

  const errorMsgs = isError
    ? collectErrormsgs(error?.data?.error?.data?.['invalid-params']) || [error?.data?.message]
    : [];

  const defaultIssueType = issueTypeOptions.find((type) => type.value === taskData?.type);

  useEffect(() => {
    setValue('projectId', defaultProjectId);
  }, [defaultProjectId, setValue]);

  useEffect(() => {
    if (selectedProject) {
      setDefaultPorjectId(selectedProject?.projectId);
    }
  }, [selectedProject]);

  useEffect(() => {
    const project = projects?.data?.projects?.filter(
      ({ projectId }) => projectId === defaultProjectId
    );
    dispatch(setSelectedProject(project?.[0]));
  }, [defaultProjectId, projects?.data?.projects]);

  useEffect(() => {
    if (taskData?.taskName) {
      setValue('taskName', `Clone - ${taskData?.taskName}`);
    }
    if (taskData?.storyPoint) {
      setValue('storyPoint', taskData?.storyPoint);
    }
    if (taskData?.taskDetails) {
      setValue('taskDetails', taskData?.taskDetails);
    }
    setValue('priority', defaultPriorityOption());
  }, [taskData]);

  useEffect(() => {
    setValue('assigneeId', defaultAssignee());
    setValue('reporterId', defaultReporter());
  }, [taskData, projectUsers]);

  return (
    <Dialog
      open={isOpen}
      className="issueCreateDialog"
      maxWidth="sm"
      TransitionComponent={Transition}
      keepMounted
      onClose={onCloseHandler}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="dialogHeader">
          <div>Create Issue</div>
          <ClearIcon onClick={onCloseHandler} style={{ cursor: 'pointer' }} />
        </div>
        <DialogContent>
          <Grid container spacing={2}>
            {projectOptions && selectedProject && (
              <Grid item xs={11} md={11} mb={1}>
                <span className="modalTitle">
                  Projects<sup>*</sup>
                </span>
                {selectedProject ? (
                  <Controller
                    name="projectId"
                    control={control}
                    render={() => (
                      <DropDown
                        selectRef={refs.projectId}
                        defaultValue={{
                          label: selectedProject?.projectName,
                          value: selectedProject?.projectId,
                        }}
                        showOptionAsBadge={false}
                        selectedItem={(value) => {
                          setDefaultPorjectId(value.value);
                          getProjectUsers(value.value);
                          getProjectSprints(value.value);
                        }}
                        options={projectOptions}
                      />
                    )}
                  />
                ) : (
                  <Controller
                    name="projectId"
                    control={control}
                    render={() => (
                      <DropDown
                        selectRef={refs.projectId}
                        defaultValue={[]}
                        showOptionAsBadge={false}
                        selectedItem={(value) => {
                          setDefaultPorjectId(value.value);
                          getProjectUsers(value.value);
                          getProjectSprints(value.value);
                        }}
                        options={projectOptions}
                      />
                    )}
                  />
                )}

                {errors.projectId && (
                  <Typography variant="p" fontSize={12} color="red">
                    {errors.projectId.message}
                  </Typography>
                )}
              </Grid>
            )}

            {!selectedProject && (
              <Grid item xs={11} md={11} mb={1}>
                <span className="modalTitle">
                  Projects<sup>*</sup>
                </span>

                <Controller
                  name="projectId"
                  control={control}
                  render={() => (
                    <DropDown
                      selectRef={refs.projectId}
                      defaultValue={[]}
                      showOptionAsBadge={false}
                      selectedItem={(value) => {
                        setDefaultPorjectId(value.value);
                        getProjectUsers(value.value);
                        getProjectSprints(value.value);
                      }}
                      options={projectOptions}
                    />
                  )}
                />
                {errors.projectId && (
                  <Typography variant="p" fontSize={12} color="red">
                    {errors.projectId.message}
                  </Typography>
                )}
              </Grid>
            )}
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={11} md={11} mb={1}>
              <span className="modalTitle">Issue type</span>
              <Controller
                name="type"
                control={control}
                render={() => (
                  <DropDown
                    selectRef={refs.type}
                    defaultValue={
                      defaultIssueType || {
                        value: 'story',
                        label: 'Story',
                        icon: 'https://vanquishers.atlassian.net/rest/api/2/universal_avatar/view/type/issuetype/avatar/10315',
                      }
                    }
                    showOptionAsBadge={false}
                    showIcon
                    selectedItem={({ value }) => {
                      setValue('type', value);
                    }}
                    options={issueTypeOptions}
                  />
                )}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={11} md={11} mb={1}>
              <span className="modalTitle">
                Task Name<sup>*</sup>{' '}
              </span>
              <Controller
                name="taskName"
                control={control}
                defaultValue={taskData?.taskName}
                render={({ field: { onChange, value } }) => (
                  <TextField
                    inputRef={refs.taskName}
                    value={value}
                    onChange={onChange}
                    sx={{ width: '100%', marginBottom: '10px' }}
                    size="small"
                    type="text"
                  />
                )}
              />
              {errors.taskName && (
                <Typography variant="p" fontSize={12} color="red">
                  {errors.taskName.message}
                </Typography>
              )}
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={11} md={11} mb={1}>
              <span className="modalTitle">
                Task Details<sup>*</sup>{' '}
              </span>
              <Controller
                name="taskDetails"
                control={control}
                render={() => (
                  <Box>
                    <CKEditor
                      editor={ClassicEditor}
                      data={taskData?.taskDetails || ''}
                      onReady={(editor) => {
                        refs.taskDetails.current = editor;
                      }}
                      onChange={(_, editor) => {
                        setValue('taskDetails', editor.getData());
                      }}
                    />
                  </Box>
                )}
              />
              {errors.taskDetails && (
                <Typography variant="p" fontSize={12} color="red">
                  {errors.taskDetails.message}
                </Typography>
              )}
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={11} md={11} mb={1}>
              <span className="modalTitle">Story point</span>
              <Controller
                name="storyPoint"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <TextField
                    inputRef={refs.storyPoint}
                    type="number"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={value}
                    onChange={onChange}
                    sx={{ width: '100%', marginBottom: '10px' }}
                    size="small"
                  />
                )}
              />
              {errors.storyPoint && (
                <Typography variant="p" fontSize={12} color="red">
                  {errors.storyPoint.message}
                </Typography>
              )}
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={11} md={11} mb={1}>
              <span className="modalTitle">Assignee</span>

              <Controller
                name="assigneeId"
                control={control}
                render={({ field: { value: val } }) => (
                  <DropDown
                    selectRef={refs.assigneeId}
                    defaultValue={val}
                    showOptionAsBadge={false}
                    selectedItem={(item) => setValue('assigneeId', item)}
                    options={projectUserOptions}
                  />
                )}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={11} md={11} mb={1}>
              <span className="modalTitle">Reporter</span>
              <Controller
                name="reporterId"
                control={control}
                render={({ field: { value: val } }) => (
                  <DropDown
                    selectRef={refs.reporterId}
                    defaultValue={val}
                    showOptionAsBadge={false}
                    selectedItem={(item) => setValue('reporterId', item)}
                    options={projectUserOptions}
                  />
                )}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={11} md={11} mb={1}>
              <span className="modalTitle">Priority</span>
              <Controller
                name="priority"
                control={control}
                render={({ field: { value: val } }) => (
                  <DropDown
                    selectRef={refs.priority}
                    defaultValue={val}
                    menuPlacement="top"
                    showOptionAsBadge={false}
                    selectedItem={(item) => setValue('priority', item)}
                    options={priorityOptions}
                  />
                )}
              />
            </Grid>
          </Grid>
          {/* {selectedProject?.boardType !== 'kanban' && (
            <Grid container spacing={2}>
              <Grid item xs={11} md={11} mb={1}>
                <span className="modalTitle">Sprint</span>
                <Controller
                  name="sprint"
                  control={control}
                  render={() => (
                    <DropDown
                      selectRef={refs.sprintId}
                      defaultValue={[]}
                      showOptionAsBadge={false}
                      selectedItem={({ value }) => setValue('sprintId', value)}
                      options={projectSprintOptions}
                    />
                  )}
                />
              </Grid>
            </Grid>
          )} */}
          {selectedProject?.boardType === 'kanban' && (
            <Grid container spacing={2}>
              <Grid item xs={11} md={11} mb={1}>
                <span className="modalTitle">Due Date</span>
                <Controller
                  name="dueDate"
                  control={control}
                  render={({ field: { onChange } }) => (
                    <Box width="100%">
                      <LocalizationProvider dateAdapter={AdapterDayjs} width="100%">
                        <DatePicker
                          slotProps={{ textField: { fullWidth: true, size: 'small' } }}
                          width="100%"
                          inputRef={refs.dueDate}
                          onChange={onChange}
                        />
                      </LocalizationProvider>
                    </Box>
                  )}
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        {errorMsgs.length > 0 && errorMsgs.map((msg) => <Alert severity="error">{msg}</Alert>)}

        <div>
          <DialogActions>
            <Button onClick={onCloseHandler}>Cancel</Button>
            <Button
              disabled={isLoading}
              type="submit"
              variant="contained"
              sx={{
                height: '100%',
                alignSelf: 'center',
                ml: 2,
                textTransform: 'none',
                display: { xs: 'none', md: 'block' },
              }}
            >
              {isLoading ? 'Creating...' : 'Create'}
            </Button>
          </DialogActions>
        </div>
      </form>
    </Dialog>
  );
}
