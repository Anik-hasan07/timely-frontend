/* eslint-disable react/no-array-index-key */
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import LeftSidebar from '../../../components/LeftSidebar';
import Modal from '../../../components/Modal';
import SearchComponent from '../../../components/searchComponent/SearchComponent';
import { roles } from '../../../config/config';
import { toggleisInviteProjectUserModalOpen } from '../../../redux/reducers/projectReducer';
import InviteMember from '../../InviteMember/InviteMember';
import { activeUserFromProject, deleteProjectUsers, getProjectUsers } from './action';
import './style.scss';

function UserList() {
  const [modalOpen, setModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [userId, setUserId] = useState('');
  const userDetails = ['Name', 'E-mail', 'Status', 'Action'];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const dispatch = useDispatch();
  const { projectId } = useParams();
  const [status, setStatus] = useState('');
  const { userReducer, projectUserReducer, projectReducer } = useSelector((state) => state);
  const dispatchToggleisInviteProjectUserModalOpen = (_, reason) => {
    if (reason === 'backdropClick') {
      return;
    }
    dispatch(toggleisInviteProjectUserModalOpen());
  };

  useEffect(() => {
    dispatch(
      getProjectUsers({
        token: userReducer.token,
        projectId,
      })
    );
  }, []);

  const users = projectUserReducer?.users?.users || [];

  const userRole = userReducer?.userData?.role;

  const isAdmin = !!(String(userRole) === (roles.superAdmin || roles.admin));
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleInviteMember = () => {
    dispatchToggleisInviteProjectUserModalOpen();
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMenuOpen = (event, member) => {
    setUserId(member?.id);
    setStatus(member?.status);
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAction = async () => {
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    if (status === 'ACTIVE') {
      await dispatch(deleteProjectUsers({ projectId, userId, token: userReducer.token }));
    }
    if (status === 'INACTIVE') {
      await dispatch(
        activeUserFromProject({ projectId, userId, status: 'ACTIVE', token: userReducer.token })
      );
    }
    setModalOpen(false);
    await dispatch(getProjectUsers({ token: userReducer.token, projectId }));
  };

  const handleRemoveUser = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ff5722',
      customClass: {
        cancelButton: 'custom-cancel-button',
      },
      confirmButtonText: 'Remove',
    });

    if (result.isConfirmed) {
      dispatch(
        deleteProjectUsers({
          token: userReducer.token,
          projectId,
          userId: id,
        })
      );
      Swal.fire('USER!', 'User remove successfully', 'success');
    }
  };
  return (
    <div className="userList">
      <LeftSidebar />
      <div style={{ flexGrow: 1, marginTop: '40px' }}>
        {projectUserReducer.loading ? (
          <Box display="flex" justifyContent="center" marginTop="100px">
            <CircularProgress color="primary" />
          </Box>
        ) : (
          <Box>
            {users.length ? (
              <Box margin="30px 30px">
                <Box className="searchBtnWrapper">
                  <Box>
                    <SearchComponent />
                  </Box>
                  {userRole !== roles.user && (
                    <Button
                      variant="contained"
                      sx={{
                        width: 'auto',
                        textTransform: 'capitalize',
                        margin: '10px',
                      }}
                      onClick={handleInviteMember}
                    >
                      Invite Members
                    </Button>
                  )}
                </Box>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        {userDetails.map((detail, idx) => (
                          <TableCell sx={{ fontWeight: 'bold' }} key={idx}>
                            {detail}
                          </TableCell>
                        ))}
                        {isAdmin && <TableCell>Actions</TableCell>}
                      </TableRow>
                    </TableHead>
                    <TableBody style={{ border: '0px' }}>
                      {users.map((member) => (
                        <TableRow key={member.id} style={{ border: '0px', margin: '0px' }}>
                          <TableCell className="cell cell-text">{member?.userName}</TableCell>
                          <TableCell className="cell cell-text">{member?.userEmail}</TableCell>
                          <TableCell className="cell cell-text">
                            {member?.status?.toUpperCase()}
                          </TableCell>
                          <TableCell className="cell cell-text">
                            <div>
                              <IconButton
                                aria-controls="menu"
                                aria-haspopup="true"
                                onClick={(event) => handleMenuOpen(event, member)}
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
                                <MenuItem style={{ padding: '0px' }} onClick={handleMenuClose}>
                                  {status === 'ACTIVE' ? (
                                    <button
                                      type="button"
                                      style={{
                                        width: '100%',
                                        display: 'block',
                                        padding: '6px 16px',
                                      }}
                                      onClick={() => handleAction(member)}
                                    >
                                      INACTIVE
                                    </button>
                                  ) : (
                                    <button
                                      type="button"
                                      style={{
                                        width: '100%',
                                        display: 'block',
                                        padding: '6px 16px',
                                      }}
                                      onClick={() => handleAction(member)}
                                    >
                                      ACTIVE
                                    </button>
                                  )}
                                </MenuItem>
                              </Menu>
                            </div>
                          </TableCell>

                          {isAdmin && (
                            <TableCell>
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleRemoveUser(member.id)}
                              >
                                Remove
                              </Button>
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  <TablePagination
                    style={{ marginRight: '35%' }}
                    rowsPerPageOptions={[10, 20, 50]}
                    component="div"
                    count={users.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </TableContainer>
              </Box>
            ) : (
              <Typography textAlign="center" marginTop="100px" variant="h1">
                Where is everybody?
              </Typography>
            )}
          </Box>
        )}
      </div>
      <InviteMember
        isModalOpen={projectReducer?.isInviteProjectUserModalOpen}
        handleClickClose={dispatchToggleisInviteProjectUserModalOpen}
      />
      {status === 'ACTIVE' ? (
        <Modal
          open={modalOpen}
          setOpen={setModalOpen}
          title="Are you sure you want to inactive this user?"
          submitText="INACTIVE"
          handleSubmit={handleSubmit}
        />
      ) : (
        <Modal
          open={modalOpen}
          setOpen={setModalOpen}
          title="Are you sure you want to active this user?"
          submitText="ACTIVE"
          handleSubmit={handleSubmit}
        />
      )}
    </div>
  );
}

export default UserList;
