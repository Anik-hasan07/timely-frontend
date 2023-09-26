import { Stack } from '@mui/material';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet } from 'react-router';
import LeftSideBar from '../components/LeftSidebar';
import Navbar from '../components/Navbar';
import { CreateProject } from '../pages/CreateProject';
import { getTask } from '../pages/ProjectDetails/reducer';
import { toggleIsCreateProjectModalOpen } from '../redux/reducers/projectReducer';

export function Layout() {
  const dispatch = useDispatch();
  const dispatchIsCreateProjectModalOpen = (_, reason) => {
    if (reason === 'backdropClick') return;
    dispatch(toggleIsCreateProjectModalOpen());
  };
  const { projectReducer } = useSelector((state) => state);
  return (
    <div>
      <CreateProject
        isModalOpen={projectReducer?.isCreateProjectModalOpen}
        handleClickClose={dispatchIsCreateProjectModalOpen}
      />
      <Navbar />
      <Outlet />
    </div>
  );
}

export function LayoutWithSidebar() {
  const dispatch = useDispatch();
  const dispatchIsCreateProjectModalOpen = () => dispatch(toggleIsCreateProjectModalOpen());
  const { projectReducer, taskByProjectReducers, userReducer } = useSelector((state) => state);
  useEffect(() => {
    dispatch(getTask({ taskId: taskByProjectReducers.taskId, token: userReducer.token }));
  }, []);

  return (
    <div>
      <CreateProject
        isModalOpen={projectReducer?.isCreateProjectModalOpen}
        handleClickClose={dispatchIsCreateProjectModalOpen}
      />
      <Navbar />
      <LeftSideBar>
        <Stack direction={{ lg: 'row', sm: 'column' }}>
          <Outlet />
        </Stack>
      </LeftSideBar>
    </div>
  );
}
