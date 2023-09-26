/* eslint-disable no-undef */
/* eslint-disable jsx-a11y/label-has-associated-control */
import InfoIcon from '@mui/icons-material/Info';
import {
  Box,
  Button,
  Grid,
  LinearProgress,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  deleteProject,
  getProjects,
  resetUpdateProject,
  setSelectedProject,
  updateProject,
} from '../../../redux/reducers/projectReducer';

// eslint-disable-next-line import/no-unresolved
import LeftSidebar from '../../../components/LeftSidebar';
import Modal from '../../../components/Modal';
import '../style.scss';

export default function ProjectSettings() {
  const navigate = useNavigate();
  const { projectReducer, userReducer } = useSelector((state) => state);
  const { selectedProject: project } = projectReducer;
  const { projectId } = useParams();
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);

  const boards = [
    {
      value: 'scrum',
      label: 'scrum',
    },
    {
      value: 'kanban',
      label: 'kanban',
    },
  ];
  const projectStatus = [
    {
      value: 'ACTIVE',
      label: 'Active',
    },
    {
      value: 'INACTIVE',
      label: 'Inactive',
    },
  ];

  const [projectName, setProjectName] = useState(project?.projectName || '');
  const [boardType, setBoardType] = useState(project?.boardType || '');
  const [status, setStatus] = useState(project?.status || '');
  const [projectPrefix, setProjectPrefix] = useState(project?.projectPrefix || '');

  useEffect(() => {
    if (!project) {
      dispatch(getProjects({ token: userReducer.token }));
    }
  }, [project]);

  useEffect(() => {
    if (projectReducer.projects.length > 0) {
      const foundProject = projectReducer.projects.find((proj) => proj.projectId === projectId);
      setSelectedProject(foundProject);
      setProjectName(foundProject?.projectName);
      setBoardType(foundProject?.boardType);
      setStatus(foundProject?.status);
      setProjectPrefix(foundProject?.projectPrefix);
    }
  }, [projectReducer.projects]);

  const handleUpdate = () => {
    const data = {
      projectName,
      boardType,
      projectPrefix,
      status,
    };
    dispatch(
      updateProject({
        projectId,
        token: userReducer.token,
        projectData: data,
      })
    );
  };

  const handleClick = () => {
    setModalOpen(true);
  };
  const handleSubmit = () => {
    dispatch(deleteProject({ projectId, token: userReducer.token }));
    setModalOpen(false);
    navigate('/projects');
  };

  useEffect(() => {
    if (projectReducer.isUpdatingSuccess) {
      dispatch(resetUpdateProject());
      navigate('/projects');
    }
  }, [projectReducer.isUpdatingSuccess]);

  return (
    <div>
      {projectReducer.isUpdatingProject ? (
        <Box sx={{ width: '100%' }}>
          <LinearProgress />
        </Box>
      ) : (
        <div style={{ display: 'flex' }}>
          <LeftSidebar />
          <div style={{ flexGrow: 1, marginTop: '40px' }}>
            <Box>
              <Grid
                container
                spacing={6}
                margin="5px 0"
                width="100%"
                sx={{ minHeight: '90vh', background: '#fafbfc' }}
              >
                <Grid item xs={6} md={9}>
                  <div style={{ marginLeft: '35%' }}>
                    <Typography
                      color="primary"
                      style={{ marginTop: '10px', marginBottom: '-15px', padding: '0px' }}
                    >
                      Project Name
                    </Typography>{' '}
                    <br />
                    <TextField
                      className="field"
                      required
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                    />{' '}
                    <br />
                    <Typography
                      color="primary"
                      style={{ marginTop: '10px', marginBottom: '-15px', padding: '0px' }}
                    >
                      Status
                    </Typography>{' '}
                    <br />
                    {userReducer.userData.role === 'Admin' ||
                    userReducer.userData.role === 'SuperAdmin' ? (
                      <Select
                        className="field"
                        required
                        type="text"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                      >
                        {projectStatus.map((ps) => (
                          <MenuItem key={ps.value} value={ps.value}>
                            {ps.label}
                          </MenuItem>
                        ))}
                      </Select>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0px' }}>
                        <Select
                          className="field"
                          disabled
                          required
                          type="text"
                          value={status}
                          onChange={(e) => setStatus(e.target.value)}
                        >
                          {projectStatus.map((ps) => (
                            <MenuItem key={ps.value} value={ps.value}>
                              {ps.label}
                            </MenuItem>
                          ))}
                        </Select>
                        <Tooltip
                          title="You are not able to update this field"
                          style={{ backgroundColor: 'white' }}
                        >
                          <InfoIcon style={{ backgroundColor: 'white', marginLeft: '20px' }} />
                        </Tooltip>
                      </div>
                    )}
                    <Typography
                      color="primary"
                      style={{ marginTop: '10px', marginBottom: '-15px', padding: '0px' }}
                    >
                      Project Prefix
                    </Typography>{' '}
                    <br />
                    <TextField
                      className="field"
                      required
                      value={projectPrefix}
                      disabled
                      style={{ cursor: 'none' }}
                    />
                    <br />
                    <Button
                      style={{ backgroundColor: '#ff5722', color: 'white', marginTop: '15px' }}
                      onClick={handleUpdate}
                    >
                      Update
                    </Button>
                    <Button
                      style={{
                        backgroundColor: '#ff5722',
                        color: 'white',
                        marginTop: '15px',
                        marginLeft: '15px',
                      }}
                      onClick={handleClick}
                    >
                      Delete
                    </Button>
                  </div>
                </Grid>
              </Grid>
            </Box>
          </div>
        </div>
      )}

      <Modal
        open={modalOpen}
        setOpen={setModalOpen}
        submitText="DELETE"
        handleSubmit={handleSubmit}
      >
        <h2
          style={{
            fontSize: 16,
            color: '#333',
          }}
        >
          Are you sure you want to delete this Project?
        </h2>
      </Modal>
    </div>
  );
}
