/* eslint-disable react-hooks/exhaustive-deps */
import { Box, CircularProgress } from '@mui/material';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import { Layout, LayoutWithSidebar } from './Layout/layout';
import InstallationInstructionPage from './components/InstallationInstructionPage';
import AllProjects from './pages/AllProjects/AllProjects';
import ProjectSettings from './pages/AllProjects/ProjectSettings/ProjectSettings';
import UserList from './pages/AllProjects/ProjectSettings/UserList';
import Backlog from './pages/Backlog';
import { TaskDetails } from './pages/Details';
import { Home } from './pages/Home';
import Page404 from './pages/Page404';
import ProjectDetails from './pages/ProjectDetails/ProjectDetails';
import UserDetails from './pages/UserDetails';
import AllUsersList from './pages/UsersList/AllUsersList';
import { getUserData } from './redux/actions/userActions';
import { getToken, resetUser } from './redux/reducers/userReducer';
import './style.scss';

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userReducer } = useSelector((state) => state);

  const getObjectFromUrlQuery = () => {
    const queryParam = Object.fromEntries(new URLSearchParams(window.location.search));
    const filteredParams = {};

    if (queryParam.userId !== 'null') filteredParams.userId = queryParam.userId;
    if (queryParam.userEmail !== 'null') filteredParams.userEmail = queryParam.userEmail;
    if (queryParam.userName !== 'null') filteredParams.userName = queryParam.userName;
    if (queryParam.orgId !== 'null') filteredParams.orgId = queryParam.orgId;
    if (queryParam.orgName !== 'null') filteredParams.orgName = queryParam.orgName;
    if (queryParam.projectId) filteredParams.projectId = queryParam.projectId;

    return filteredParams;
  };

  useEffect(() => {
    (async () => {
      const queryParam = getObjectFromUrlQuery();
      if (
        !userReducer.token ||
        (queryParam.userId &&
          queryParam.userEmail &&
          queryParam.userName &&
          queryParam.orgId &&
          queryParam.orgName)
      ) {
        const result = await dispatch(getToken(queryParam)).unwrap();
        dispatch(getUserData(result?.token));
      }
    })();
  }, []);

  useEffect(() => {
    if (userReducer.isFetchingTokenFinished && !userReducer.token) {
      navigate('/not-found');
      dispatch(resetUser());
    }
  }, [userReducer?.token]);

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {userReducer?.isFetchingToken ? (
        <Box
          sx={{
            display: 'flex',
            height: '100vh',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <CircularProgress size={80} thickness={4} />
        </Box>
      ) : (
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/instruction" element={<InstallationInstructionPage />} />
            <Route path="/users" element={<AllUsersList />} />
            <Route path="/users/:userId" element={<UserDetails />} />
            <Route path="/projects" element={<AllProjects />} />
            <Route path="/projects/:projectId" element={<ProjectDetails />} />
            <Route path="/projects/:projectId/backlog" element={<Backlog />} />
            <Route path="/projects/:projectId/users" element={<UserList />} />
            <Route path="/projects/:projectId/settings" element={<ProjectSettings />} />
          </Route>
          <Route path="/projects/:projectId/tasks/:taskId" element={<LayoutWithSidebar />}>
            <Route index element={<TaskDetails />} />
          </Route>

          <Route path="*" element={<Page404 />} />
        </Routes>
      )}
    </>
  );
}

export default App;
