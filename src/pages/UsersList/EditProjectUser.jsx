/* eslint-disable no-underscore-dangle */
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useUpdateUserRoleMutation } from '../../redux/user/userAPI';

const EditProjectUser = ({ isOpen, setOpen, editData, refetchAllUsers }) => {
  const [role, setRole] = useState(editData?.role);
  const [updateUserRole, { data, isLoading, isError, error, reset }] = useUpdateUserRoleMutation();
  const handleClose = () => {
    reset();
    setOpen(false);
  };

  const handleChange = (event) => {
    setRole(event.target.value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    await updateUserRole({ userId: editData.id, role: { role } });
    refetchAllUsers();
  };

  useEffect(() => {
    let timer;
    if (data?.status === 'success') {
      timer = setTimeout(() => {
        reset();
        setOpen(false);
      }, 1500);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [data, setOpen]);

  return (
    <Box>
      <Dialog open={isOpen} onClose={handleClose}>
        <form style={{ width: '400px' }} onSubmit={onSubmit}>
          <Box sx={{ padding: '15px 30px' }}>
            <Typography textAlign="center" variant="h5">
              Edit user Role
            </Typography>
            <Box mt={2}>
              <FormControl style={{ width: '100%' }}>
                <InputLabel id="demo-simple-select-label">Role</InputLabel>
                <Select defaultValue={role} label="Role" onChange={handleChange}>
                  <MenuItem value="User">User</MenuItem>
                  <MenuItem value="Admin">Admin</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {data?.status === 'success' && (
              <Alert severity="success" variant="outlined" sx={{ margin: '10px 0' }}>
                {data?.message}
              </Alert>
            )}

            {isError && (
              <Alert severity="error" variant="outlined" sx={{ margin: '10px 0' }}>
                {error?.data?.error || error?.error}
              </Alert>
            )}

            <DialogActions sx={{ padding: '10px 0 !important' }}>
              <Button disabled={isLoading} sx={{ fontWeight: '600' }} type="submit">
                Update
              </Button>

              <Button sx={{ fontWeight: '600' }} onClick={handleClose}>
                Cancel
              </Button>
            </DialogActions>
          </Box>
        </form>
      </Dialog>
    </Box>
  );
};

export default EditProjectUser;
