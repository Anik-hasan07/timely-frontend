import { Avatar, Box, Container, Paper, Skeleton, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { getUserById } from '../../redux/reducers/userReducer';
import { stringAvatar } from '../../utils';
import './style.scss';

const UserDetails = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const { userReducer } = useSelector((state) => state);

  const { userDetails } = userReducer;
  const userNameCapitalFormation = userDetails?.userName?.toUpperCase();

  useEffect(() => {
    dispatch(getUserById({ userId, token: userReducer.token }));
  }, [userId, userReducer.token]);

  return (
    <Container>
      <Box className="userDetails">
        <Paper sx={{ border: '1px solid lightgray' }} className="userDetailsWrapper">
          {userReducer.isFetchingUserDetails ? (
            <>
              <Skeleton
                variant="circular"
                style={{ width: '120px', height: '120px' }}
                sx={{ mb: 2, ml: 12 }}
              />
              <Skeleton
                variant="rectangular"
                style={{ width: '70%', height: '50px' }}
                sx={{ mb: 0.5 }}
              />
              <Skeleton
                variant="rectangular"
                style={{ width: '90%', height: '50px' }}
                sx={{ mb: 0.5 }}
              />
              <Skeleton variant="rectangular" style={{ width: '70%', height: '50px' }} />
            </>
          ) : (
            <>
              <Avatar
                className="avatar"
                {...stringAvatar(userNameCapitalFormation, { fontSize: '4rem' })}
              />
              <Box className="userNameWrapper">
                <Typography className="label">Full Name</Typography>
                <Typography className="userName">{userDetails?.userName}</Typography>
              </Box>
              <Box className="userEmailWrapper">
                <Typography className="label">Email</Typography>
                <Typography className="userEmail">{userDetails?.userEmail}</Typography>
              </Box>
              <Box className="roleWrapper">
                <Typography className="label">Role</Typography>
                <Typography className="role">{userDetails?.role}</Typography>
              </Box>
            </>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default UserDetails;
