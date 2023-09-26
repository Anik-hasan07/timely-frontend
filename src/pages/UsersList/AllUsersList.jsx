/* eslint-disable no-underscore-dangle */
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import {
  Alert,
  Avatar,
  Box,
  CircularProgress,
  Container,
  Pagination,
  Paper,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useSelector } from 'react-redux';
import Modal from '../../components/Modal';
import SearchComponent from '../../components/searchComponent/SearchComponent';
import { apiEndpoint, roles } from '../../config/config';
import { useGetAllUsersQuery } from '../../redux/reducers/apiReducer';
import ActionMenu from './ActionMenu';
import EditProjectUser from './EditProjectUser';

const DEFAULT_STATUS = 'Active';
const USER_PER_PAGE = 3;

export default function AllUsersList() {
  const { projectId } = useParams();
  const {
    isLoading,
    data,
    isError,
    refetch: refetchAllUsers,
    isFetching,
  } = useGetAllUsersQuery(projectId);
  const [searchInput, setSearchInput] = useState('');
  const [paginationCount, setPaginationCount] = useState(0);
  const [selectedPaginationValue, setSelectedPaginationValue] = useState(0);
  const [idOfUserToDelete, setIdOfUserToDelete] = React.useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState(null);
  const navigate = useNavigate();
  const { userReducer } = useSelector((state) => state);

  const [editAbleData, setEditableData] = useState({});
  const [editModal, setEditModal] = useState(false);

  const onDelete = (userId) => {
    return () => {
      setIdOfUserToDelete(userId);
    };
  };

  const onShowDetail = (userId) => {
    navigate(`/users/${userId}`);
  };

  const onEdit = (userDetails) => {
    return () => {
      setEditModal(true);
      setEditableData(userDetails);
    };
  };

  const onSearchInputChange = (event) => {
    setSearchInput(event.currentTarget.value);
  };

  const isSearchedUser = (user, input) =>
    user.userEmail.toLowerCase().includes(input.toLowerCase()) ||
    user.userName.toLowerCase().includes(input.toLowerCase());

  const paginationOffset = selectedPaginationValue * USER_PER_PAGE;

  const getPaginatedUserLists = (userLists, offset) =>
    userLists?.slice(offset, offset + USER_PER_PAGE);

  const userLists = useMemo(() => {
    const filteredUsers = data?.data?.users?.filter((user) =>
      searchInput ? isSearchedUser(user, searchInput) : true
    );
    const filteredUserCount = filteredUsers?.length || 0;
    setPaginationCount(Math.ceil(filteredUserCount / USER_PER_PAGE));
    const paginatedUsers = getPaginatedUserLists(filteredUsers, paginationOffset);
    return paginatedUsers;
  }, [searchInput, data?.data?.users, paginationOffset, isFetching, refetchAllUsers]);

  useEffect(() => {
    setSelectedPaginationValue(0);
  }, [searchInput]);

  const onPaginationChange = (_, value) => setSelectedPaginationValue(value - 1);

  const handleCloseSnackBar = () => {
    setSnackbarMsg(false);
  };

  // eslint-disable-next-line no-unsafe-optional-chaining

  const deleteUser = async () => {
    try {
      const response = await fetch(`${apiEndpoint}/user/${idOfUserToDelete}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${userReducer.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status !== 200) {
        throw new Error('Failed to delete user');
      }
      setSnackbarMsg({ msg: 'Successfully deleted user', type: 'success' });
      setIdOfUserToDelete(null);
    } catch (error) {
      setSnackbarMsg({ msg: 'Failed to delete user', type: 'error' });
    }
  };

  return (
    <Container>
      {editAbleData.role && (
        <EditProjectUser
          isOpen={editModal}
          setOpen={setEditModal}
          editData={editAbleData}
          refetchAllUsers={refetchAllUsers}
        />
      )}

      <Box paddingTop={5}>
        {isLoading ? (
          <CircularProgress />
        ) : (
          <>
            <Snackbar
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
              open={!!snackbarMsg?.msg}
              autoHideDuration={6000}
              onClose={handleCloseSnackBar}
            >
              <Alert
                onClose={handleCloseSnackBar}
                severity={snackbarMsg?.type}
                sx={{ width: '100%' }}
              >
                {snackbarMsg?.msg}
              </Alert>
            </Snackbar>
            <Modal
              submitText="Delete"
              setOpen={setIdOfUserToDelete}
              title="Confirm Delete?"
              open={idOfUserToDelete}
              handleSubmit={deleteUser}
            >
              Are you sure you want to delete this user?
            </Modal>

            <UserList
              isFetchingError={isError}
              totalUserCount={data?.data?.users?.length}
              userRole={userReducer.userData?.role}
              users={userLists}
              onDelete={onDelete}
              onEdit={onEdit}
              onShowDetail={onShowDetail}
              onSearchInputChange={onSearchInputChange}
            />
            <PaginationView
              page={selectedPaginationValue + 1}
              paginationCount={paginationCount}
              onPaginationChange={onPaginationChange}
            />
          </>
        )}
      </Box>
    </Container>
  );
}

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

const UserSummary = ({ totalUserCount = 0, activeUserCount = 0 }) => {
  return (
    <Stack gap={3} direction="row" my={4}>
      <Stack direction="column">
        <Typography color="gray" variant="p">
          Total Users
        </Typography>
        <Typography mt={1} color="blue" variant="h4">
          {totalUserCount}
        </Typography>
      </Stack>
      <Stack direction="column">
        <Typography color="gray" variant="p">
          Active Users
        </Typography>
        <Typography mt={1} color="blue" variant="h4">
          {activeUserCount}
        </Typography>
      </Stack>
    </Stack>
  );
};

const UserList = ({
  users,
  userRole,
  isFetchingError,
  onDelete,
  onEdit,
  onShowDetail,
  onSearchInputChange,
  totalUserCount,
}) => {
  return (
    <div>
      <Box mb={2}>
        <Typography mb={2} variant="h5">
          Users
        </Typography>
        <Typography mb={2} variant="p">
          Manage product access for all the users in your organization
        </Typography>
      </Box>
      <UserSummary totalUserCount={totalUserCount} />
      <Box mb={2} maxWidth={400}>
        <SearchComponent placeHolder="Search with Name/Email" onChange={onSearchInputChange} />
      </Box>
      {isFetchingError ? (
        <Box p={2}>
          <Typography color="red" fontWeight="bold" variant="p">
            Error fetching users!
          </Typography>
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table aria-label="user list">
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users?.length === 0 && (
                <Box p={2}>
                  <Typography fontWeight="bold" variant="p">
                    No users found!
                  </Typography>
                </Box>
              )}
              {users?.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Stack direction="row">
                      <Avatar alt={user.username} src={user.avatar} />
                      <Stack ml={2}>
                        <Typography fontWeight="bold">{user.userName}</Typography>
                        <Typography>{user.userEmail}</Typography>
                      </Stack>
                    </Stack>
                  </TableCell>
                  <TableCell>{user?.role}</TableCell>
                  <TableCell>{user.status || DEFAULT_STATUS}</TableCell>
                  <TableCell>
                    {userRole === roles.admin || userRole === roles.superAdmin ? (
                      <ActionMenu
                        options={[
                          { label: 'Show details', onClick: () => onShowDetail(user.id) },
                          { label: 'Delete', onClick: onDelete(user.id) },
                          { label: 'Change Role', onClick: onEdit(user) },
                        ]}
                      />
                    ) : (
                      <ActionMenu
                        options={[{ label: 'Show details', onClick: () => onShowDetail(user.id) }]}
                      />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};
