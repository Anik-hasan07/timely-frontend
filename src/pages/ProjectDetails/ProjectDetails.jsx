/* eslint-disable jsx-a11y/alt-text */
import { Box, CircularProgress, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import LeftSidebar from '../../components/LeftSidebar';
import TaskBoard from './TaskBoard';
import { getTaskByProject } from './reducer';
import './style.css';

import taskImage from '../../assets/images/sptint/project-details-spring-bg.png';
import TopNavbar from '../../components/TopNavbar/TopNavbar';
import { boardTypes, sprintStatus } from '../../config/config';
import { getActiveSprint } from '../../redux/reducers/sprintReducer';
import { getProjectUsers } from '../AllProjects/ProjectSettings/action';

const ProjectDetails = () => {
  const dispatch = useDispatch();
  const { taskByProjectReducers, userReducer, projectReducer, sprintReducer } = useSelector(
    (state) => state
  );

  const { projectId } = useParams();

  const boardType = projectReducer?.selectedProject?.boardType;
  const projectPrefix = projectReducer?.selectedProject?.projectPrefix;

  const [activeSprintName, setActiveSprintName] = useState('');

  const { projectUserReducer } = useSelector((state) => state);

  const { tasks: tasksFromReducer } = taskByProjectReducers;
  const [tasks, setTasks] = useState(tasksFromReducer);

  useEffect(() => {
    const projectdata = {
      projectId,
      token: userReducer.token,
    };
    dispatch(getTaskByProject(projectdata));
    // eslint-disable-next-line no-use-before-define
  }, [dispatch, taskByProjectReducers.projectId, projectId, userReducer.token]);
  const orgId = userReducer.userData?.organizationId;
  useEffect(() => {
    dispatch(getActiveSprint({ orgId, token: userReducer.token, projectId }));
  }, [orgId, projectId, userReducer.token]);

  useEffect(() => {
    if (sprintReducer.activeSprint) {
      setActiveSprintName(`Sprint ${sprintReducer.activeSprint?.sprintNumber}`);
    }
    if (
      projectReducer.selectedProject?.boardType === boardTypes.scrum &&
      sprintReducer?.activeSprint?.sprintStatus !== sprintStatus.running
    ) {
      setTasks([]);
    } else {
      setTasks(tasksFromReducer);
    }
  }, [sprintReducer.activeSprint]);

  useEffect(() => {
    dispatch(
      getProjectUsers({
        token: userReducer.token,
        projectId,
      })
    );
  }, [dispatch, taskByProjectReducers.projectId, projectId, userReducer.token]);

  const users = projectUserReducer?.users?.users;
  return (
    <div style={{ display: 'flex' }}>
      <LeftSidebar boardType={boardType} />

      <div style={{ flexGrow: 1, marginTop: '20px' }}>
        <div style={{ margin: '40px' }}>
          <TopNavbar
            title={activeSprintName || ''}
            users={users}
            boardType={boardType}
            projectPrefix={projectPrefix}
          />
        </div>
        {taskByProjectReducers.isFetchingTask ? (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        ) : (
          <div style={{ margin: '40px' }}>
            <TaskBoard tasks={tasks} boardType={boardType} />
            {((boardType === boardTypes.scrum &&
              sprintReducer?.activeSprint?.status !== sprintStatus.running) ||
              (boardType === boardTypes.kanban && tasks.length === 0)) && (
              <div>
                {sprintReducer?.activeSprint?.sprintStatus !== sprintStatus?.running && (
                  <>
                    <img
                      style={{
                        height: '400px',
                        width: '600px',
                        margin: '0 auto',
                        display: 'flex',
                        objectFit: 'contain',
                      }}
                      src={taskImage}
                    />
                    <Typography
                      variant="h6"
                      style={{
                        color: '#FF4500',
                        textAlign: 'center',
                        fontFamily: 'bold',
                      }}
                    >
                      Start planning your
                      {boardType === boardTypes.scrum && (
                        <Link to={`/projects/${projectId}/backlog`}> Next Sprint</Link>
                      )}
                      {boardType === boardTypes.kanban && ' tasks in the board'}
                    </Typography>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetails;
