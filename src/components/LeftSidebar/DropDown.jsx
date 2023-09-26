import { Box, Skeleton, TextField, Typography } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigate, useParams } from 'react-router-dom';
import {
  getProjects,
  setSelectedProject as setSelectedProjectOnReducer,
} from '../../redux/reducers/projectReducer';

export default function BasicSelect() {
  const { projectId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { projectReducer, userReducer } = useSelector((state) => state);
  const { projects } = projectReducer;

  useEffect(() => {
    if (projects.length < 1) {
      dispatch(getProjects(userReducer?.token));
    }
  }, []);

  const [selectedProject, setSelectedProject] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (projects.length > 0) {
      const foundProject = projects.find((item) => item.projectId === projectId);
      if (!foundProject) {
        setError('Project not found');
      }
      setSelectedProject(foundProject);
      dispatch(setSelectedProjectOnReducer(foundProject));
    }
  }, [projects, projectId]);

  useEffect(() => {
    if (projectReducer.isFetchingError) {
      setError('Something went wrong');
    }
  }, [projectReducer.errorMsg]);

  const handleProjectChange = (event) => {
    const chosenProject = event.target.value;
    dispatch(setSelectedProjectOnReducer(chosenProject));
    navigate(`/projects/${chosenProject.projectId}`);
  };

  return (
    <Box className="dropDownBox" sx={{ minWidth: 250 }}>
      <div style={{ backgroundColor: 'white' }}>
        {(() => {
          if (error) {
            return <Typography color="red">{error}</Typography>;
          }
          if (projectReducer.isFetchingProjects) {
            return <Skeleton width={200} height={80} />;
          }
          if (selectedProject) {
            return (
              <TextField
                style={{ width: '85%', backgroundColor: 'white' }}
                id=""
                select
                label="Board"
                defaultValue={selectedProject}
                onChange={handleProjectChange}
              >
                {projects.map((project) => (
                  <MenuItem key={project.projectId} value={project}>
                    {project.projectName}
                  </MenuItem>
                ))}
              </TextField>
            );
          }
          return null;
        })()}
      </div>
    </Box>
  );
}
