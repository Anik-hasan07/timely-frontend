import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import { Box } from '@mui/material';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import dayjs from 'dayjs';
import * as React from 'react';
import { useEffect } from 'react';
import { useDrop } from 'react-dnd';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Modal from '../../../../components/Modal';
import { setIsBacklogUpdate } from '../../../../redux/backlog/backLogSlice';
import {
  addTaskBacklogToSprint,
  getSprintTasks,
  removeTaskFromSprint,
  setShowSkeleton,
  sprintTask,
} from '../../../../redux/reducers/sprintReducer';
import {
  useAddTaskSprintMutation,
  useGetSprintTasksQuery,
} from '../../../../redux/sprint/sprintAPI';
import {
  addTaskSprintToBacklog,
  getTaskByProject,
  removeTaskFromBacklog,
} from '../../../ProjectDetails/reducer';
import BacklogTask from '../BacklogTask';

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(() => ({
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&:before': {
    display: 'none',
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
    {...props}
  />
))(({ theme }) => ({
  paddingLeft: 0,
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

export default function Sprint({
  panel,
  sprint,
  expanded,
  handleChange,
  setUpdateTaskHandle,
  isBacklogUpdate,
}) {
  const { projectId } = useParams();
  const dispatch = useDispatch();
  const { sprintReducer, userReducer } = useSelector((state) => state);
  const taskMutationStatus = useSelector((state) => state.api.mutations?.sharedUpdateTask?.status);
  const [isCtrlKeyPressed, setIsCtrlKeyPressed] = React.useState(false);
  const [selectedDropItems, setSelectedDropItems] = React.useState([]);
  const [isConfirmationModalOpen, setIsConfirmationModelOpen] = React.useState(false);

  const { data: sprintTasks } = useGetSprintTasksQuery(sprint.sprintId);
  useEffect(() => {
    dispatch(getSprintTasks({ sprintId: sprint.sprintId, token: userReducer.token }));
    dispatch(getTaskByProject({ projectId, token: userReducer.token }));

    if (sprintTasks?.status === 'success') {
      dispatch(sprintTask(sprintTasks?.data?.tasks));
    }
  }, [dispatch, sprintTasks?.data?.tasks, sprintTasks?.status]);

  const [addTaskToSprint, { isError }] = useAddTaskSprintMutation();
  const [selectedDropItem, setSelectedDropItem] = React.useState();

  const handleTaskItemClick = (event, task) => {
    dispatch(setShowSkeleton(true));
    if (event.ctrlKey || event.metaKey) {
      setIsCtrlKeyPressed(true);
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
      dispatch(setIsBacklogUpdate(false));
    } else {
      setSelectedDropItems([task]);
      dispatch(setIsBacklogUpdate(true));
    }
  };

  useEffect(() => {
    if (isCtrlKeyPressed) {
      dispatch(setIsBacklogUpdate(false));
    }
  }, [isCtrlKeyPressed, isBacklogUpdate]);

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

  useEffect(() => {
    if (isError) {
      dispatch(removeTaskFromSprint({ taskId: selectedDropItem?.taskId }));
      dispatch(addTaskSprintToBacklog(selectedDropItem));
    }
  }, [dispatch, isError, selectedDropItem]);

  const handleConfirmationModalSubmit = () => {
    setIsConfirmationModelOpen(false);
    if (Array.isArray(taskPassedData)) {
      taskPassedData.forEach((item) => {
        setSelectedDropItem(item);
        dispatch(removeTaskFromBacklog({ taskId: item.taskId }));
        dispatch(addTaskBacklogToSprint(item));
        addTaskToSprint({ ...item, sprintId: sprint.sprintId });
        setSelectedDropItems([]);
      });
      return null;
    }
    return (
      setSelectedDropItem(taskPassedData),
      dispatch(removeTaskFromBacklog({ taskId: taskPassedData?.taskId })),
      dispatch(addTaskBacklogToSprint(taskPassedData)),
      addTaskToSprint({ ...taskPassedData, sprintId: sprint.sprintId })
    );
  };

  return (
    <Box
      ref={dropItem}
      sx={{
        border: isOver ? '1px dashed #ccc' : '1px dashed transparent',
        borderRadius: '5px',
        marginRight: '15px',
        opacity: isOver ? 0.6 : 1,
        boxShadow:
          isOver && 'rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px',
      }}
    >
      <Accordion expanded={expanded === panel} onChange={handleChange(panel, sprint.sprintId)}>
        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
          <Typography>{sprint.sprintName}</Typography>
        </AccordionSummary>
        {sprint?.status === 'RUNNING' && (
          <Box mb={2}>
            <Typography color="#7a869a" variant="caption">
              {dayjs(sprint?.startDate).format('DD/MMMM/YYYY HH:MM:A')} •{' '}
              {dayjs(sprint?.endDate).format('DD/MMMM/YYYY HH:MM:A')}
            </Typography>
          </Box>
        )}

        <AccordionDetails sx={{ padding: 0 }}>
          {sprintReducer.tasks &&
            sprintReducer.tasks.map((task) => (
              <Box
                onClick={(event) => {
                  setUpdateTaskHandle(task.taskId);
                  handleTaskItemClick(event, task);
                }}
                key={task.taskId}
                sx={{
                  border: '1px solid #dfe1e6',
                  padding: '5px',
                  backgroundColor: selectedDropItems.some(
                    (selectedItem) => selectedItem.taskId === task.taskId
                  )
                    ? '#EEEEEE'
                    : 'transparent',
                  '&:hover': { background: '#EEEEEE' },
                }}
              >
                <BacklogTask isSmall taskData={task} selectedDropItems={selectedDropItems} />
              </Box>
            ))}
        </AccordionDetails>
      </Accordion>

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
              Are you sure you want to add task {taskNames} to <strong>{sprint.sprintName}</strong>{' '}
              sprint?
            </Typography>
          );
        })()}
      </Modal>
    </Box>
  );
}
