/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable no-nested-ternary */
import { Box, Grid, Skeleton, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import './flat.scss';

import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/timely-logo.png';
import { setProjectId } from '../../pages/ProjectDetails/reducer';
import { getProjects, setSelectedProject } from '../../redux/reducers/projectReducer';

const Flat = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { projectReducer, userReducer } = useSelector((state) => state);
  useEffect(() => {
    if (userReducer.token) {
      dispatch(getProjects(userReducer.token));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userReducer.token]);

  const handleProjectClick = (project) => {
    dispatch(setProjectId(project.projectId));
    dispatch(setSelectedProject(project));
    navigate(`/projects/${project.projectId}`);
  };
  useEffect(() => {
    if (projectReducer?.projects?.length === 1) {
      dispatch(setSelectedProject(projectReducer?.projects[0]));
    }
  }, [dispatch, projectReducer?.projects]);

  return (
    <div className="flatWrapper">
      <div className="projectComponent">
        <h2 className="projectText">Recent projects</h2>
        <Link className="viewAllProject" to="/projects" target="_self">
          View all projects
        </Link>
      </div>
      <div className="gridWrapper">
        <Grid container spacing={2}>
          {projectReducer.isFetchingProjects ? (
            <Box sx={{ display: 'flex' }}>
              <Skeleton variant="rectangular" width={230} height={200} sx={{ mr: 5 }} />
              <Skeleton variant="rectangular" width={230} height={200} sx={{ mr: 5 }} />
              <Skeleton variant="rectangular" width={230} height={200} />
            </Box>
          ) : projectReducer.projects.length > 0 ? (
            projectReducer.projects.slice(0, 4).map((item) => (
              <div>
                {item?.userStatus === 'ACTIVE' ? (
                  <div
                    onClick={() => handleProjectClick(item)}
                    className="container"
                    key={item.projectId}
                    style={{ cursor: 'pointer', whiteSpace: 'normal', wordWrap: 'break-word' }}
                  >
                    <div className="top">
                      <span className="imageWrappper">
                        <img className="image" src={logo} width="24px" height="24px" />
                      </span>
                      <div className="titleTag">
                        <p className="title">{item.projectName}</p>
                        <p className="tag">{item.boardType}</p>
                      </div>
                    </div>
                    <div className="middle">
                      <div className="quickLink">
                        <p className="quickLinkText">Quick links</p>
                      </div>
                      <div className="quickLink">
                        <span className="quickLinkUrl">
                          <div className="issue">
                            <p className="issueText">My open issues</p>
                          </div>
                          <div className="issueCounter">{item.totalUnresolvedIssues}</div>
                        </span>
                      </div>
                      <div className="quickLink">
                        <span className="quickLinkUrl">
                          <div className="issue">
                            <p className="issueText">Done issues</p>
                          </div>
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  ''
                )}
              </div>
            ))
          ) : (
            <Typography variant="h6">You have no projects</Typography>
          )}
        </Grid>
      </div>
    </div>
  );
};

export default Flat;
