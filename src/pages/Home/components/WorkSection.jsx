import { Skeleton } from '@mui/material';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import BlockList from '../../../components/BlockList';
import { useGetUserTaskQuery, useGetWorkedOnTaskQuery } from '../../../redux/reducers/apiReducer';
import { setTaskId } from '../../ProjectDetails/reducer';

const blockStyle = {
  display: 'flex',
  gap: '10px',
  width: '100%',
  justifyContent: 'flex-start',
  alignItems: 'center',
  margin: '10px 0',
  padding: '10px 5px',
  borderRadius: '5px',
  ':hover': {
    background: '#EEEEEE',
    cursor: 'pointer',
  },
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ padding: '5px 0' }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  // eslint-disable-next-line react/require-default-props
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function WorkSection() {
  const { userReducer, taskByProjectReducers } = useSelector((state) => state);
  const { token, userData } = userReducer;
  const { data, isError, refetch } = useGetUserTaskQuery(token, {
    refetchOnMountOrArgChange: true,
  });

  const { data: workedOnData, isLoading: workedOnLoading } = useGetWorkedOnTaskQuery(token, {
    refetchOnMountOrArgChange: true,
  });

  const userTasks = data?.data?.tasks;
  const workedOnTasksData = workedOnData?.data?.data;

  const [value, setValue] = useState(0);
  const tablist = ['Worked On', 'Assigned to me'];

  const handleChange = (_, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (taskByProjectReducers.isDeletedTask) {
      refetch();
    }
  }, [taskByProjectReducers.isDeletedTask]);
  const assignedTasks = userTasks?.filter((task) => task.assigneeId === userData?.userId);
  return (
    <Box sx={{ width: '100%', padding: '0 10px', height: 'auto' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          {tablist.map((item, index) => (
            <Tab
              label={item}
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              {...a11yProps(index)}
              sx={{
                textTransform: 'none',
              }}
            />
          ))}
        </Tabs>
      </Box>
      <TabPanel
        value={value}
        index={0}
        sx={{
          padding: '0',
        }}
      >
        {workedOnLoading ? (
          <Box>
            <Skeleton variant="rectangular" width={500} height={50} sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" width={500} height={50} sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" width={500} height={50} />
          </Box>
        ) : (
          <TasksView tasks={workedOnTasksData} isError={isError} />
        )}
      </TabPanel>
      <TabPanel value={value} index={1}>
        <TasksView tasks={assignedTasks} isError={isError} />
      </TabPanel>
    </Box>
  );
}

function TasksView({ tasks, isError }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const onTaskClickHandler = (projectId, taskId) => {
    dispatch(setTaskId(taskId));
    navigate(`/projects/${projectId}/tasks/${taskId}`);
  };

  return tasks?.length === 0 || isError ? (
    <Box pt={3}>
      <Typography fontWeight="bold" variant="p" color={isError ? 'red' : 'gray'}>
        {isError ? 'Error at fetching task!' : ' No tasks has been found!'}
      </Typography>
    </Box>
  ) : (
    <BlockList
      items={tasks}
      renderItem={({ taskName, taskNumber, taskId, projectId }) => (
        <Box key={taskId} sx={blockStyle} onClick={() => onTaskClickHandler(projectId, taskId)}>
          <img
            alt=""
            height="20"
            width="20"
            src="https://springrainio.atlassian.net/rest/api/2/universal_avatar/view/type/issuetype/avatar/10318?size=xsmall"
          />
          <Box flexGrow="2">
            <Typography fontSize="14px">{taskName}</Typography>
            <Typography fontSize="11px">{taskNumber}</Typography>
          </Box>
        </Box>
      )}
    />
  );
}
