/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-unsafe-optional-chaining */
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Pagination,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Modal from '../../components/Modal';
import SearchComponent from '../../components/searchComponent/SearchComponent';
import { roles } from '../../config/config';
import {
  deleteProject,
  getProjects,
  setSelectedProject,
  toggleIsCreateProjectModalOpen,
} from '../../redux/reducers/projectReducer';
import { setProjectId as selectProjecttId } from '../ProjectDetails/reducer';
import './style.scss';

const PROJECTS_PER_PAGE = 3;

// eslint-disable-next-line consistent-return
const PaginationView = ({ paginationCount, page, onPaginationChange }) => {
  if (paginationCount > 1) {
    return (
      <Stack mt={3} flex justifyContent="center" alignItems="center" width="100%">
        <Pagination page={page} onChange={onPaginationChange} count={paginationCount} />
      </Stack>
    );
  }
};

function AllProjects() {
  const [searchInput, setSearchInput] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const [paginationCount, setPaginationCount] = useState(0);
  const [selectedPaginationValue, setSelectedPaginationValue] = useState(0);

  const actions = ['Project Settings', 'Delete'];
  const [modalOpen, setModalOpen] = useState(false);
  const [projectId, setProjectId] = useState('');
  const dispatch = useDispatch();
  const { projectReducer, userReducer } = useSelector((state) => state);
  const dispatchIsCreateProjectModalOpen = () => dispatch(toggleIsCreateProjectModalOpen());
  useEffect(() => {
    dispatch(getProjects(userReducer.token));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userReducer.token]);
  const { projects, selectedProject } = projectReducer;
  const userRole = userReducer?.userData?.role;

  const handleMenuOpen = (event, project) => {
    dispatch(setSelectedProject(project));
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAction = (action) => {
    if (action === 'Delete') {
      if (userRole === roles.admin || userRole === roles.superAdmin) {
        setProjectId(selectedProject.projectId);
        setModalOpen(true);
      } else {
        return;
      }
    }
    if (action === 'Project Settings') {
      navigate(`/projects/${selectedProject.projectId}/settings`);
    }
  };
  const handleSubmit = () => {
    dispatch(deleteProject({ projectId, token: userReducer.token }));
    setModalOpen(false);
  };
  const handleProjectCreate = () => {
    dispatchIsCreateProjectModalOpen();
  };

  const handleProjectNameClickable = (project) => {
    dispatch(selectProjecttId(project.projectId));
    dispatch(setSelectedProject(project));
    navigate(`/projects/${project.projectId}`);
  };

  const onSearchInputChange = (event) => {
    setSearchInput(event.currentTarget.value);
  };

  const isSearchedProject = (project, input) => {
    return project.projectName.toLowerCase().includes(input.toLowerCase());
  };

  const paginationOffset = selectedPaginationValue * PROJECTS_PER_PAGE;

  const getPaginatedProjectLists = (projectLists, offset) =>
    projectLists?.slice(offset, offset + PROJECTS_PER_PAGE);

  const projectLists = useMemo(() => {
    const filteredProjects = projects?.filter((project) =>
      searchInput ? isSearchedProject(project, searchInput) : true
    );

    const filteredProjectsCount = filteredProjects?.length || 0;
    setPaginationCount(Math.ceil(filteredProjectsCount / PROJECTS_PER_PAGE));

    const paginatedProjects = getPaginatedProjectLists(filteredProjects, paginationOffset);
    return paginatedProjects;
  }, [searchInput, projects, paginationOffset]);

  const onPaginationChange = (_, value) => setSelectedPaginationValue(value - 1);

  useEffect(() => {
    setSelectedPaginationValue(0);
  }, [searchInput]);

  return (
    <div className="projects">
      <div className="head-section">
        <h3>Projects</h3>
        {userReducer?.userData?.role !== 'User' ? (
          <Button
            variant="contained"
            sx={{ textTransform: 'none' }}
            onClick={handleProjectCreate}
            type="button"
          >
            Create Project
          </Button>
        ) : (
          ''
        )}
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <div style={{ width: '20%' }}>
          <SearchComponent onChange={onSearchInputChange} placeHolder="Search project" />
        </div>
      </div>

      {projectLists.length === 0 ? (
        <div>
          <p style={{ padding: '1rem 0 1rem 1rem', textAlign: 'center' }}>
            No projects available,{' '}
            <span className="create-link" onClick={handleProjectCreate}>
              Create Now!
            </span>
          </p>
        </div>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow style={{ margin: '0px' }}>
                  <TableCell className="cell-text">
                    <b>Project Name</b>
                  </TableCell>
                  <TableCell className="cell-text">
                    {' '}
                    <b>Key</b>
                  </TableCell>
                  <TableCell className="cell-text">
                    {' '}
                    <b>Type</b>
                  </TableCell>
                  <TableCell className="cell-text">
                    {' '}
                    <b>Status</b>
                  </TableCell>
                  <TableCell className="cell-text">
                    {' '}
                    <b>Action</b>
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody style={{ border: '0px' }}>
                {projectLists.map((project) => (
                  <TableRow key={project.id} style={{ border: '0px', margin: '0px' }}>
                    {project?.userStatus === 'ACTIVE' ? (
                      <>
                        {' '}
                        <TableCell
                          onClick={() => handleProjectNameClickable(project)}
                          className="cell cell-text single_project_name"
                        >
                          {project?.projectName}
                        </TableCell>
                        <TableCell className="cell cell-text" sx={{ textTransform: 'uppercase' }}>
                          {project?.projectPrefix}
                        </TableCell>
                        <TableCell className="cell cell-text">
                          {project?.boardType.charAt(0).toUpperCase() + project?.boardType.slice(1)}
                        </TableCell>
                        <TableCell className="cell cell-text">{project?.status}</TableCell>
                        <TableCell className="cell cell-text">
                          <div>
                            <IconButton
                              aria-controls="menu"
                              aria-haspopup="true"
                              onClick={(event) => handleMenuOpen(event, project)}
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
                                {actions.map((action) => {
                                  return (
                                    // eslint-disable-next-line react/jsx-no-useless-fragment
                                    <>
                                      {action === 'Delete' && userRole === roles.user ? null : (
                                        <MenuItem
                                          style={{ padding: '0px' }}
                                          onClick={handleMenuClose}
                                        >
                                          <button
                                            type="button"
                                            style={{
                                              width: '100%',
                                              display: 'block',
                                              padding: '6px 16px',
                                            }}
                                            onClick={() => handleAction(action)}
                                          >
                                            {' '}
                                            {action}
                                          </button>
                                        </MenuItem>
                                      )}
                                    </>
                                  );
                                })}
                              </Box>
                            </Menu>
                          </div>
                        </TableCell>
                      </>
                    ) : (
                      ''
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <PaginationView
            page={selectedPaginationValue + 1}
            paginationCount={paginationCount}
            onPaginationChange={onPaginationChange}
          />
        </>
      )}

      <Modal
        open={modalOpen}
        setOpen={setModalOpen}
        title="Are you sure you want to delete this Project?"
        submitText="DELETE"
        handleSubmit={handleSubmit}
      />
    </div>
  );
}

export default AllProjects;
