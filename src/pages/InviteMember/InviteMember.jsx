/* eslint-disable no-undef */
import { yupResolver } from '@hookform/resolvers/yup';
import ClearIcon from '@mui/icons-material/Clear';
import { LoadingButton } from '@mui/lab';
import {
  Alert,
  Autocomplete,
  Dialog,
  DialogContent,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import * as yup from 'yup';
import { useGetProjectsQuery } from '../../redux/api/apiSlice';
import { useInviteProjectUsersMutation } from '../../redux/inviteProject/inviteProjectAPI';
import { getProjectUsers } from '../AllProjects/ProjectSettings/action';

const InviteMember = ({ isModalOpen, handleClickClose }) => {
  const { userReducer, projectReducer } = useSelector((state) => state);
  const { data, isLoading, error, isError } = useGetProjectsQuery();
  const inviteUserValidationSchema = yup.object({
    project: yup
      .object()
      .typeError('Project select is required')
      .required('Project select is required'),
    userEmail: yup.string().trim().email().required('User email is required'),
  });

  const [projects, setProjects] = useState([]);
  const { projectId: selectedId } = useParams();
  const dispatch = useDispatch();
  const [showTagValue, setShowTagValue] = useState(true);

  const [
    inviteProjectUsers,
    {
      data: inviteResponse,
      isLoading: inviteIsloading,
      error: inviteError,
      isError: inviteIsError,
    },
  ] = useInviteProjectUsersMutation();

  const {
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(inviteUserValidationSchema),
  });

  useEffect(() => {
    if (projects.length > 0) {
      const selectedProject = projects.find((ele) => ele.value === selectedId);
      setValue('project', selectedProject);
    }
  }, [projects]);

  const onSubmit = async (values) => {
    inviteProjectUsers({
      projectId: values?.project?.value,
      emails: { emails: [values?.userEmail] },
    });
  };

  useEffect(() => {
    if (data?.status === 'success') {
      const modiFyprojects = data?.data?.projects?.map(({ projectName, projectId }) => ({
        title: projectName,
        value: projectId,
      }));
      setProjects(modiFyprojects);
    }
  }, [data, data?.status]);

  useEffect(() => {
    if (inviteResponse?.status === 'success') {
      reset();
      toast.success(inviteResponse?.message);
      setShowTagValue(false);
      handleClickClose();
      dispatch(
        getProjectUsers({
          token: userReducer.token,
          projectId: projectReducer?.selectedProject?.projectId,
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inviteResponse?.message, inviteResponse?.status, reset]);

  useEffect(() => {
    if (inviteIsError) {
      console.log(inviteError);
    }
  }, [inviteError, inviteIsError]);

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Dialog open={isModalOpen} fullWidth keepMounted onClose={handleClickClose}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box padding="24px 24px 0px" className="dialogHeader">
            <Typography variant="h6">Invite Member</Typography>
            <ClearIcon onClick={handleClickClose} style={{ cursor: 'pointer' }} />
          </Box>
          <DialogContent>
            <Grid>
              <Grid item xs={12}>
                <Controller
                  name="project"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Autocomplete
                      disabled={isLoading && projects.length === 0}
                      onChange={(e, item) => {
                        onChange(item);
                      }}
                      value={value || null}
                      getOptionLabel={(option) => option?.title || ''}
                      isOptionEqualToValue={(option, optionValue) =>
                        optionValue === undefined ||
                        optionValue === '' ||
                        option?.value === optionValue?.value
                      }
                      renderOption={(props, option) => {
                        return (
                          <li {...props} key={option.value}>
                            {option.title}
                          </li>
                        );
                      }}
                      options={projects}
                      renderInput={(params) => (
                        <TextField
                          helperText={errors.project ? errors.project.message : null}
                          error={!!errors.project}
                          {...params}
                          label="Select Project"
                        />
                      )}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} mt={2}>
                <Controller
                  name="userEmail"
                  control={control}
                  defaultValue=""
                  render={({ field: { onChange, value } }) => (
                    // <Autocomplete
                    //   multiple={false}
                    //   options={[]}
                    //   freeSolo
                    //   autoSelect
                    //   renderTags={(tagsValue, getTagProps) =>
                    //     showTagValue &&
                    //     tagsValue.map((option, index) => (
                    //       <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                    //     ))
                    //   }
                    //   onChange={(event, values) => {
                    //     onChange(values);
                    //   }}
                    //   renderInput={(params) => (
                    //     <TextField
                    //       {...params}
                    //       label="User email"
                    //       helperText={
                    //         errors.userEmail
                    //           ? errors.userEmail.message || errors.userEmail[0]?.message
                    //           : null
                    //       }
                    //       error={!!errors.userEmail}
                    //     />
                    //   )}
                    // />
                    <TextField
                      style={{ width: '100%' }}
                      id="outlined-basic"
                      label="User Email"
                      variant="outlined"
                      onChange={onChange}
                      value={value}
                      error={!!errors.userEmail}
                      helperText={errors.userEmail ? errors.userEmail.message : null}
                    />
                  )}
                />
              </Grid>
            </Grid>
            <Box mt={2} textAlign="end">
              <LoadingButton
                loading={inviteIsloading}
                sx={{ textTransform: 'capitalize' }}
                type="submit"
                variant="contained"
              >
                <span>Invite</span>
              </LoadingButton>
            </Box>
            {isError && (
              <Box mt={2}>
                <Alert severity="error">{error?.data?.message || error.error}</Alert>
              </Box>
            )}
          </DialogContent>
        </form>
      </Dialog>
    </>
  );
};

export default InviteMember;
