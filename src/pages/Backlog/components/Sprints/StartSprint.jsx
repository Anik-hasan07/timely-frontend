import { yupResolver } from '@hookform/resolvers/yup';
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { DateTimePicker, LocalizationProvider, renderTimeViewClock } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import * as yup from 'yup';
import { sprintStatus } from '../../../../config/config';
import { getActiveSprint, getProjectSprints } from '../../../../redux/reducers/sprintReducer';
import { useStartSprintMutation } from '../../../../redux/sprint/sprintAPI';

const StartSprint = () => {
  const startSprintValidation = yup.object({
    startDate: yup.date().required(),
    endDate: yup.date().required(),
  });
  const { projectId } = useParams();
  const [open, setOpen] = useState(false);
  const { activeSprint, tasks } = useSelector((state) => state.sprintReducer);
  const { token } = useSelector((state) => state.userReducer);
  const dispatch = useDispatch();
  const [startSprint, { data, isSuccess, error, isError, reset, isLoading }] =
    useStartSprintMutation();
  const { userReducer } = useSelector((state) => state);
  const orgId = userReducer.userData?.organizationId;

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(startSprintValidation),
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  const onSubmit = (values) => {
    const sprintData = {
      sprintId: activeSprint?.sprintId,
      startDate: values.startDate,
      endDate: values.endDate,
    };
    startSprint(sprintData);
  };

  useEffect(() => {
    if (data?.status === 'success') {
      dispatch(getProjectSprints({ token, projectId }));
      setTimeout(() => {
        setOpen(false);
        reset();
      }, 1500);
    }
  }, [data, dispatch, projectId, reset, token]);

  useEffect(() => {
    dispatch(getActiveSprint({ orgId, token: userReducer.token, projectId }));
  }, [orgId, projectId, userReducer.token]);
  const noOfIssues = tasks?.length;
  return (
    <Box>
      {activeSprint?.sprintStatus !== sprintStatus.running && (
        <Button
          onClick={handleClickOpen}
          disabled={tasks?.length === 0}
          sx={{
            textTransform: 'capitalize',
            margin: '0 18px',
          }}
          variant="contained"
        >
          Start Sprint
        </Button>
      )}

      <Dialog open={open} onClose={handleClose} maxWidth="sm">
        <Box m={3} mb={0}>
          <Typography variant="h6">Start sprint</Typography>
          <Typography mt={2} variant="body2">
            <Typography component="span" fontWeight="bold" display="inline">
              {noOfIssues}
            </Typography>{' '}
            issues will be included in this sprint.
          </Typography>
        </Box>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                {/* <Controller
                  name="sprintName"
                  control={control}
                  defaultValue={activeSprint.sprintName || ''}
                  render={({ field: { onChange, value } }) => (
                    <TextField
                      size="small"
                      fullWidth
                      value={value}
                      disabled={isLoading}
                      onChange={onChange}
                      label="Sprint name"
                      error={!!errors.sprintName}
                      helperText={errors.sprintName ? errors.sprintName.message : null}
                    />
                  )}
                /> */}
              </Grid>

              <Grid item xs={6}>
                <Controller
                  name="startDate"
                  control={control}
                  defaultValue={dayjs()}
                  render={({ field: { onChange, value } }) => (
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DateTimePicker
                        slotProps={{ textField: { size: 'small' } }}
                        sx={{ width: '100%' }}
                        value={value}
                        onChange={onChange}
                        label="Start Date"
                        format="DD/MM/YYYY hh:mm A"
                        ampm
                        viewRenderers={{
                          hours: renderTimeViewClock,
                          minutes: renderTimeViewClock,
                          seconds: renderTimeViewClock,
                        }}
                      />
                    </LocalizationProvider>
                  )}
                />
              </Grid>

              <Grid item xs={6}>
                <Controller
                  name="endDate"
                  control={control}
                  defaultValue={dayjs().add(2, 'week')}
                  render={({ field: { onChange, value } }) => (
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DateTimePicker
                        slotProps={{ textField: { size: 'small' } }}
                        sx={{ width: '100%' }}
                        value={value}
                        disabled={isLoading}
                        onChange={onChange}
                        label="End Date"
                        format="DD/MM/YYYY hh:mm A"
                        ampm
                        viewRenderers={{
                          hours: renderTimeViewClock,
                          minutes: renderTimeViewClock,
                          seconds: renderTimeViewClock,
                        }}
                      />
                    </LocalizationProvider>
                  )}
                />
              </Grid>
            </Grid>

            {isSuccess && data?.status === 'success' && (
              <Box mt={2}>
                <Alert variant="outlined" severity="success">
                  {data?.message}
                </Alert>
              </Box>
            )}

            {isError && (
              <Box mt={2}>
                <Alert variant="outlined" severity="error">
                  {error?.error}
                </Alert>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              disabled={isLoading}
              type="submit"
              sx={{ textTransform: 'capitalize' }}
              autoFocus
            >
              Start
            </Button>
            <Button variant="text" sx={{ textTransform: 'capitalize' }} onClick={handleClose}>
              Cancel
            </Button>
          </DialogActions>{' '}
        </form>
      </Dialog>
    </Box>
  );
};

export default StartSprint;
